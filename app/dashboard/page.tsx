"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Heart,
  Activity,
  Droplet,
  ArrowRight,
  Clock,
  Sparkles,
  Plus,
  X
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import {
  ApiError,
  extractFileName,
  getAllReports,
  getReportOverview,
  getRiskLevelFromScore,
  hydrateReportById,
  type ReportListItem,
  type ReportOverview,
  uploadReport,
} from "@/lib/api"

interface HealthMetric {
  name: string
  value: string
  status: "normal" | "warning" | "danger"
  icon: React.ElementType
  change?: string
}

const mockMetrics: HealthMetric[] = [
  { name: "Blood Glucose", value: "142 mg/dL", status: "warning", icon: Droplet, change: "+12%" },
  { name: "Heart Rate", value: "72 bpm", status: "normal", icon: Heart, change: "-2%" },
  { name: "Hemoglobin", value: "13.5 g/dL", status: "normal", icon: Activity, change: "+5%" },
  { name: "Cholesterol", value: "210 mg/dL", status: "warning", icon: TrendingUp, change: "+8%" },
]

const quickActions = [
  { title: "Upload Report", href: "/dashboard/reports/upload", icon: Upload, color: "bg-primary" },
  { title: "View Diet Plan", href: "/dashboard/diet", icon: Activity, color: "bg-accent" },
  { title: "Find Generic Medicine", href: "/dashboard/medicine", icon: FileText, color: "bg-chart-3" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("there")
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [latestOverview, setLatestOverview] = useState<ReportOverview | null>(null)
  const [reportsError, setReportsError] = useState<string | null>(null)

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      const profile = JSON.parse(storedProfile)
      if (profile.name) {
        setUserName(profile.name.split(" ")[0])
      }
    }
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setReportsError(null)

      try {
        const list = await getAllReports(20)
        setReports(list)

        if (list.length > 0) {
          try {
            const overview = await getReportOverview(list[0].id)
            setLatestOverview(overview)
          } catch {
            setLatestOverview(null)
          }
        }
      } catch (error) {
        const message = error instanceof ApiError ? error.message : "Failed to load dashboard data"
        setReportsError(message)
      }
    }

    fetchDashboardData()
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
    toast.success(`${acceptedFiles.length} file(s) added for analysis`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one file")
      return
    }
    
    setUploading(true)

    try {
      let firstReportId: number | null = null

      for (const file of uploadedFiles) {
        const result = await uploadReport(file)

        // Immediately hydrate all report sections using every GET endpoint.
        await hydrateReportById(result.report_id)

        firstReportId ??= result.report_id
      }

      setUploadedFiles([])
      const targetRoute = firstReportId === null
        ? "/dashboard/reports"
        : `/dashboard/reports/${firstReportId}`

      toast.success("Reports uploaded successfully!", {
        description: "Your AI-powered analysis is ready.",
        action: {
          label: "View Reports",
          onClick: () => router.push(targetRoute)
        }
      })
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Upload failed. Please try again."
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-success bg-success/10"
      case "warning": return "text-warning-foreground bg-warning/20"
      case "danger": return "text-destructive bg-destructive/10"
      default: return "text-muted-foreground bg-muted"
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low": return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Low Risk</Badge>
      case "medium": return <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning/20">Medium Risk</Badge>
      case "high": return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">High Risk</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your health insights
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/reports/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload New Report
          </Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-border group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Upload Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Report Analysis
          </CardTitle>
          <CardDescription>
            Upload your blood test or medical report for instant AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`h-10 w-10 mx-auto mb-4 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-foreground font-medium">
              {isDragActive ? "Drop your files here" : "Drag & drop your reports here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse (PDF, PNG, JPG up to 10MB)
            </p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={handleAnalyze} disabled={uploading} className="w-full mt-4">
                {uploading ? "Analyzing..." : "Analyze Reports"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {reportsError && (
        <div className="text-sm text-destructive">{reportsError}</div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Health Metrics</h2>
          <Link href="/dashboard/trends" className="text-sm text-primary hover:underline">
            View All Trends
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(latestOverview
            ? Object.entries(latestOverview.risks)
                .filter(([key]) => key !== "overall")
                .slice(0, 4)
                .map(([name, value], index) => {
                  const level = getRiskLevelFromScore(value)
                  let status: "normal" | "warning" | "danger" = "normal"

                  if (level === "high") {
                    status = "danger"
                  } else if (level === "medium") {
                    status = "warning"
                  }

                  return {
                    name: name.replaceAll("_", " "),
                    value: `${value}%`,
                    status,
                    icon: [Droplet, Heart, Activity, TrendingUp][index % 4],
                  }
                })
            : mockMetrics
          ).map((metric) => (
            <Card key={metric.name} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getStatusColor(metric.status)}`}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                  {metric.change && (
                    <span className={`text-xs font-medium ${
                      metric.change.startsWith("+") ? "text-destructive" : "text-success"
                    }`}>
                      {metric.change}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Reports and Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Link href="/dashboard/reports" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {reports.slice(0, 3).map((report) => (
              <Link key={report.id} href={`/dashboard/reports/${report.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{extractFileName(report.file_url)}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {report.created_at ? new Date(report.created_at).toLocaleDateString() : "-"}
                      </div>
                    </div>
                  </div>
                  {getRiskBadge(getRiskLevelFromScore(report.overall_risk_score))}
                </div>
              </Link>
            ))}

            {reports.length === 0 && (
              <p className="text-sm text-muted-foreground">No reports yet. Upload a report to get started.</p>
            )}
          </CardContent>
        </Card>

        {/* Risk Overview */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
            <CardDescription>Based on your latest reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(latestOverview
              ? Object.entries(latestOverview.risks)
                  .filter(([key]) => key !== "overall")
                  .slice(0, 4)
                  .map(([name, risk]) => ({
                    name: name.replaceAll("_", " "),
                    risk,
                    status: getRiskLevelFromScore(risk),
                  }))
              : [
                  { name: "Diabetes", risk: 72, status: "high" as const },
                  { name: "Heart Disease", risk: 45, status: "medium" as const },
                  { name: "Anemia", risk: 18, status: "low" as const },
                  { name: "Liver Issues", risk: 22, status: "low" as const },
                ]
            ).map((item) => {
              let progressClassName = "[&>div]:bg-success"

              if (item.status === "high") {
                progressClassName = "[&>div]:bg-destructive"
              } else if (item.status === "medium") {
                progressClassName = "[&>div]:bg-warning"
              }

              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.risk}%</span>
                      {item.status === "high" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      {item.status === "medium" && <AlertTriangle className="h-4 w-4 text-warning-foreground" />}
                      {item.status === "low" && <CheckCircle2 className="h-4 w-4 text-success" />}
                    </div>
                  </div>
                  <Progress value={item.risk} className={`h-2 ${progressClassName}`} />
                </div>
              )
            })}

            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full" asChild>
                <Link href={reports[0] ? `/dashboard/reports/${reports[0].id}` : "/dashboard/reports"}>
                  View Detailed Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">AI Health Insight</h3>
              <p className="text-muted-foreground">
                {latestOverview?.ai_summary || "Upload a report to receive your AI health insight."}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button size="sm" asChild>
                  <Link href="/dashboard/diet">View Diet Plan</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={reports[0] ? `/dashboard/reports/${reports[0].id}` : "/dashboard/reports"}>See Full Analysis</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
