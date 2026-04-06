const DEFAULT_API_BASE_URL = "http://localhost:5000"

export class ApiError extends Error {
  status: number
  details: unknown

  constructor(message: string, status: number, details: unknown = null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || ""

  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const errorValue =
      typeof payload === "object" && payload !== null && "error" in payload
        ? (payload as { error?: unknown }).error
        : null

    let message = `Request failed with status ${response.status}`

    if (typeof errorValue === "string") {
      message = errorValue
    } else if (errorValue !== null && errorValue !== undefined) {
      message = JSON.stringify(errorValue)
    }

    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, init)
  return parseResponse<T>(response)
}

export interface UploadReportResponse {
  report_id: number
  message: string
}

export interface ReportListItem {
  id: number
  created_at: string | null
  overall_risk_score: number
  file_url: string
}

export interface ReportOverview {
  overall_risk_score: number
  risk_level: string
  risks: Record<string, number>
  key_findings: string[]
  ai_summary: string
}

export interface ReportParameter {
  name: string
  value: number | string
  unit?: string
  normal_range?: string
  status?: string
}

export interface ReportParametersResponse {
  parameters: ReportParameter[]
}

export interface ReportAiSummary {
  summary: string
  root_causes: string[]
  recommendations: string[]
}

export interface ReportRecommendations {
  home_remedies: Array<string | Record<string, unknown>>
  medications: Array<string | Record<string, unknown>>
  lifestyle_changes: Array<string | Record<string, unknown>>
}

export interface ReportDietPlan {
  calories: number
  protein: number
  carbs: number
  fiber: number
  meals: Record<string, string>
}

export interface FullReport {
  id: number
  user_id?: number | null
  file_url: string
  created_at?: string | null
  structured_data?: Record<string, unknown>
  risk_scores?: Record<string, number>
  parameters?: ReportParameter[]
  key_findings?: string[]
  ai_summary?: Record<string, unknown>
  recommendations?: Record<string, unknown>
  diet_plan?: Record<string, unknown>
}

export interface HydratedReportData {
  fullReport: FullReport
  overview: ReportOverview
  parameters: ReportParametersResponse
  aiSummary: ReportAiSummary
  recommendations: ReportRecommendations
  dietPlan: ReportDietPlan
}

export async function uploadReport(file: File, userId?: number) {
  const formData = new FormData()
  formData.append("file", file)

  if (typeof userId === "number") {
    formData.append("user_id", String(userId))
  }

  return request<UploadReportResponse>("/api/reports/upload", {
    method: "POST",
    body: formData,
  })
}

export async function getAllReports(limit = 100) {
  return request<ReportListItem[]>(`/api/reports?limit=${limit}`)
}

export async function getFullReport(reportId: number) {
  return request<FullReport>(`/api/reports/${reportId}`)
}

export async function getReportOverview(reportId: number) {
  return request<ReportOverview>(`/api/reports/${reportId}/overview`)
}

export async function getReportParameters(reportId: number) {
  return request<ReportParametersResponse>(`/api/reports/${reportId}/parameters`)
}

export async function getReportAiSummary(reportId: number) {
  return request<ReportAiSummary>(`/api/reports/${reportId}/ai-summary`)
}

export async function getReportRecommendations(reportId: number) {
  return request<ReportRecommendations>(`/api/reports/${reportId}/recommendations`)
}

export async function getReportDietPlan(reportId: number) {
  return request<ReportDietPlan>(`/api/reports/${reportId}/diet-plan`)
}

export async function hydrateReportById(reportId: number): Promise<HydratedReportData> {
  const [fullReport, overview, parameters, aiSummary, recommendations, dietPlan] = await Promise.all([
    getFullReport(reportId),
    getReportOverview(reportId),
    getReportParameters(reportId),
    getReportAiSummary(reportId),
    getReportRecommendations(reportId),
    getReportDietPlan(reportId),
  ])

  return {
    fullReport,
    overview,
    parameters,
    aiSummary,
    recommendations,
    dietPlan,
  }
}

export function getRiskLevelFromScore(score: number): "low" | "medium" | "high" {
  if (score < 33) {
    return "low"
  }

  if (score < 67) {
    return "medium"
  }

  return "high"
}

export function extractFileName(filePath: string) {
  if (!filePath) {
    return "Medical Report"
  }

  const normalized = filePath.replaceAll("\\", "/")
  const parts = normalized.split("/")
  const fileName = parts.at(-1) || "Medical Report"

  return fileName
}