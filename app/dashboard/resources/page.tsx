"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Video,
  Dumbbell,
  Newspaper,
  Search,
  Clock,
  Play,
  ExternalLink,
  Heart,
  Bookmark,
  Share2,
  TrendingUp,
  Apple,
  Brain,
  Shield,
  ArrowRight
} from "lucide-react"

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: number
  date: string
  image: string
  author: string
  featured?: boolean
}

interface VideoResource {
  id: string
  title: string
  duration: string
  category: string
  thumbnail: string
  channel: string
  views: string
}

interface Exercise {
  id: string
  name: string
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  benefits: string[]
  instructions: string[]
}

interface NewsItem {
  id: string
  title: string
  source: string
  date: string
  category: string
  url: string
}

const articles: Article[] = [
  {
    id: "1",
    title: "Understanding Blood Sugar Levels: A Complete Guide",
    excerpt: "Learn about normal blood sugar ranges, what affects them, and how to maintain healthy levels naturally.",
    category: "Diabetes",
    readTime: 8,
    date: "2024-01-15",
    image: "/placeholder.svg?height=200&width=400",
    author: "Dr. Sarah Johnson",
    featured: true
  },
  {
    id: "2",
    title: "Heart-Healthy Foods You Should Eat Daily",
    excerpt: "Discover the best foods for cardiovascular health backed by scientific research.",
    category: "Heart Health",
    readTime: 5,
    date: "2024-01-12",
    image: "/placeholder.svg?height=200&width=400",
    author: "Dr. Michael Chen"
  },
  {
    id: "3",
    title: "The Connection Between Sleep and Chronic Disease",
    excerpt: "How poor sleep quality increases your risk of diabetes, heart disease, and obesity.",
    category: "Wellness",
    readTime: 6,
    date: "2024-01-10",
    image: "/placeholder.svg?height=200&width=400",
    author: "Dr. Emily Roberts"
  },
  {
    id: "4",
    title: "Natural Ways to Lower Cholesterol",
    excerpt: "Evidence-based lifestyle changes and foods that can help reduce your cholesterol levels.",
    category: "Heart Health",
    readTime: 7,
    date: "2024-01-08",
    image: "/placeholder.svg?height=200&width=400",
    author: "Dr. James Wilson"
  },
  {
    id: "5",
    title: "Managing Stress for Better Health Outcomes",
    excerpt: "Chronic stress affects everything from blood pressure to immune function. Learn to manage it.",
    category: "Mental Health",
    readTime: 5,
    date: "2024-01-05",
    image: "/placeholder.svg?height=200&width=400",
    author: "Dr. Lisa Thompson"
  },
  {
    id: "6",
    title: "Intermittent Fasting: Benefits and Risks",
    excerpt: "A comprehensive look at intermittent fasting and its effects on metabolic health.",
    category: "Nutrition",
    readTime: 9,
    date: "2024-01-03",
    image: "/placeholder.svg?height=200&width=400",
    author: "Dr. David Kim"
  },
]

const videos: VideoResource[] = [
  {
    id: "1",
    title: "15-Minute Morning Yoga for Beginners",
    duration: "15:30",
    category: "Exercise",
    thumbnail: "/placeholder.svg?height=180&width=320",
    channel: "Healthy Living",
    views: "1.2M"
  },
  {
    id: "2",
    title: "Understanding Your Blood Test Results",
    duration: "12:45",
    category: "Education",
    thumbnail: "/placeholder.svg?height=180&width=320",
    channel: "Medical Simplified",
    views: "856K"
  },
  {
    id: "3",
    title: "Low-Sugar Breakfast Ideas",
    duration: "08:20",
    category: "Nutrition",
    thumbnail: "/placeholder.svg?height=180&width=320",
    channel: "Diabetic Chef",
    views: "543K"
  },
  {
    id: "4",
    title: "Stress-Relief Breathing Exercises",
    duration: "10:15",
    category: "Wellness",
    thumbnail: "/placeholder.svg?height=180&width=320",
    channel: "Mindful Health",
    views: "2.1M"
  },
  {
    id: "5",
    title: "Heart-Healthy Cooking Techniques",
    duration: "18:40",
    category: "Nutrition",
    thumbnail: "/placeholder.svg?height=180&width=320",
    channel: "Cardiac Kitchen",
    views: "678K"
  },
  {
    id: "6",
    title: "Walking Workout for Blood Sugar Control",
    duration: "25:00",
    category: "Exercise",
    thumbnail: "/placeholder.svg?height=180&width=320",
    channel: "Diabetes Fitness",
    views: "1.5M"
  },
]

