"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Trash2
} from "lucide-react"
import {
  ApiError,
  extractFileName,
  getAllReports,
  getFullReport,
  getReportOverview,
  getRiskLevelFromScore,
  type ReportListItem,
} from "@/lib/api"

interface Report {
  id: number
  name: string
  type: string
  date: string
  status: "analyzed" | "processing" | "pending"
  riskLevel: "low" | "medium" | "high"
  parameters: string
}

function resolveReportType(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "Medical Report"
  }

  const candidate = (data as { report_type?: unknown }).report_type
  return typeof candidate === "string" && candidate.trim().length > 0
    ? candidate
    : "Medical Report"
}

function resolveReportStatus(parameterCount: number): "analyzed" | "processing" | "pending" {
  if (parameterCount > 0) {
    return "analyzed"
  }

  return "pending"
}

function normalizeRiskLevel(value: unknown): "low" | "medium" | "high" {
  if (typeof value !== "string") {
    return "medium"
  }

  const normalized = value.trim().toLowerCase()
  if (normalized === "low" || normalized === "medium" || normalized === "high") {
    return normalized
  }

  return "medium"
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterRisk, setFilterRisk] = useState("all")

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      setError(null)

      try {
        const list = await getAllReports(100)
        const mapped = await Promise.all(
          list.map(async (item: ReportListItem) => {
            try {
              const [fullReport, overview] = await Promise.all([
                getFullReport(item.id),
                getReportOverview(item.id),
              ])
              const parameterCount = Array.isArray(fullReport.parameters)
                ? fullReport.parameters.length
                : 0
              const riskScore = Number(overview.overall_risk_score) || 0

              return {
                id: item.id,
                name: extractFileName(item.file_url),
                type: resolveReportType(fullReport.structured_data),
                date: item.created_at || fullReport.created_at || new Date().toISOString(),
                status: resolveReportStatus(parameterCount),
                riskLevel: normalizeRiskLevel(overview.risk_level) || getRiskLevelFromScore(riskScore),
                parameters: parameterCount > 0 ? String(parameterCount) : "-",
              }
            } catch {
              const score = item.overall_risk_score || 0
              return {
                id: item.id,
                name: extractFileName(item.file_url),
                type: "Medical Report",
                date: item.created_at || new Date().toISOString(),
                status: "pending" as const,
                riskLevel: getRiskLevelFromScore(score),
                parameters: "-",
              }
            }
          })
        )

        setReports(mapped)
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Failed to load reports"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === "all" || report.type === filterType
      const matchesRisk = filterRisk === "all" || report.riskLevel === filterRisk
      return matchesSearch && matchesType && matchesRisk
    })
  }, [reports, searchQuery, filterType, filterRisk])

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low": return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Low Risk</Badge>
      case "medium": return <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning/20">Medium Risk</Badge>
      case "high": return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">High Risk</Badge>
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "analyzed": return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Analyzed</Badge>
      case "processing": return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Processing</Badge>
      case "pending": return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Pending</Badge>
      default: return null
    }
  }

  const totalReports = reports.length
  const highRiskCount = reports.filter((r) => r.riskLevel === "high").length
  const mediumRiskCount = reports.filter((r) => r.riskLevel === "medium").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Reports</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your medical reports
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/reports/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload Report
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalReports}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{highRiskCount}</p>
                <p className="text-sm text-muted-foreground">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
                <AlertTriangle className="h-6 w-6 text-warning-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mediumRiskCount}</p>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-37.5">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Medical Report">Medical Report</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-37.5">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-sm text-muted-foreground mb-4">Loading reports...</div>
          )}

          {error && (
            <div className="text-sm text-destructive mb-4">{error}</div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Parameters</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        {report.name}
                      </div>
                    </TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(report.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{report.parameters}</TableCell>
                    <TableCell>{getRiskBadge(report.riskLevel)}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/reports/${report.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!loading && filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No reports found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
