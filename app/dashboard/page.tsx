"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
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

interface HealthMetric {
  name: string
  value: string
  status: "normal" | "warning" | "danger"
  icon: React.ElementType
  change?: string
}

interface Report {
  id: string
  name: string
  date: string
  status: "analyzed" | "processing" | "pending"
  riskLevel: "low" | "medium" | "high"
}

const mockMetrics: HealthMetric[] = [
  { name: "Blood Glucose", value: "142 mg/dL", status: "warning", icon: Droplet, change: "+12%" },
  { name: "Heart Rate", value: "72 bpm", status: "normal", icon: Heart, change: "-2%" },
  { name: "Hemoglobin", value: "13.5 g/dL", status: "normal", icon: Activity, change: "+5%" },
  { name: "Cholesterol", value: "210 mg/dL", status: "warning", icon: TrendingUp, change: "+8%" },
]

const mockReports: Report[] = [
  { id: "1", name: "Complete Blood Count", date: "2024-01-15", status: "analyzed", riskLevel: "medium" },
  { id: "2", name: "Lipid Profile", date: "2024-01-10", status: "analyzed", riskLevel: "high" },
  { id: "3", name: "Thyroid Panel", date: "2024-01-05", status: "analyzed", riskLevel: "low" },
]

const quickActions = [
  { title: "Upload Report", href: "/dashboard/reports/upload", icon: Upload, color: "bg-primary" },
  { title: "View Diet Plan", href: "/dashboard/diet", icon: Activity, color: "bg-accent" },
  { title: "Find Generic Medicine", href: "/dashboard/medicine", icon: FileText, color: "bg-chart-3" },
]

export default function DashboardPage() {
  const [userName, setUserName] = useState("there")
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      const profile = JSON.parse(storedProfile)
      if (profile.name) {
        setUserName(profile.name.split(" ")[0])
      }
    }
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
    // Simulate upload and analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUploading(false)
    setUploadedFiles([])
    toast.success("Reports uploaded! Analysis will be ready shortly.", {
      action: {
        label: "View Reports",
        onClick: () => window.location.href = "/dashboard/reports"
      }
    })
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
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
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
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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

      {/* Health Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Health Metrics</h2>
          <Link href="/dashboard/trends" className="text-sm text-primary hover:underline">
            View All Trends
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockMetrics.map((metric, index) => (
            <Card key={index} className="border-border">
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
            {mockReports.map((report) => (
              <Link key={report.id} href={`/dashboard/reports/${report.id}`}>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{report.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(report.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {getRiskBadge(report.riskLevel)}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Risk Overview */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
            <CardDescription>Based on your latest reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Diabetes", risk: 72, status: "high" },
              { name: "Heart Disease", risk: 45, status: "medium" },
              { name: "Anemia", risk: 18, status: "low" },
              { name: "Liver Issues", risk: 22, status: "low" },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{item.risk}%</span>
                    {item.status === "high" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    {item.status === "medium" && <AlertTriangle className="h-4 w-4 text-warning-foreground" />}
                    {item.status === "low" && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                </div>
                <Progress 
                  value={item.risk} 
                  className={`h-2 ${
                    item.status === "high" ? "[&>div]:bg-destructive" : 
                    item.status === "medium" ? "[&>div]:bg-warning" : 
                    "[&>div]:bg-success"
                  }`} 
                />
              </div>
            ))}

            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/reports/1">
                  View Detailed Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-border bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">AI Health Insight</h3>
              <p className="text-muted-foreground">
                Based on your recent blood test, your glucose levels are slightly elevated. 
                Consider reducing sugar intake and increasing physical activity. We&apos;ve prepared 
                a personalized diet plan with foods that can help manage blood sugar levels naturally.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button size="sm" asChild>
                  <Link href="/dashboard/diet">View Diet Plan</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/reports/1">See Full Analysis</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
