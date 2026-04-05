"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  Share2,
  Printer,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  Heart,
  Activity,
  Droplet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Pill,
  Salad,
  AlertCircle
} from "lucide-react"

// Mock report data
const reportData = {
  id: "1",
  name: "Complete Blood Count",
  date: "2024-01-15",
  laboratory: "City Diagnostics Lab",
  doctor: "Dr. Smith",
  overallRisk: 68,
  parameters: [
    { name: "Hemoglobin", value: "13.5", unit: "g/dL", normalRange: "12.0-15.5", status: "normal" },
    { name: "RBC Count", value: "4.8", unit: "million/mcL", normalRange: "4.5-5.5", status: "normal" },
    { name: "WBC Count", value: "11.2", unit: "thousand/mcL", normalRange: "4.5-11.0", status: "high" },
    { name: "Platelet Count", value: "250", unit: "thousand/mcL", normalRange: "150-400", status: "normal" },
    { name: "Hematocrit", value: "42", unit: "%", normalRange: "36-44", status: "normal" },
    { name: "MCV", value: "88", unit: "fL", normalRange: "80-100", status: "normal" },
    { name: "MCH", value: "28", unit: "pg", normalRange: "27-31", status: "normal" },
    { name: "MCHC", value: "32", unit: "g/dL", normalRange: "32-36", status: "normal" },
    { name: "Blood Glucose (Fasting)", value: "142", unit: "mg/dL", normalRange: "70-100", status: "high" },
    { name: "HbA1c", value: "6.8", unit: "%", normalRange: "4.0-5.6", status: "high" },
    { name: "Total Cholesterol", value: "210", unit: "mg/dL", normalRange: "<200", status: "high" },
    { name: "LDL Cholesterol", value: "140", unit: "mg/dL", normalRange: "<100", status: "high" },
    { name: "HDL Cholesterol", value: "45", unit: "mg/dL", normalRange: ">40", status: "normal" },
    { name: "Triglycerides", value: "180", unit: "mg/dL", normalRange: "<150", status: "high" },
  ],
  riskAssessment: [
    { disease: "Diabetes", risk: 78, status: "high", trend: "up" },
    { disease: "Heart Disease", risk: 55, status: "medium", trend: "stable" },
    { disease: "Anemia", risk: 12, status: "low", trend: "down" },
    { disease: "Infection Risk", risk: 35, status: "medium", trend: "up" },
  ],
  aiSummary: `Based on your blood test results, several important findings require attention:

**Key Concerns:**
1. **Elevated Blood Sugar**: Your fasting glucose (142 mg/dL) and HbA1c (6.8%) indicate pre-diabetic levels. This suggests your body is having difficulty managing blood sugar.

2. **High Cholesterol Levels**: Your total cholesterol (210 mg/dL) and LDL (140 mg/dL) are above recommended levels, increasing cardiovascular risk.

3. **Elevated WBC Count**: Slightly elevated white blood cells may indicate a mild infection or inflammation.

**What This Means:**
- You are at increased risk for developing Type 2 diabetes
- Your heart disease risk is moderate and needs attention
- No signs of anemia - your hemoglobin levels are healthy

**Root Causes Analysis:**
Your elevated glucose and cholesterol may be linked to:
- Dietary factors (high carbohydrate/sugar intake)
- Sedentary lifestyle
- Possible genetic predisposition
- Stress-related hormonal changes`,
  recommendations: {
    homeRemedies: [
      { title: "Cinnamon Tea", description: "Drink cinnamon tea twice daily to help regulate blood sugar", priority: "high" },
      { title: "Fenugreek Seeds", description: "Soak 1 tbsp fenugreek seeds overnight and consume on empty stomach", priority: "high" },
      { title: "Garlic", description: "Consume 2 raw garlic cloves daily to help lower cholesterol", priority: "medium" },
      { title: "Apple Cider Vinegar", description: "1 tbsp diluted in water before meals can help with glucose control", priority: "medium" },
      { title: "Green Tea", description: "Replace regular tea with green tea (3 cups/day) for antioxidant benefits", priority: "low" },
    ],
    medicalSuggestions: [
      { title: "Metformin", description: "Common medication for managing pre-diabetes and Type 2 diabetes", priority: "high" },
      { title: "Statins", description: "May be prescribed to help lower LDL cholesterol levels", priority: "medium" },
      { title: "Omega-3 Supplements", description: "Can help manage triglyceride levels", priority: "low" },
    ],
    lifestyle: [
      { title: "30 min daily walk", description: "Moderate exercise helps improve insulin sensitivity" },
      { title: "Reduce sugar intake", description: "Limit added sugars to less than 25g per day" },
      { title: "Increase fiber", description: "Aim for 25-30g of fiber daily from whole grains and vegetables" },
      { title: "Stay hydrated", description: "Drink at least 8 glasses of water daily" },
    ]
  }
}

