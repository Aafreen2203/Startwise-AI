"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2, Send, FileText, Users, Target, Sparkles, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

gsap.registerPlugin(ScrollTrigger)

interface StartupEvaluationData {
  startup_idea: string
  industry: string
  target_audience: string
  uploaded_file?: File
}

interface PitchFormProps {
  onSubmit: (data: StartupEvaluationData) => void
  isLoading: boolean
}

export const PitchForm = ({ onSubmit, isLoading }: PitchFormProps) => {
  const [formData, setFormData] = useState<StartupEvaluationData>({
    startup_idea: "",
    industry: "",
    target_audience: "",
  })
  const [dragActive, setDragActive] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const form = formRef.current
    if (!form) return

    gsap.fromTo(
      form,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: form,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      },
    )
  }, [])

  const handleInputChange = (field: keyof StartupEvaluationData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    if (!["application/pdf", "text/plain"].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or text file.",
        variant: "destructive",
      })
      return
    }

    setFormData((prev) => ({
      ...prev,
      uploaded_file: file,
    }))

    toast({
      title: "File uploaded",
      description: `${file.name} has been attached to your submission.`,
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.startup_idea.trim()) {
      toast({
        title: "Missing information",
        description: "Please describe your startup idea.",
        variant: "destructive",
      })
      return
    }

    onSubmit(formData)
  }

  return (
    <section id="pitch-form" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center space-x-2 glass-card rounded-full px-6 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">AI-Powered Evaluation</span>
          </div> */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Evaluate Your <span className="gradient-text">Startup Idea</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get comprehensive AI-powered analysis including market insights, tech recommendations, and competitive
            evaluation.
          </p>
        </div>

        {/* Form Card */}
        <Card className="glass-card-solid border-2 border-primary/20 shadow-2xl shadow-primary/10">
          <CardHeader className="text-center pb-6">
            {/* <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <Zap className="h-8 w-8 text-white" />
            </div> */}
            <CardTitle className="text-2xl font-bold gradient-text">Startup Idea Evaluation</CardTitle>
            <CardDescription className="text-base">
              Submit your startup idea for comprehensive AI analysis and recommendations
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Startup Idea */}
              <div className="space-y-3">
                <Label htmlFor="startup_idea" className="flex items-center gap-2 text-base font-semibold">
                  <FileText className="h-5 w-5 text-primary" />
                  Startup Idea *
                </Label>
                <Textarea
                  id="startup_idea"
                  placeholder="Describe your startup idea in detail. What problem does it solve? What's your solution? Include any key features, target market insights, or unique value propositions..."
                  value={formData.startup_idea}
                  onChange={(e) => handleInputChange("startup_idea", e.target.value)}
                  className="min-h-40 glass-card border-primary/30 focus:border-primary/50 text-base resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Industry and Target Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="industry" className="flex items-center gap-2 text-base font-semibold">
                    <Target className="h-5 w-5 text-accent" />
                    Industry/Domain
                  </Label>
                  <Input
                    id="industry"
                    placeholder="e.g., FinTech, HealthTech, E-commerce..."
                    value={formData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    className="glass-card border-primary/30 focus:border-primary/50 h-12 text-base"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="target_audience" className="flex items-center gap-2 text-base font-semibold">
                    <Users className="h-5 w-5 text-secondary" />
                    Target Audience
                  </Label>
                  <Input
                    id="target_audience"
                    placeholder="e.g., Small businesses, Millennials, Healthcare providers..."
                    value={formData.target_audience}
                    onChange={(e) => handleInputChange("target_audience", e.target.value)}
                    className="glass-card border-primary/30 focus:border-primary/50 h-12 text-base"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <Upload className="h-5 w-5 text-primary" />
                  Supporting Documents (Optional)
                </Label>
                <div
                  className={`
                    glass-card border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                    ${dragActive ? "border-primary/50 bg-primary/5 scale-105" : "border-primary/30 hover:border-primary/40"}
                    ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-primary/5"}
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => !isLoading && document.getElementById("file-upload")?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    disabled={isLoading}
                  />

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>

                    {formData.uploaded_file ? (
                      <div>
                        <p className="text-base font-semibold text-foreground mb-2">📄 {formData.uploaded_file.name}</p>
                        <p className="text-sm text-muted-foreground">File uploaded successfully</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base font-semibold text-foreground mb-2">
                          Drop your files here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">PDF or TXT files up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-105"
                  disabled={isLoading || !formData.startup_idea.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin mr-3" />
                      Generating Your Pitch Deck...
                    </>
                  ) : (
                    <>
                      <Send className="h-6 w-6 mr-3" />
                      Generate Pitch Deck
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
