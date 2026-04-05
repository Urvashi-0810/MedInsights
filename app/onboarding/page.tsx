"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  User,
  Utensils,
  Activity,
  Heart,
  Check
} from "lucide-react"

interface UserProfile {
  name: string
  age: string
  gender: string
  height: string
  weight: string
  activityLevel: string
  dietType: string
  mealsPerDay: string
  waterIntake: number
  sleepHours: number
  smokingStatus: string
  alcoholConsumption: string
  existingConditions: string[]
  allergies: string[]
  healthGoals: string[]
}

const steps = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Dietary Habits", icon: Utensils },
  { id: 3, title: "Lifestyle", icon: Activity },
  { id: 4, title: "Health Goals", icon: Heart },
]

const existingConditionOptions = [
  "Diabetes",
  "High Blood Pressure",
  "Heart Disease",
  "Thyroid Issues",
  "Asthma",
  "None"
]

const allergyOptions = [
  "Dairy",
  "Gluten",
  "Nuts",
  "Seafood",
  "Eggs",
  "None"
]

const healthGoalOptions = [
  "Lose Weight",
  "Gain Muscle",
  "Improve Energy",
  "Better Sleep",
  "Manage Chronic Condition",
  "General Wellness"
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    dietType: "",
    mealsPerDay: "",
    waterIntake: 8,
    sleepHours: 7,
    smokingStatus: "",
    alcoholConsumption: "",
    existingConditions: [],
    allergies: [],
    healthGoals: []
  })

  const updateProfile = (field: keyof UserProfile, value: string | number | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: "existingConditions" | "allergies" | "healthGoals", item: string) => {
    const currentArray = profile[field]
    if (item === "None") {
      updateProfile(field, ["None"])
    } else {
      const filtered = currentArray.filter(i => i !== "None")
      if (filtered.includes(item)) {
        updateProfile(field, filtered.filter(i => i !== item))
      } else {
        updateProfile(field, [...filtered, item])
      }
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Save profile and redirect to dashboard
      localStorage.setItem("userProfile", JSON.stringify(profile))
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const progress = (currentStep / 4) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MedInsight AI</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Step {currentStep} of 4</span>
            <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                currentStep === step.id 
                  ? "bg-primary text-primary-foreground" 
                  : currentStep > step.id 
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > step.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <step.icon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "Your dietary habits"}
              {currentStep === 3 && "Your lifestyle"}
              {currentStep === 4 && "Your health goals"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "This helps us personalize your health analysis"}
              {currentStep === 2 && "Understanding your diet helps us provide better recommendations"}
              {currentStep === 3 && "Your lifestyle affects your health risks"}
              {currentStep === 4 && "What do you want to achieve with better health?"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={profile.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={profile.age}
                      onChange={(e) => updateProfile("age", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={profile.gender}
                    onValueChange={(value) => updateProfile("gender", value)}
                    className="flex flex-wrap gap-4"
                  >
                    {["Male", "Female", "Other", "Prefer not to say"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.toLowerCase()} id={option.toLowerCase()} />
                        <Label htmlFor={option.toLowerCase()} className="cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="e.g., 170"
                      value={profile.height}
                      onChange={(e) => updateProfile("height", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g., 70"
                      value={profile.weight}
                      onChange={(e) => updateProfile("weight", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Do you have any existing health conditions?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {existingConditionOptions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={profile.existingConditions.includes(condition)}
                          onCheckedChange={() => toggleArrayItem("existingConditions", condition)}
                        />
                        <Label htmlFor={condition} className="cursor-pointer text-sm">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Dietary Habits */}
            {currentStep === 2 && (
              <>
                <div className="space-y-3">
                  <Label>What type of diet do you follow?</Label>
                  <RadioGroup
                    value={profile.dietType}
                    onValueChange={(value) => updateProfile("dietType", value)}
                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  >
                    {["Vegetarian", "Non-Vegetarian", "Vegan", "Eggetarian", "Pescatarian", "Flexitarian"].map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.toLowerCase()} id={`diet-${option.toLowerCase()}`} />
                        <Label htmlFor={`diet-${option.toLowerCase()}`} className="cursor-pointer flex-1">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>How many meals do you typically eat per day?</Label>
                  <RadioGroup
                    value={profile.mealsPerDay}
                    onValueChange={(value) => updateProfile("mealsPerDay", value)}
                    className="flex flex-wrap gap-3"
                  >
                    {["1-2 meals", "3 meals", "4-5 meals", "6+ meals (small portions)"].map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option} id={`meals-${option}`} />
                        <Label htmlFor={`meals-${option}`} className="cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Do you have any food allergies?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allergyOptions.map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={`allergy-${allergy}`}
                          checked={profile.allergies.includes(allergy)}
                          onCheckedChange={() => toggleArrayItem("allergies", allergy)}
                        />
                        <Label htmlFor={`allergy-${allergy}`} className="cursor-pointer">{allergy}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>How much water do you drink daily? ({profile.waterIntake} glasses)</Label>
                  <Slider
                    value={[profile.waterIntake]}
                    onValueChange={([value]) => updateProfile("waterIntake", value)}
                    min={1}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 glass</span>
                    <span>15 glasses</span>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Lifestyle */}
            {currentStep === 3 && (
              <>
                <div className="space-y-3">
                  <Label>How active are you?</Label>
                  <RadioGroup
                    value={profile.activityLevel}
                    onValueChange={(value) => updateProfile("activityLevel", value)}
                    className="space-y-3"
                  >
                    {[
                      { value: "sedentary", label: "Sedentary", desc: "Little or no exercise, desk job" },
                      { value: "light", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
                      { value: "moderate", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
                      { value: "very", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
                      { value: "extra", label: "Extra Active", desc: "Very hard exercise, physical job" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={`activity-${option.value}`} className="mt-1" />
                        <div>
                          <Label htmlFor={`activity-${option.value}`} className="cursor-pointer font-medium">{option.label}</Label>
                          <p className="text-sm text-muted-foreground">{option.desc}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label>How many hours do you sleep per night? ({profile.sleepHours} hours)</Label>
                  <Slider
                    value={[profile.sleepHours]}
                    onValueChange={([value]) => updateProfile("sleepHours", value)}
                    min={3}
                    max={12}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>3 hours</span>
                    <span>12 hours</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Smoking Status</Label>
                  <RadioGroup
                    value={profile.smokingStatus}
                    onValueChange={(value) => updateProfile("smokingStatus", value)}
                    className="flex flex-wrap gap-3"
                  >
                    {["Never", "Former", "Current", "Occasional"].map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.toLowerCase()} id={`smoking-${option.toLowerCase()}`} />
                        <Label htmlFor={`smoking-${option.toLowerCase()}`} className="cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Alcohol Consumption</Label>
                  <RadioGroup
                    value={profile.alcoholConsumption}
                    onValueChange={(value) => updateProfile("alcoholConsumption", value)}
                    className="flex flex-wrap gap-3"
                  >
                    {["Never", "Rarely", "Social", "Regular"].map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.toLowerCase()} id={`alcohol-${option.toLowerCase()}`} />
                        <Label htmlFor={`alcohol-${option.toLowerCase()}`} className="cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Step 4: Health Goals */}
            {currentStep === 4 && (
              <>
                <div className="space-y-3">
                  <Label>What are your health goals? (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {healthGoalOptions.map((goal) => (
                      <div 
                        key={goal} 
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                          profile.healthGoals.includes(goal) 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => toggleArrayItem("healthGoals", goal)}
                      >
                        <Checkbox
                          id={`goal-${goal}`}
                          checked={profile.healthGoals.includes(goal)}
                          onCheckedChange={() => toggleArrayItem("healthGoals", goal)}
                        />
                        <Label htmlFor={`goal-${goal}`} className="cursor-pointer flex-1">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-2">Ready to get started!</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on your profile, we&apos;ll provide personalized health insights and recommendations. 
                    Upload your first medical report to get your AI-powered health analysis.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button onClick={handleNext}>
            {currentStep === 4 ? "Complete Setup" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
