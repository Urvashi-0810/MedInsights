"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  ArrowRight,
  Pill,
  Salad,
  Activity,
} from "lucide-react"
import {
  ApiError,
  extractFileName,
  getRiskLevelFromScore,
  getFullReport,
  getReportAiSummary,
  getReportDietPlan,
  getReportOverview,
  getReportParameters,
  getReportRecommendations,
  type ReportAiSummary,
  type ReportDietPlan,
  type ReportOverview,
  type ReportParameter,
  type ReportRecommendations,
} from "@/lib/api"

type Priority = "high" | "medium" | "low"

interface RecommendationItem {
  key: string
  title: string
  description: string
  priority: Priority
}

function normalizePriority(value: unknown): Priority {
  if (typeof value !== "string") {
    return "medium"
  }

  const normalized = value.toLowerCase()
  if (normalized === "high" || normalized === "low") {
    return normalized
  }

  return "medium"
}

function normalizeRecommendationList(items: Array<string | Record<string, unknown>>): RecommendationItem[] {
  return items.map((item, index) => {
    if (typeof item === "string") {
      return {
        key: `${item}-${index}`,
        title: item,
        description: "",
        priority: "medium",
      }
    }

    const rawTitle = item.title ?? item.name ?? item.medicine
    const rawDescription = item.description

    const title = typeof rawTitle === "string" ? rawTitle : `Item ${index + 1}`
    const description = typeof rawDescription === "string" ? rawDescription : ""

    return {
      key: `${title}-${index}`,
      title,
      description,
      priority: normalizePriority(item.priority),
    }
  })
}

