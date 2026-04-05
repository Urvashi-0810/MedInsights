"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Salad,
  Coffee,
  UtensilsCrossed,
  Moon,
  Apple,
  Sparkles,
  RefreshCw,
  Download,
  Settings,
  Plus,
  X,
  Check,
  AlertTriangle,
  Leaf,
  Flame,
  Droplet,
  Heart
} from "lucide-react"
import { toast } from "sonner"

interface Meal {
  name: string
  calories: number
  protein: number
  carbs: number
  fiber: number
  benefits: string[]
  alternatives: string[]
  recipe?: string
}

interface DayPlan {
  breakfast: Meal[]
  lunch: Meal[]
  snacks: Meal[]
  dinner: Meal[]
}

const defaultMeals: DayPlan = {
  breakfast: [
    {
      name: "Oatmeal with Berries",
      calories: 280,
      protein: 8,
      carbs: 45,
      fiber: 6,
      benefits: ["Low GI", "Heart healthy", "High fiber"],
      alternatives: ["Quinoa porridge", "Overnight oats", "Multigrain toast"],
      recipe: "Cook 1/2 cup oats with water, top with fresh berries and a drizzle of honey"
    },
    {
      name: "Green Smoothie",
      calories: 180,
      protein: 5,
      carbs: 30,
      fiber: 4,
      benefits: ["Antioxidants", "Vitamins", "Hydrating"],
      alternatives: ["Fresh fruit juice", "Coconut water", "Herbal tea"]
    }
  ],
  lunch: [
    {
      name: "Grilled Chicken Salad",
      calories: 380,
      protein: 35,
      carbs: 20,
      fiber: 8,
      benefits: ["High protein", "Low carb", "Rich in vitamins"],
      alternatives: ["Paneer salad", "Tofu stir-fry", "Lentil soup"]
    },
    {
      name: "Brown Rice",
      calories: 220,
      protein: 5,
      carbs: 45,
      fiber: 3,
      benefits: ["Complex carbs", "Sustained energy", "B vitamins"],
      alternatives: ["Quinoa", "Millet", "Whole wheat roti"]
    }
  ],
  snacks: [
    {
      name: "Mixed Nuts",
      calories: 180,
      protein: 6,
      carbs: 8,
      fiber: 2,
      benefits: ["Healthy fats", "Protein", "Heart healthy"],
      alternatives: ["Roasted chickpeas", "Seeds mix", "Greek yogurt"]
    },
    {
      name: "Apple with Almond Butter",
      calories: 200,
      protein: 4,
      carbs: 25,
      fiber: 5,
      benefits: ["Natural sugars", "Fiber", "Healthy fats"],
      alternatives: ["Carrot sticks with hummus", "Cucumber slices", "Cherry tomatoes"]
    }
  ],
  dinner: [
    {
      name: "Baked Salmon",
      calories: 320,
      protein: 34,
      carbs: 0,
      fiber: 0,
      benefits: ["Omega-3", "Heart healthy", "Anti-inflammatory"],
      alternatives: ["Grilled fish", "Baked chicken", "Tofu curry"]
    },
    {
      name: "Steamed Vegetables",
      calories: 120,
      protein: 4,
      carbs: 20,
      fiber: 8,
      benefits: ["Low calorie", "High fiber", "Nutrient dense"],
      alternatives: ["Sautéed greens", "Roasted vegetables", "Vegetable soup"]
    }
  ]
}

const exclusions = [
  "Dairy", "Gluten", "Nuts", "Eggs", "Seafood", "Soy", "Red meat", "Poultry"
]

