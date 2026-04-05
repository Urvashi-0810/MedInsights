"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  FileText, 
  Brain, 
  Shield, 
  TrendingUp, 
  Heart, 
  Activity,
  ArrowRight,
  Check,
  Sparkles,
  Upload,
  PieChart,
  Pill,
  Salad,
  BookOpen,
  Menu,
  X
} from "lucide-react"

const features = [
  {
    icon: Upload,
    title: "Upload Reports",
    description: "Simply upload your blood tests, medical reports in PDF or image format"
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our ML models extract and analyze all parameters from your reports"
  },
  {
    icon: PieChart,
    title: "Risk Assessment",
    description: "Get detailed risk scores for diabetes, heart disease, anemia & more"
  },
  {
    icon: FileText,
    title: "Simple Summaries",
    description: "Receive easy-to-understand explanations without medical jargon"
  },
  {
    icon: Salad,
    title: "Dietary Guidance",
    description: "Personalized home remedies and dietary suggestions based on your profile"
  },
  {
    icon: Pill,
    title: "Generic Medicines",
    description: "Find affordable generic alternatives for prescribed medications"
  }
]

const benefits = [
  "Early detection of health risks",
  "Understand reports in simple language",
  "Personalized dietary recommendations",
  "Track health trends over time",
  "Find generic medicine alternatives",
  "Downloadable AI-generated reports"
]

const diseases = [
  { name: "Diabetes", icon: Activity, color: "bg-chart-1/10 text-chart-1" },
  { name: "Heart Disease", icon: Heart, color: "bg-chart-4/10 text-chart-4" },
  { name: "Anemia", icon: TrendingUp, color: "bg-chart-2/10 text-chart-2" },
  { name: "Liver Issues", icon: Shield, color: "bg-chart-3/10 text-chart-3" },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">MedInsight AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#diseases" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Diseases
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/onboarding">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-3">
              <Link href="#features" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
                How It Works
              </Link>
              <Link href="#diseases" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
                Diseases
              </Link>
              <div className="pt-3 flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/onboarding">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Health Analysis
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance">
              Understand Your Health,{" "}
              <span className="text-primary">Predict Your Future</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Upload your medical reports and get instant AI-powered disease risk predictions, 
              easy-to-understand summaries, and personalized health recommendations.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-base px-8 h-12">
                <Link href="/onboarding">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 h-12">
                <Link href="#how-it-works">
                  See How It Works
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span>No medical jargon</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              Everything You Need for Health Insights
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From report analysis to personalized recommendations, we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get your health analysis in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-border" />
            
            {[
              { step: "01", title: "Complete Profile", desc: "Answer a few questions about your age, lifestyle, and dietary habits" },
              { step: "02", title: "Upload Reports", desc: "Upload your blood test results or medical reports in PDF/image format" },
              { step: "03", title: "Get Insights", desc: "Receive AI-powered analysis with risk scores and personalized recommendations" },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mx-auto mb-6 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diseases We Detect */}
      <section id="diseases" className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Early Detection for Major Health Conditions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our AI models are trained to identify risk factors for multiple diseases 
                by analyzing your blood test parameters.
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                {diseases.map((disease, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${disease.color}`}>
                      <disease.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-foreground">{disease.name}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="mt-8" asChild>
                <Link href="/onboarding">
                  Check Your Risk
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Card className="p-6 bg-card border-border shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Sample Analysis Report</h4>
                    <p className="text-sm text-muted-foreground">Based on blood test results</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                    <span className="font-medium text-foreground">Diabetes Risk</span>
                    <span className="font-bold text-destructive">78% High</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                    <span className="font-medium text-foreground">Heart Disease Risk</span>
                    <span className="font-bold text-warning-foreground">45% Medium</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                    <span className="font-medium text-foreground">Anemia Risk</span>
                    <span className="font-bold text-success">12% Low</span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">AI Summary:</strong> Your glucose levels are elevated 
                    which increases diabetes risk. Consider reducing sugar intake and consult a doctor.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Card className="p-6 bg-card border-border">
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Take Control of Your Health Journey
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Don&apos;t wait for symptoms. Our AI helps you understand your health status 
                and take preventive action before it&apos;s too late.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/onboarding">
                    Start Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link href="/resources">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Health Resources
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground text-balance">
            Ready to Understand Your Health Better?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Join thousands who are taking control of their health with AI-powered insights.
          </p>
          <Button size="lg" variant="secondary" className="mt-8 text-base px-8 h-12" asChild>
            <Link href="/onboarding">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">MedInsight AI</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>

            <p className="text-sm text-muted-foreground">
              2024 MedInsight AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
