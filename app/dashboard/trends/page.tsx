"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Heart,
  Droplet,
  Scale,
  Calendar,
  Download,
  Info
} from "lucide-react"

const glucoseData = [
  { date: "Jan 1", value: 145, target: 100 },
  { date: "Jan 8", value: 138, target: 100 },
  { date: "Jan 15", value: 142, target: 100 },
  { date: "Jan 22", value: 135, target: 100 },
  { date: "Jan 29", value: 130, target: 100 },
  { date: "Feb 5", value: 125, target: 100 },
  { date: "Feb 12", value: 128, target: 100 },
]

const cholesterolData = [
  { date: "Oct", ldl: 160, hdl: 42, total: 230 },
  { date: "Nov", ldl: 155, hdl: 44, total: 225 },
  { date: "Dec", ldl: 148, hdl: 45, total: 218 },
  { date: "Jan", ldl: 140, hdl: 45, total: 210 },
]

const weightData = [
  { date: "Week 1", weight: 82 },
  { date: "Week 2", weight: 81.5 },
  { date: "Week 3", weight: 81.2 },
  { date: "Week 4", weight: 80.8 },
  { date: "Week 5", weight: 80.5 },
  { date: "Week 6", weight: 80.2 },
  { date: "Week 7", weight: 79.8 },
  { date: "Week 8", weight: 79.5 },
]

const riskTrendData = [
  { month: "Sep", diabetes: 85, heart: 60, anemia: 15 },
  { month: "Oct", diabetes: 82, heart: 58, anemia: 14 },
  { month: "Nov", diabetes: 80, heart: 55, anemia: 13 },
  { month: "Dec", diabetes: 78, heart: 52, anemia: 12 },
  { month: "Jan", diabetes: 75, heart: 48, anemia: 12 },
]

const metrics = [
  {
    name: "Blood Glucose",
    current: "125 mg/dL",
    previous: "142 mg/dL",
    change: -12,
    status: "improving",
    icon: Droplet,
    target: "< 100 mg/dL",
  },
  {
    name: "LDL Cholesterol",
    current: "140 mg/dL",
    previous: "155 mg/dL",
    change: -10,
    status: "improving",
    icon: Heart,
    target: "< 100 mg/dL",
  },
  {
    name: "Weight",
    current: "79.5 kg",
    previous: "82.0 kg",
    change: -3,
    status: "improving",
    icon: Scale,
    target: "75 kg",
  },
  {
    name: "HbA1c",
    current: "6.5%",
    previous: "6.8%",
    change: -4,
    status: "improving",
    icon: Activity,
    target: "< 5.7%",
  },
]

export default function TrendsPage() {
  const getTrendIcon = (status: string) => {
    switch (status) {
      case "improving": return <TrendingDown className="h-4 w-4 text-success" />
      case "worsening": return <TrendingUp className="h-4 w-4 text-destructive" />
      default: return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getChangeColor = (change: number) => {
    if (change < 0) return "text-success"
    if (change > 0) return "text-destructive"
    return "text-muted-foreground"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Health Trends</h1>
          <p className="text-muted-foreground mt-1">
            Track your health metrics over time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="3months">
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.status)}
                  <span className={`text-sm font-medium ${getChangeColor(metric.change)}`}>
                    {metric.change > 0 ? "+" : ""}{metric.change}%
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{metric.current}</p>
              <p className="text-sm text-muted-foreground">{metric.name}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Previous: {metric.previous}</span>
                <Badge variant="outline" className="text-xs">
                  Target: {metric.target}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="glucose" className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="glucose">Blood Glucose</TabsTrigger>
          <TabsTrigger value="cholesterol">Cholesterol</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="risk">Risk Trends</TabsTrigger>
        </TabsList>

        {/* Glucose Chart */}
        <TabsContent value="glucose">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Blood Glucose Levels</CardTitle>
                  <CardDescription>
                    Fasting glucose readings over time
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  Improving
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={glucoseData}>
                    <defs>
                      <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[80, 160]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#colorGlucose)" 
                      name="Glucose (mg/dL)"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="hsl(var(--success))" 
                      strokeDasharray="5 5" 
                      name="Target"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-muted/50 flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Your glucose levels have decreased by 14% over the past 6 weeks. Continue with your 
                  current diet and exercise routine. Consider reducing carbohydrate intake further to 
                  reach your target of {"<"}100 mg/dL.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cholesterol Chart */}
        <TabsContent value="cholesterol">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cholesterol Levels</CardTitle>
                  <CardDescription>
                    LDL, HDL, and Total Cholesterol
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  Improving
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cholesterolData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="ldl" fill="hsl(var(--destructive))" name="LDL (Bad)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="hdl" fill="hsl(var(--success))" name="HDL (Good)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="total" fill="hsl(var(--primary))" name="Total" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-destructive/10">
                  <p className="text-sm font-medium text-foreground">LDL (Bad)</p>
                  <p className="text-2xl font-bold text-foreground">140 mg/dL</p>
                  <p className="text-xs text-muted-foreground">Target: {"<"}100 mg/dL</p>
                </div>
                <div className="p-4 rounded-lg bg-success/10">
                  <p className="text-sm font-medium text-foreground">HDL (Good)</p>
                  <p className="text-2xl font-bold text-foreground">45 mg/dL</p>
                  <p className="text-xs text-muted-foreground">Target: {">"}40 mg/dL</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10">
                  <p className="text-sm font-medium text-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">210 mg/dL</p>
                  <p className="text-xs text-muted-foreground">Target: {"<"}200 mg/dL</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weight Chart */}
        <TabsContent value="weight">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weight Tracking</CardTitle>
                  <CardDescription>
                    Weekly weight measurements
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  -2.5 kg
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[75, 85]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                      name="Weight (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-success/10 flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Great Progress!</p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ve lost 2.5 kg in 8 weeks, which is a healthy and sustainable rate. 
                    Keep up your diet and exercise routine to reach your target of 75 kg.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Trends Chart */}
        <TabsContent value="risk">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Disease Risk Trends</CardTitle>
                  <CardDescription>
                    How your risk levels have changed over time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={riskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="diabetes" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      name="Diabetes Risk %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="heart" 
                      stroke="hsl(var(--warning))" 
                      strokeWidth={2}
                      name="Heart Disease Risk %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="anemia" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Anemia Risk %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">Diabetes</p>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      -10%
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground">75%</p>
                  <p className="text-xs text-muted-foreground">Still high, continue improvement</p>
                </div>
                <div className="p-4 rounded-lg border border-warning/30 bg-warning/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">Heart Disease</p>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      -12%
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground">48%</p>
                  <p className="text-xs text-muted-foreground">Improved to medium risk</p>
                </div>
                <div className="p-4 rounded-lg border border-success/30 bg-success/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">Anemia</p>
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      Stable
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground">12%</p>
                  <p className="text-xs text-muted-foreground">Low risk maintained</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
