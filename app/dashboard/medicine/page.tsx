"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pill,
  Search,
  ArrowRight,
  IndianRupee,
  Package,
  Building2,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  Star,
  TrendingDown,
  Sparkles,
  History
} from "lucide-react"
import { toast } from "sonner"

interface GenericMedicine {
  id: string
  name: string
  manufacturer: string
  price: number
  rating: number
  savings: number
  composition: string
  dosage: string
  packSize: string
  availability: "in-stock" | "limited" | "out-of-stock"
}

interface MedicineInfo {
  brandName: string
  genericName: string
  composition: string
  category: string
  brandPrice: number
  description: string
  sideEffects: string[]
  precautions: string[]
  generics: GenericMedicine[]
}

const medicineDatabase: Record<string, MedicineInfo> = {
  "metformin": {
    brandName: "Glucophage",
    genericName: "Metformin Hydrochloride",
    composition: "Metformin 500mg",
    category: "Anti-diabetic",
    brandPrice: 180,
    description: "Metformin is used to improve blood sugar control in people with type 2 diabetes. It works by reducing glucose production in the liver and improving insulin sensitivity.",
    sideEffects: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste", "Loss of appetite"],
    precautions: ["Not recommended for kidney disease", "Avoid alcohol", "May need dose adjustment for elderly"],
    generics: [
      { id: "1", name: "Glycomet", manufacturer: "USV Limited", price: 45, rating: 4.5, savings: 75, composition: "Metformin 500mg", dosage: "1 tablet twice daily", packSize: "30 tablets", availability: "in-stock" },
      { id: "2", name: "Bigomet", manufacturer: "Aristo Pharma", price: 38, rating: 4.3, savings: 79, composition: "Metformin 500mg", dosage: "1 tablet twice daily", packSize: "30 tablets", availability: "in-stock" },
      { id: "3", name: "Okamet", manufacturer: "Cipla", price: 42, rating: 4.6, savings: 77, composition: "Metformin 500mg", dosage: "1 tablet twice daily", packSize: "30 tablets", availability: "in-stock" },
      { id: "4", name: "Walaphage", manufacturer: "Wallace", price: 35, rating: 4.2, savings: 81, composition: "Metformin 500mg", dosage: "1 tablet twice daily", packSize: "30 tablets", availability: "limited" },
    ]
  },
  "atorvastatin": {
    brandName: "Lipitor",
    genericName: "Atorvastatin Calcium",
    composition: "Atorvastatin 10mg",
    category: "Cholesterol-lowering",
    brandPrice: 320,
    description: "Atorvastatin is used to lower cholesterol and triglycerides in the blood. It helps reduce the risk of heart disease and stroke.",
    sideEffects: ["Muscle pain", "Joint pain", "Diarrhea", "Nausea", "Fatigue"],
    precautions: ["Regular liver function tests needed", "Avoid grapefruit juice", "Report muscle pain immediately"],
    generics: [
      { id: "5", name: "Atorva", manufacturer: "Zydus Cadila", price: 65, rating: 4.4, savings: 80, composition: "Atorvastatin 10mg", dosage: "1 tablet daily", packSize: "30 tablets", availability: "in-stock" },
      { id: "6", name: "Tonact", manufacturer: "Lupin", price: 72, rating: 4.5, savings: 78, composition: "Atorvastatin 10mg", dosage: "1 tablet daily", packSize: "30 tablets", availability: "in-stock" },
      { id: "7", name: "Storvas", manufacturer: "Sun Pharma", price: 58, rating: 4.3, savings: 82, composition: "Atorvastatin 10mg", dosage: "1 tablet daily", packSize: "30 tablets", availability: "in-stock" },
    ]
  },
  "amlodipine": {
    brandName: "Norvasc",
    genericName: "Amlodipine Besylate",
    composition: "Amlodipine 5mg",
    category: "Blood Pressure",
    brandPrice: 250,
    description: "Amlodipine is a calcium channel blocker used to treat high blood pressure and chest pain (angina). It works by relaxing blood vessels.",
    sideEffects: ["Swelling in ankles", "Headache", "Fatigue", "Dizziness", "Flushing"],
    precautions: ["Monitor blood pressure regularly", "Rise slowly from sitting position", "May interact with other BP medications"],
    generics: [
      { id: "8", name: "Amlodac", manufacturer: "Zydus", price: 35, rating: 4.4, savings: 86, composition: "Amlodipine 5mg", dosage: "1 tablet daily", packSize: "30 tablets", availability: "in-stock" },
      { id: "9", name: "Amlong", manufacturer: "Micro Labs", price: 38, rating: 4.5, savings: 85, composition: "Amlodipine 5mg", dosage: "1 tablet daily", packSize: "30 tablets", availability: "in-stock" },
      { id: "10", name: "Stamlo", manufacturer: "Dr. Reddy's", price: 42, rating: 4.6, savings: 83, composition: "Amlodipine 5mg", dosage: "1 tablet daily", packSize: "30 tablets", availability: "limited" },
    ]
  }
}