const exercises: Exercise[] = [
  {
    id: "1",
    name: "Morning Walking Routine",
    duration: "30 minutes",
    difficulty: "beginner",
    category: "Cardio",
    benefits: ["Improves insulin sensitivity", "Lowers blood pressure", "Boosts mood"],
    instructions: [
      "Start with 5 minutes of slow walking to warm up",
      "Increase pace to brisk walking for 20 minutes",
      "Cool down with 5 minutes of slow walking",
      "Stretch major muscle groups after"
    ]
  },
  {
    id: "2",
    name: "Desk Stretches",
    duration: "10 minutes",
    difficulty: "beginner",
    category: "Flexibility",
    benefits: ["Reduces tension", "Improves circulation", "Prevents stiffness"],
    instructions: [
      "Neck rolls - 10 rotations each direction",
      "Shoulder shrugs - 15 repetitions",
      "Seated spinal twist - hold 30 seconds each side",
      "Wrist circles - 10 each direction"
    ]
  },
  {
    id: "3",
    name: "Low-Impact HIIT",
    duration: "20 minutes",
    difficulty: "intermediate",
    category: "Cardio",
    benefits: ["Burns calories efficiently", "Improves metabolic health", "Heart strengthening"],
    instructions: [
      "March in place - 45 seconds",
      "Step touches - 45 seconds",
      "Low impact jumping jacks - 45 seconds",
      "Rest 15 seconds, repeat 5 rounds"
    ]
  },
  {
    id: "4",
    name: "Resistance Band Workout",
    duration: "25 minutes",
    difficulty: "intermediate",
    category: "Strength",
    benefits: ["Builds muscle", "Improves glucose uptake", "Joint-friendly"],
    instructions: [
      "Banded squats - 12 reps x 3 sets",
      "Bicep curls - 15 reps x 3 sets",
      "Chest press - 12 reps x 3 sets",
      "Lateral walks - 20 steps each direction"
    ]
  },
  {
    id: "5",
    name: "Evening Yoga Flow",
    duration: "20 minutes",
    difficulty: "beginner",
    category: "Flexibility",
    benefits: ["Reduces cortisol", "Improves sleep", "Lowers blood pressure"],
    instructions: [
      "Child's pose - 2 minutes",
      "Cat-cow stretches - 10 rounds",
      "Gentle twists - 1 minute each side",
      "Legs up the wall - 5 minutes"
    ]
  },
  {
    id: "6",
    name: "Core Strengthening",
    duration: "15 minutes",
    difficulty: "advanced",
    category: "Strength",
    benefits: ["Supports posture", "Protects back", "Improves stability"],
    instructions: [
      "Plank hold - 45 seconds x 3",
      "Dead bugs - 12 reps x 3 sets",
      "Bird dogs - 10 each side x 3 sets",
      "Bicycle crunches - 20 reps x 3 sets"
    ]
  },
]

const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "New Study Links Ultra-Processed Foods to Increased Diabetes Risk",
    source: "Medical News Today",
    date: "2024-01-15",
    category: "Research",
    url: "#"
  },
  {
    id: "2",
    title: "FDA Approves New Non-Invasive Glucose Monitor",
    source: "Health Tech Weekly",
    date: "2024-01-14",
    category: "Technology",
    url: "#"
  },
  {
    id: "3",
    title: "Mediterranean Diet Shown to Reduce Heart Disease by 25%",
    source: "Journal of Medicine",
    date: "2024-01-13",
    category: "Research",
    url: "#"
  },
  {
    id: "4",
    title: "Walking 10,000 Steps: New Research Questions the Magic Number",
    source: "Science Daily",
    date: "2024-01-12",
    category: "Fitness",
    url: "#"
  },
  {
    id: "5",
    title: "AI in Healthcare: How Machine Learning is Transforming Diagnostics",
    source: "Tech Health Review",
    date: "2024-01-11",
    category: "Technology",
    url: "#"
  },
]

const categories = [
  { name: "All", icon: BookOpen },
  { name: "Diabetes", icon: TrendingUp },
  { name: "Heart Health", icon: Heart },
  { name: "Nutrition", icon: Apple },
  { name: "Wellness", icon: Shield },
  { name: "Mental Health", icon: Brain },
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [savedItems, setSavedItems] = useState<string[]>([])

  const toggleSave = (id: string) => {
    setSavedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || article.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-success/10 text-success border-success/20"
      case "intermediate": return "bg-warning/20 text-warning-foreground border-warning/20"
      case "advanced": return "bg-destructive/10 text-destructive border-destructive/20"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Health Resources</h1>
          <p className="text-muted-foreground mt-1">
            Articles, videos, exercises, and news for a healthier lifestyle
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant={activeCategory === category.name ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.name)}
            className="shrink-0"
          >
            <category.icon className="mr-2 h-4 w-4" />
            {category.name}
          </Button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="w-full md:w-auto grid grid-cols-4 md:flex">
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Articles</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Exercises</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-6">
          {/* Featured Article */}
          {filteredArticles.find(a => a.featured) && (
            <Card className="border-border overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <Badge className="w-fit mb-3">{filteredArticles.find(a => a.featured)?.category}</Badge>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {filteredArticles.find(a => a.featured)?.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {filteredArticles.find(a => a.featured)?.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>{filteredArticles.find(a => a.featured)?.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {filteredArticles.find(a => a.featured)?.readTime} min read
                    </span>
                  </div>
                  <Button className="w-fit">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.filter(a => !a.featured).map((article) => (
              <Card key={article.id} className="border-border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">{article.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime} min
                    </span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => toggleSave(article.id)}
                      >
                        <Bookmark className={`h-4 w-4 ${savedItems.includes(article.id) ? "fill-primary text-primary" : ""}`} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="border-border overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-primary fill-primary ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">{video.category}</Badge>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{video.channel}</span>
                    <span>{video.views} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Exercises Tab */}
        <TabsContent value="exercises">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                      <CardTitle className="mt-2">{exercise.name}</CardTitle>
                      <CardDescription>
                        {exercise.duration} | {exercise.category}
                      </CardDescription>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Benefits</p>
                    <div className="flex flex-wrap gap-2">
                      {exercise.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary">{benefit}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Instructions</p>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      {exercise.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs shrink-0">
                            {index + 1}
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Exercise
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Latest Health News</CardTitle>
              <CardDescription>Stay updated with the latest in health and medicine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {newsItems.map((news, index) => (
                <div key={news.id}>
                  <Link 
                    href={news.url}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Newspaper className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>{news.source}</span>
                        <span>{new Date(news.date).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-xs">{news.category}</Badge>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                  </Link>
                  {index < newsItems.length - 1 && <div className="border-b border-border mx-4" />}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