export default function DietPlanPage() {
  const [activeDay, setActiveDay] = useState("monday")
  const [meals, setMeals] = useState<DayPlan>(defaultMeals)
  const [preferences, setPreferences] = useState({
    calorieTarget: 2000,
    proteinTarget: 75,
    excludedItems: [] as string[],
    vegetarian: false,
    vegan: false,
    lowCarb: false
  })
  const [showSettings, setShowSettings] = useState(false)
  const [customRequest, setCustomRequest] = useState("")
  const [showCustomDialog, setShowCustomDialog] = useState(false)
  const [selectedMealForAlternative, setSelectedMealForAlternative] = useState<{
    mealType: keyof DayPlan
    mealIndex: number
  } | null>(null)

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  
  const totalCalories = Object.values(meals).flat().reduce((sum, meal) => sum + meal.calories, 0)
  const totalProtein = Object.values(meals).flat().reduce((sum, meal) => sum + meal.protein, 0)
  const totalCarbs = Object.values(meals).flat().reduce((sum, meal) => sum + meal.carbs, 0)
  const totalFiber = Object.values(meals).flat().reduce((sum, meal) => sum + meal.fiber, 0)

  const toggleExclusion = (item: string) => {
    setPreferences(prev => ({
      ...prev,
      excludedItems: prev.excludedItems.includes(item)
        ? prev.excludedItems.filter(i => i !== item)
        : [...prev.excludedItems, item]
    }))
  }

  const handleCustomRequest = () => {
    if (!customRequest.trim()) return
    toast.success("Customization Applied!", {
      description: "Your diet plan has been adjusted based on your request."
    })
    setCustomRequest("")
    setShowCustomDialog(false)
  }

  const selectAlternative = (alternative: string) => {
    if (!selectedMealForAlternative) return
    
    const { mealType, mealIndex } = selectedMealForAlternative
    setMeals(prev => {
      const newMeals = { ...prev }
      const meal = newMeals[mealType][mealIndex]
      newMeals[mealType][mealIndex] = {
        ...meal,
        name: alternative,
        alternatives: [meal.name, ...meal.alternatives.filter(a => a !== alternative)]
      }
      return newMeals
    })
    
    toast.success(`Swapped to ${alternative}`)
    setSelectedMealForAlternative(null)
  }

  const regeneratePlan = () => {
    toast.success("Diet plan regenerated!", {
      description: "A new personalized plan based on your preferences."
    })
  }

  const MealCard = ({ meal, mealType, mealIndex }: { meal: Meal; mealType: keyof DayPlan; mealIndex: number }) => (
    <div className="p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{meal.name}</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {meal.benefits.map((benefit, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedMealForAlternative({ mealType, mealIndex })}
            >
              Swap
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose Alternative</DialogTitle>
              <DialogDescription>
                Select an alternative for {meal.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-4">
              {meal.alternatives.map((alt, i) => (
                <Button 
                  key={i}
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => selectAlternative(alt)}
                >
                  {alt}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4 text-center">
        <div className="p-2 rounded bg-muted/50">
          <p className="text-xs text-muted-foreground">Calories</p>
          <p className="font-semibold text-foreground">{meal.calories}</p>
        </div>
        <div className="p-2 rounded bg-muted/50">
          <p className="text-xs text-muted-foreground">Protein</p>
          <p className="font-semibold text-foreground">{meal.protein}g</p>
        </div>
        <div className="p-2 rounded bg-muted/50">
          <p className="text-xs text-muted-foreground">Carbs</p>
          <p className="font-semibold text-foreground">{meal.carbs}g</p>
        </div>
        <div className="p-2 rounded bg-muted/50">
          <p className="text-xs text-muted-foreground">Fiber</p>
          <p className="font-semibold text-foreground">{meal.fiber}g</p>
        </div>
      </div>
      {meal.recipe && (
        <p className="text-sm text-muted-foreground mt-3 p-3 rounded bg-muted/30">
          <span className="font-medium">Recipe: </span>{meal.recipe}
        </p>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Personalized Diet Plan</h1>
          <p className="text-muted-foreground mt-1">
            Based on your health profile and report analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={regeneratePlan}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Customize Diet Plan</DialogTitle>
                <DialogDescription>
                  Adjust your dietary preferences and restrictions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Calorie Target */}
                <div className="space-y-3">
                  <Label>Daily Calorie Target: {preferences.calorieTarget} kcal</Label>
                  <Slider
                    value={[preferences.calorieTarget]}
                    onValueChange={([value]) => setPreferences(p => ({ ...p, calorieTarget: value }))}
                    min={1200}
                    max={3500}
                    step={50}
                  />
                </div>

                {/* Protein Target */}
                <div className="space-y-3">
                  <Label>Daily Protein Target: {preferences.proteinTarget}g</Label>
                  <Slider
                    value={[preferences.proteinTarget]}
                    onValueChange={([value]) => setPreferences(p => ({ ...p, proteinTarget: value }))}
                    min={30}
                    max={200}
                    step={5}
                  />
                </div>

                <Separator />

                {/* Diet Types */}
                <div className="space-y-3">
                  <Label>Diet Type</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="text-sm">Vegetarian</span>
                      <Switch 
                        checked={preferences.vegetarian}
                        onCheckedChange={(checked) => setPreferences(p => ({ ...p, vegetarian: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="text-sm">Vegan</span>
                      <Switch 
                        checked={preferences.vegan}
                        onCheckedChange={(checked) => setPreferences(p => ({ ...p, vegan: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="text-sm">Low Carb</span>
                      <Switch 
                        checked={preferences.lowCarb}
                        onCheckedChange={(checked) => setPreferences(p => ({ ...p, lowCarb: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Exclusions */}
                <div className="space-y-3">
                  <Label>Food Exclusions</Label>
                  <div className="flex flex-wrap gap-2">
                    {exclusions.map((item) => (
                      <Badge
                        key={item}
                        variant={preferences.excludedItems.includes(item) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleExclusion(item)}
                      >
                        {preferences.excludedItems.includes(item) && <X className="mr-1 h-3 w-3" />}
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSettings(false)}>Cancel</Button>
                <Button onClick={() => {
                  setShowSettings(false)
                  toast.success("Preferences saved!")
                }}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* AI Insight */}
      <Card className="border-border bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">AI Recommendation:</strong> Based on your elevated glucose 
                and cholesterol levels, this plan focuses on low-glycemic foods, high fiber, and heart-healthy 
                options. Cinnamon and fenugreek are included to help regulate blood sugar naturally.
              </p>
            </div>
            <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Custom Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Custom Modification</DialogTitle>
                  <DialogDescription>
                    Tell us how you&apos;d like to modify your diet plan
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="e.g., I can't include paneer 4 days a week, reduce it"
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCustomDialog(false)}>Cancel</Button>
                  <Button onClick={handleCustomRequest}>Apply Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Daily Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
              <Flame className="h-6 w-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalCalories}</p>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
              <Heart className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalProtein}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
              <Droplet className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalCarbs}g</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <Leaf className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalFiber}g</p>
              <p className="text-sm text-muted-foreground">Fiber</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <Button
            key={day}
            variant={activeDay === day ? "default" : "outline"}
            onClick={() => setActiveDay(day)}
            className="capitalize shrink-0"
          >
            {day.slice(0, 3)}
          </Button>
        ))}
      </div>

      {/* Meals */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Meals</TabsTrigger>
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="snacks">Snacks</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Breakfast */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-warning-foreground" />
                Breakfast
              </CardTitle>
              <CardDescription>Start your day with energy-boosting foods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {meals.breakfast.map((meal, index) => (
                <MealCard key={index} meal={meal} mealType="breakfast" mealIndex={index} />
              ))}
            </CardContent>
          </Card>

          {/* Lunch */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                Lunch
              </CardTitle>
              <CardDescription>Balanced meal for sustained afternoon energy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {meals.lunch.map((meal, index) => (
                <MealCard key={index} meal={meal} mealType="lunch" mealIndex={index} />
              ))}
            </CardContent>
          </Card>

          {/* Snacks */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-accent" />
                Snacks
              </CardTitle>
              <CardDescription>Healthy options to keep you going</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {meals.snacks.map((meal, index) => (
                <MealCard key={index} meal={meal} mealType="snacks" mealIndex={index} />
              ))}
            </CardContent>
          </Card>

          {/* Dinner */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-chart-5" />
                Dinner
              </CardTitle>
              <CardDescription>Light, nutritious evening meal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {meals.dinner.map((meal, index) => (
                <MealCard key={index} meal={meal} mealType="dinner" mealIndex={index} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {(["breakfast", "lunch", "snacks", "dinner"] as const).map((mealType) => (
          <TabsContent key={mealType} value={mealType}>
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="capitalize">{mealType}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {meals[mealType].map((meal, index) => (
                  <MealCard key={index} meal={meal} mealType={mealType} mealIndex={index} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Health Tips */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning-foreground" />
            Important Health Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Stay Hydrated</p>
                <p className="text-sm text-muted-foreground">Drink at least 8 glasses of water daily</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Eat Slowly</p>
                <p className="text-sm text-muted-foreground">Take 20 minutes per meal for better digestion</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Limit Sugar</p>
                <p className="text-sm text-muted-foreground">Keep added sugars under 25g per day</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Evening Meals</p>
                <p className="text-sm text-muted-foreground">Finish dinner 2-3 hours before bedtime</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