const recentSearches = ["Metformin", "Atorvastatin", "Omeprazole", "Paracetamol"]
const popularMedicines = ["Metformin", "Amlodipine", "Atorvastatin", "Aspirin", "Losartan"]

export default function MedicineFinderPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineInfo | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const query = searchParams.get("search")
    if (query) {
      setSearchQuery(query)
      handleSearch(query)
    }
  }, [searchParams])

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) {
      toast.error("Please enter a medicine name")
      return
    }

    setIsSearching(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const normalizedQuery = query.toLowerCase().trim()
    const medicine = medicineDatabase[normalizedQuery]
    
    if (medicine) {
      setSelectedMedicine(medicine)
    } else {
      setSelectedMedicine(null)
      toast.error("Medicine not found", {
        description: "Try searching for: Metformin, Atorvastatin, or Amlodipine"
      })
    }
    
    setIsSearching(false)
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "in-stock": return <Badge variant="outline" className="bg-success/10 text-success border-success/20">In Stock</Badge>
      case "limited": return <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning/20">Limited</Badge>
      case "out-of-stock": return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Out of Stock</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Generic Medicine Finder</h1>
        <p className="text-muted-foreground mt-1">
          Find affordable generic alternatives for branded medicines
        </p>
      </div>

      {/* Search Section */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Enter medicine name (e.g., Metformin, Atorvastatin)"
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button 
              size="lg" 
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="h-12"
            >
              {isSearching ? "Searching..." : "Find Generics"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Quick Suggestions */}
          {!selectedMedicine && (
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recent Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((medicine) => (
                    <Button 
                      key={medicine}
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSearchQuery(medicine)
                        handleSearch(medicine)
                      }}
                    >
                      {medicine}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Popular Medicines
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularMedicines.map((medicine) => (
                    <Button 
                      key={medicine}
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSearchQuery(medicine)
                        handleSearch(medicine)
                      }}
                    >
                      {medicine}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {selectedMedicine && (
        <div className="space-y-6">
          {/* Brand Medicine Info */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <Badge className="mb-2">{selectedMedicine.category}</Badge>
                  <CardTitle className="text-2xl">{selectedMedicine.brandName}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Generic: {selectedMedicine.genericName}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Brand Price</p>
                  <p className="text-3xl font-bold text-foreground flex items-center">
                    <IndianRupee className="h-6 w-6" />
                    {selectedMedicine.brandPrice}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-foreground mb-1">Composition</p>
                  <p className="text-muted-foreground">{selectedMedicine.composition}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Description</p>
                  <p className="text-muted-foreground">{selectedMedicine.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <AlertTriangle className="mr-2 h-4 w-4 text-warning-foreground" />
                        Side Effects
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Side Effects</DialogTitle>
                        <DialogDescription>
                          Possible side effects of {selectedMedicine.genericName}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <ul className="space-y-2">
                          {selectedMedicine.sideEffects.map((effect, index) => (
                            <li key={index} className="flex items-center gap-2 text-muted-foreground">
                              <div className="h-1.5 w-1.5 rounded-full bg-warning" />
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Info className="mr-2 h-4 w-4 text-primary" />
                        Precautions
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Precautions</DialogTitle>
                        <DialogDescription>
                          Important precautions for {selectedMedicine.genericName}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <ul className="space-y-2">
                          {selectedMedicine.precautions.map((precaution, index) => (
                            <li key={index} className="flex items-start gap-2 text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              {precaution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Savings Banner */}
          <Card className="border-border bg-success/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-success-foreground">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    Save up to {Math.max(...selectedMedicine.generics.map(g => g.savings))}% with Generic Options
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Same composition, FDA approved, significantly lower cost
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generic Alternatives */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generic Alternatives ({selectedMedicine.generics.length})
              </CardTitle>
              <CardDescription>
                All generics have the same active ingredient: {selectedMedicine.composition}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedMedicine.generics.map((generic) => (
                  <div 
                    key={generic.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Pill className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-foreground">{generic.name}</h4>
                            {getAvailabilityBadge(generic.availability)}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {generic.manufacturer}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {generic.packSize}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-warning text-warning" />
                              {generic.rating}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Dosage: {generic.dosage}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:text-right">
                        <div>
                          <p className="text-2xl font-bold text-foreground flex items-center">
                            <IndianRupee className="h-5 w-5" />
                            {generic.price}
                          </p>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            Save {generic.savings}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-border bg-warning/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Important Disclaimer</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This information is for educational purposes only. Always consult your doctor 
                    before switching from branded to generic medicines. Prices may vary by location and pharmacy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!selectedMedicine && !isSearching && (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
              <Pill className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Search for a Medicine
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter the name of any branded medicine to find affordable generic alternatives 
              with the same composition and effectiveness.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