function getPriorityBadge(priority: Priority) {
  if (priority === "high") {
    return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">High Priority</Badge>
  }

  if (priority === "low") {
    return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Low</Badge>
  }

  return <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning/20">Medium</Badge>
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>()
  const reportId = Number(params.id)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [reportName, setReportName] = useState("Medical Report")
  const [reportDate, setReportDate] = useState<string | null>(null)

  const [overview, setOverview] = useState<ReportOverview | null>(null)
  const [parameters, setParameters] = useState<ReportParameter[]>([])
  const [aiSummary, setAiSummary] = useState<ReportAiSummary | null>(null)
  const [recommendations, setRecommendations] = useState<ReportRecommendations | null>(null)
  const [dietPlan, setDietPlan] = useState<ReportDietPlan | null>(null)

  useEffect(() => {
    const fetchReportData = async () => {
      if (Number.isNaN(reportId)) {
        setError("Invalid report ID")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [fullReport, overviewRes, paramsRes, summaryRes, recsRes, dietRes] = await Promise.all([
          getFullReport(reportId),
          getReportOverview(reportId),
          getReportParameters(reportId),
          getReportAiSummary(reportId),
          getReportRecommendations(reportId),
          getReportDietPlan(reportId),
        ])

        setReportName(extractFileName(fullReport.file_url))
        setReportDate(fullReport.created_at || null)
        setOverview(overviewRes)
        setParameters(paramsRes.parameters || [])
        setAiSummary(summaryRes)
        setRecommendations(recsRes)
        setDietPlan(dietRes)
      } catch (err: unknown) {
        const message = err instanceof ApiError ? err.message : "Failed to load report"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchReportData()
  }, [reportId])

  const riskEntries = useMemo(() => {
    if (!overview?.risks) {
      return [] as Array<{ name: string; value: number; level: "low" | "medium" | "high" }>
    }

    return Object.entries(overview.risks)
      .filter(([key]) => key !== "overall")
      .map(([name, value]) => ({
        name: name.replaceAll("_", " "),
        value,
        level: getRiskLevelFromScore(value),
      }))
  }, [overview])

  const homeRemedies = normalizeRecommendationList(recommendations?.home_remedies || [])
  const medications = normalizeRecommendationList(recommendations?.medications || [])
  const lifestyleChanges = normalizeRecommendationList(recommendations?.lifestyle_changes || [])

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading report...</div>
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-destructive">{error}</div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/reports">Back to reports</Link>
        </Button>
      </div>
    )
  }

  const overallScore = overview?.overall_risk_score ?? 0
  const overallLevel = getRiskLevelFromScore(overallScore)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{reportName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span>{reportDate ? new Date(reportDate).toLocaleDateString("en-US", { dateStyle: "long" }) : "Date unavailable"}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Report #{reportId}</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">Overall Health Risk Score</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-foreground">{overallScore}</span>
                <span className="text-xl text-muted-foreground mb-2">/100</span>
                <Badge variant="outline" className="mb-2 capitalize">{overallLevel} Risk</Badge>
              </div>
              <Progress value={overallScore} className="h-3 mt-4" />
            </div>
            <Separator orientation="vertical" className="hidden md:block h-24" />
            <div className="grid grid-cols-2 gap-4">
              {riskEntries.slice(0, 4).map((entry) => (
                <div key={entry.name} className="text-center">
                  <p className="text-2xl font-bold text-foreground">{entry.value}%</p>
                  <p className="text-sm text-muted-foreground capitalize">{entry.name}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="w-full md:w-auto grid grid-cols-5 md:flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
          <TabsTrigger value="diet">Diet</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning-foreground" />
                Key Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(overview?.key_findings || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No key findings available.</p>
              ) : (
                <div className="space-y-2">
                  {(overview?.key_findings || []).map((finding: string) => (
                    <div key={finding} className="p-3 rounded-lg border border-border bg-muted/30">
                      <p className="text-sm text-foreground">{finding}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">AI Quick Summary</h3>
                  <p className="text-muted-foreground">{overview?.ai_summary || "Summary unavailable."}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Test Parameters</CardTitle>
              <CardDescription>Detailed breakdown of all measured values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parameters.map((param) => (
                  <div key={`${param.name}-${String(param.value)}`} className="p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{param.name}</span>
                      <Badge variant="outline">{param.status || "Unknown"}</Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">{param.value}</span>
                      <span className="text-sm text-muted-foreground">{param.unit || ""}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Normal Range: {param.normal_range || "Not available"}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-summary" className="mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{aiSummary?.summary || "Summary unavailable."}</p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Root Causes</h3>
                <ul className="space-y-1">
                  {(aiSummary?.root_causes || []).map((cause: string) => (
                    <li key={cause} className="text-sm text-muted-foreground">- {cause}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Recommendations</h3>
                <ul className="space-y-1">
                  {(aiSummary?.recommendations || []).map((item: string) => (
                    <li key={item} className="text-sm text-muted-foreground">- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 p-4 rounded-lg bg-muted">
                <Info className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground">This AI-generated summary is for informational purposes only. Please consult a healthcare professional.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6 mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Salad className="h-5 w-5 text-accent" />
                Home Remedies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {homeRemedies.map((item) => (
                  <div key={item.key} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                      <Salad className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{item.title}</span>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medications.map((item) => (
                  <div key={item.key} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{item.title}</span>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/medicine?search=${encodeURIComponent(item.title)}`}>Find Generic</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-success" />
                Lifestyle Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lifestyleChanges.map((item) => (
                  <div key={item.key} className="flex items-start gap-3 p-4 rounded-lg bg-success/5 border border-success/20">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/dashboard/diet">
                    View Personalized Diet Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diet" className="mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Diet Plan</CardTitle>
              <CardDescription>Generated from your report analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="text-xl font-semibold">{dietPlan?.calories ?? 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="text-xl font-semibold">{dietPlan?.protein ?? 0}g</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="text-xl font-semibold">{dietPlan?.carbs ?? 0}g</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-xs text-muted-foreground">Fiber</p>
                  <p className="text-xl font-semibold">{dietPlan?.fiber ?? 0}g</p>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(dietPlan?.meals || {}).map(([meal, value]) => (
                  <div key={meal} className="p-3 rounded-lg border border-border">
                    <p className="text-sm font-semibold capitalize">{meal}</p>
                    <p className="text-sm text-muted-foreground">{String(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