export default function ReportDetailPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-success bg-success/10"
      case "high": return "text-destructive bg-destructive/10"
      case "low": return "text-warning-foreground bg-warning/20"
      default: return "text-muted-foreground bg-muted"
    }
  }

  const getRiskColor = (status: string) => {
    switch (status) {
      case "low": return "bg-success"
      case "medium": return "bg-warning"
      case "high": return "bg-destructive"
      default: return "bg-muted"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">High Priority</Badge>
      case "medium": return <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning/20">Medium</Badge>
      case "low": return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Low</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{reportData.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span>{new Date(reportData.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{reportData.laboratory}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Overall Risk Score */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">Overall Health Risk Score</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-foreground">{reportData.overallRisk}</span>
                <span className="text-xl text-muted-foreground mb-2">/100</span>
                <Badge variant="outline" className="mb-2 bg-warning/20 text-warning-foreground border-warning/20">
                  Medium Risk
                </Badge>
              </div>
              <Progress value={reportData.overallRisk} className="h-3 mt-4 [&>div]:bg-warning" />
            </div>
            <Separator orientation="vertical" className="hidden md:block h-24" />
            <div className="grid grid-cols-2 gap-4">
              {reportData.riskAssessment.slice(0, 4).map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-foreground">{item.risk}%</p>
                  <p className="text-sm text-muted-foreground">{item.disease}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full md:w-auto grid grid-cols-4 md:flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Risk Assessment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportData.riskAssessment.map((item, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">{item.disease}</span>
                    {item.trend === "up" && <TrendingUp className="h-4 w-4 text-destructive" />}
                    {item.trend === "down" && <TrendingDown className="h-4 w-4 text-success" />}
                    {item.trend === "stable" && <Activity className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-foreground">{item.risk}%</span>
                    {item.status === "high" && <AlertTriangle className="h-5 w-5 text-destructive mb-1" />}
                    {item.status === "medium" && <AlertCircle className="h-5 w-5 text-warning-foreground mb-1" />}
                    {item.status === "low" && <CheckCircle2 className="h-5 w-5 text-success mb-1" />}
                  </div>
                  <Progress value={item.risk} className={`h-2 mt-3 [&>div]:${getRiskColor(item.status)}`} />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Findings */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning-foreground" />
                Key Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="h-5 w-5 text-destructive" />
                    <span className="font-medium text-foreground">Elevated Glucose</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    142 mg/dL (Normal: 70-100)
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-destructive" />
                    <span className="font-medium text-foreground">High LDL Cholesterol</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    140 mg/dL (Normal: &lt;100)
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-warning-foreground" />
                    <span className="font-medium text-foreground">Elevated HbA1c</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    6.8% (Normal: 4.0-5.6%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick AI Summary */}
          <Card className="border-border bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">AI Quick Summary</h3>
                  <p className="text-muted-foreground">
                    Your results indicate pre-diabetic blood sugar levels and elevated cholesterol. 
                    These findings suggest a need for lifestyle modifications and possibly medical consultation. 
                    Your hemoglobin and other blood counts are within normal ranges.
                  </p>
                  <Button className="mt-4" onClick={() => setActiveTab("ai-summary")}>
                    Read Full Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parameters Tab */}
        <TabsContent value="parameters" className="mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Test Parameters</CardTitle>
              <CardDescription>Detailed breakdown of all measured values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.parameters.map((param, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      param.status === "high" ? "border-destructive/30 bg-destructive/5" : 
                      param.status === "low" ? "border-warning/30 bg-warning/5" : 
                      "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{param.name}</span>
                      <Badge variant="outline" className={getStatusColor(param.status)}>
                        {param.status.charAt(0).toUpperCase() + param.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">{param.value}</span>
                      <span className="text-sm text-muted-foreground">{param.unit}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Normal Range: {param.normalRange} {param.unit}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Summary Tab */}
        <TabsContent value="ai-summary" className="mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered Analysis
              </CardTitle>
              <CardDescription>
                Easy-to-understand explanation of your test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground">
                {reportData.aiSummary.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-foreground">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    )
                  }
                  if (paragraph.startsWith('**')) {
                    return (
                      <p key={index} className="mb-2">
                        <strong className="text-foreground">{paragraph.split('**')[1]}</strong>
                        {paragraph.split('**')[2]}
                      </p>
                    )
                  }
                  if (paragraph.startsWith('-')) {
                    return (
                      <li key={index} className="ml-4 text-muted-foreground">
                        {paragraph.replace('-', '').trim()}
                      </li>
                    )
                  }
                  if (paragraph.trim()) {
                    return <p key={index} className="mb-2 text-muted-foreground">{paragraph}</p>
                  }
                  return null
                })}
              </div>

              <Separator className="my-6" />

              <div className="flex items-center gap-2 p-4 rounded-lg bg-muted">
                <Info className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground">
                  This AI-generated summary is for informational purposes only. 
                  Please consult a healthcare professional for medical advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6 mt-6">
          {/* Home Remedies */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Salad className="h-5 w-5 text-accent" />
                Home Remedies
              </CardTitle>
              <CardDescription>Natural ways to improve your health markers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.recommendations.homeRemedies.map((remedy, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                      <Salad className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{remedy.title}</span>
                        {getPriorityBadge(remedy.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">{remedy.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medical Suggestions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Medical Suggestions
              </CardTitle>
              <CardDescription>Medications that may help (consult doctor first)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.recommendations.medicalSuggestions.map((med, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{med.title}</span>
                        {getPriorityBadge(med.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">{med.description}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/medicine?search=${encodeURIComponent(med.title)}`}>
                        Find Generic
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-4 rounded-lg bg-warning/10 border border-warning/20 mt-4">
                <AlertTriangle className="h-5 w-5 text-warning-foreground shrink-0" />
                <p className="text-sm text-warning-foreground">
                  Always consult a healthcare professional before starting any medication.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Changes */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-success" />
                Lifestyle Changes
              </CardTitle>
              <CardDescription>Daily habits to improve your health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.recommendations.lifestyle.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-success/5 border border-success/20">
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
                <Button variant="outline" asChild>
                  <Link href="/dashboard/resources">
                    Health Resources
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
