"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

interface UploadedFile {
  file: File
  preview?: string
  status: "pending" | "uploading" | "analyzing" | "complete" | "error"
  progress: number
}

export default function UploadReportPage() {
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [reportName, setReportName] = useState("")
  const [reportType, setReportType] = useState("")
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      status: "pending" as const,
      progress: 0
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024
  })

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one file")
      return
    }

    setIsProcessing(true)

    // Simulate file processing
    for (let i = 0; i < uploadedFiles.length; i++) {
      // Update to uploading
      setUploadedFiles(prev => {
        const newFiles = [...prev]
        newFiles[i] = { ...newFiles[i], status: "uploading" }
        return newFiles
      })

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadedFiles(prev => {
          const newFiles = [...prev]
          newFiles[i] = { ...newFiles[i], progress }
          return newFiles
        })
      }

      // Update to analyzing
      setUploadedFiles(prev => {
        const newFiles = [...prev]
        newFiles[i] = { ...newFiles[i], status: "analyzing" }
        return newFiles
      })

      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update to complete
      setUploadedFiles(prev => {
        const newFiles = [...prev]
        newFiles[i] = { ...newFiles[i], status: "complete" }
        return newFiles
      })
    }

    setIsProcessing(false)
    toast.success("Reports analyzed successfully!", {
      description: "Your AI-powered analysis is ready.",
    })

    // Redirect to reports page after a short delay
    setTimeout(() => {
      router.push("/dashboard/reports/1")
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />
      case "analyzing":
        return <Sparkles className="h-4 w-4 text-primary animate-pulse" />
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploading": return "Uploading..."
      case "analyzing": return "AI Analyzing..."
      case "complete": return "Complete"
      case "error": return "Error"
      default: return "Ready"
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/reports">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Upload Report</h1>
          <p className="text-muted-foreground mt-1">
            Upload your medical reports for AI-powered analysis
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Drag and drop your blood test or medical reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-lg font-medium text-foreground">
              {isDragActive ? "Drop your files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              or click to browse your computer
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, PNG, JPG (Max 10MB each)
            </p>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium text-foreground">Uploaded Files</p>
              {uploadedFiles.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30"
                >
                  {item.preview ? (
                    <img 
                      src={item.preview} 
                      alt={item.file.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(item.status)}
                      <span className="text-xs text-muted-foreground">
                        {getStatusText(item.status)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({(item.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    {item.status === "uploading" && (
                      <Progress value={item.progress} className="h-1 mt-2" />
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFile(index)}
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Details */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Report Details (Optional)</CardTitle>
          <CardDescription>
            Add additional information to help with analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                placeholder="e.g., Annual Blood Test"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blood-test">Blood Test</SelectItem>
                  <SelectItem value="lipid-profile">Lipid Profile</SelectItem>
                  <SelectItem value="thyroid">Thyroid Panel</SelectItem>
                  <SelectItem value="liver">Liver Function Test</SelectItem>
                  <SelectItem value="kidney">Kidney Function Test</SelectItem>
                  <SelectItem value="diabetes">Diabetes Test (HbA1c)</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any symptoms or concerns you want to mention..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* What to Expect */}
      <Card className="border-border bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">What Happens Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  AI extracts all parameters from your report
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Disease risk prediction using ML models
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Easy-to-understand summary without medical jargon
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Personalized recommendations and diet suggestions
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/reports">Cancel</Link>
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={uploadedFiles.length === 0 || isProcessing}
          className="min-w-[150px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Reports
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
