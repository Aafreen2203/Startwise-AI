"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  FileText,
  Printer,
  RefreshCw,
  ArrowLeft,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  DollarSign,
  Zap,
  Trophy,
  MapPin,
  UsersRound,
  BarChart,
} from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

gsap.registerPlugin(ScrollTrigger)

interface PitchSection {
  title: string
  content: string
  icon: React.ElementType
}

interface PitchResultsProps {
  pitchData: string
  onGoBack: () => void
  onRegenerate: () => void
}

const sectionIcons: { [key: string]: React.ElementType } = {
  "Uniqueness Check": Target,
  "Tech Stack Recommendation": Zap,
  "Pitch Generation": Lightbulb,
  "Similar Startups": Users,
  "Improvement Suggestions": TrendingUp,
  "Success Probability & Market Stats": BarChart,
  "Success Probability": BarChart,
  "Market Stats": BarChart,
  // Legacy support for old format
  Problem: Target,
  Solution: Lightbulb,
  "Market Opportunity": TrendingUp,
  Product: Zap,
  "Business Model": DollarSign,
  "Competitive Advantage": Trophy,
  "Go-To-Market Strategy": MapPin,
  Team: UsersRound,
  Financials: BarChart,
  "Funding Ask": DollarSign,
}

export const PitchResults = ({ pitchData, onGoBack, onRegenerate }: PitchResultsProps) => {
  const [sections, setSections] = useState<PitchSection[]>([])
  const [currentSection, setCurrentSection] = useState(0)
  const resultsRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Parse the pitch data into sections
    console.log("Raw pitch data received:", pitchData)
    const parsedSections = parsePitchData(pitchData)
    console.log("Parsed sections:", parsedSections)
    setSections(parsedSections)
  }, [pitchData])

  useEffect(() => {
    if (sections.length === 0) return

    const results = resultsRef.current
    if (!results) return

    // Animate section cards on scroll
    sectionRefs.current.forEach((section, index) => {
      if (!section) return

      gsap.fromTo(
        section,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // Update current section based on scroll
    const updateCurrentSection = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      sectionRefs.current.forEach((section, index) => {
        if (!section) return

        const rect = section.getBoundingClientRect()
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          setCurrentSection(index)
        }
      })
    }

    window.addEventListener("scroll", updateCurrentSection)
    return () => window.removeEventListener("scroll", updateCurrentSection)
  }, [sections])

  const parsePitchData = (data: string): PitchSection[] => {
    // Parse the AI response into structured sections
    const lines = data.split("\n").filter((line) => line.trim())
    const sections: PitchSection[] = []
    let currentSection: Partial<PitchSection> | null = null

    for (const line of lines) {
      const trimmedLine = line.trim()

      // Skip empty lines
      if (!trimmedLine) continue

      // Check if line is a section header (## Section Name or # Section Name)
      const headerMatch = trimmedLine.match(/^#{1,6}\s*(.+)$/)
      if (headerMatch) {
        // Save previous section
        if (currentSection?.title && currentSection?.content) {
          const sectionTitle = currentSection.title.replace(/^\d+\.\s*/, "").trim()
          sections.push({
            title: sectionTitle,
            content: currentSection.content.trim(),
            icon: sectionIcons[sectionTitle] || FileText,
          })
        }

        // Start new section
        const title = headerMatch[1].replace(/^\d+\.\s*/, "").trim()
        currentSection = { title, content: "" }
        continue
      }

      // Check if line is a numbered section (1. Problem, 2. Solution, etc.)
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s*\*?\*?(.+?)\*?\*?\s*$/)
      if (numberedMatch) {
        // Save previous section
        if (currentSection?.title && currentSection?.content) {
          const sectionTitle = currentSection.title.replace(/^\d+\.\s*/, "").trim()
          sections.push({
            title: sectionTitle,
            content: currentSection.content.trim(),
            icon: sectionIcons[sectionTitle] || FileText,
          })
        }

        // Start new section
        const title = numberedMatch[2].replace(/[:.-]/g, "").trim()
        currentSection = { title, content: "" }
        continue
      }

      // Check if line contains any of our expected section names (case insensitive)
      const sectionNames = Object.keys(sectionIcons)
      const matchedSection = sectionNames.find((sectionName) => {
        const regex = new RegExp(`\\b${sectionName.replace(/\s+/g, "\\s+")}\\b`, "i")
        return regex.test(trimmedLine) && trimmedLine.length < 100 // Likely a header, not content
      })

      if (matchedSection && trimmedLine.length < 100) {
        // Save previous section
        if (currentSection?.title && currentSection?.content) {
          const sectionTitle = currentSection.title.replace(/^\d+\.\s*/, "").trim()
          sections.push({
            title: sectionTitle,
            content: currentSection.content.trim(),
            icon: sectionIcons[sectionTitle] || FileText,
          })
        }

        // Start new section
        currentSection = { title: matchedSection, content: "" }
        continue
      }

      // Add content to current section
      if (currentSection) {
        // Skip lines that look like notes or metadata
        if (
          !trimmedLine.startsWith("*Note:") &&
          !trimmedLine.startsWith("Note:") &&
          !trimmedLine.includes("demo response") &&
          !trimmedLine.includes("This is a") &&
          trimmedLine.length > 5
        ) {
          currentSection.content += (currentSection.content ? "\n" : "") + trimmedLine
        }
      }
    }

    // Add final section
    if (currentSection?.title && currentSection?.content) {
      const sectionTitle = currentSection.title.replace(/^\d+\.\s*/, "").trim()
      sections.push({
        title: sectionTitle,
        content: currentSection.content.trim(),
        icon: sectionIcons[sectionTitle] || FileText,
      })
    }

    // If no sections were parsed, try to create a single section with all content
    if (sections.length === 0 && data.trim()) {
      sections.push({
        title: "Generated Content",
        content: data.trim(),
        icon: FileText,
      })
    }

    return sections
  }

  const exportToPDF = async () => {
    const element = resultsRef.current
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save("pitch-deck.pdf")
  }

  const exportToMarkdown = () => {
    let markdown = "# Pitch Deck\n\n"

    sections.forEach((section, index) => {
      markdown += `## ${index + 1}. ${section.title}\n\n`
      markdown += `${section.content}\n\n---\n\n`
    })

    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pitch-deck.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  if (sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse-glow w-16 h-16 gradient-primary rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your pitch deck...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-card-solid border-b border-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Your Pitch Deck</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportToMarkdown}>
              <FileText className="h-4 w-4 mr-2" />
              Markdown
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="gradient" size="sm" onClick={onRegenerate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Table of Contents Sidebar */}
        <aside className="hidden lg:block w-80 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3
                      ${
                        currentSection === index
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{section.title}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
          <div ref={resultsRef} className="space-y-12">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <Card
                  key={index}
                  ref={(el) => (sectionRefs.current[index] = el)}
                  className="glass-card-solid border-2 border-primary/20 hover:border-primary/30 transition-all duration-300 shadow-lg shadow-primary/5"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2 border-primary/30">
                          Section {index + 1}
                        </Badge>
                        <h3 className="text-2xl font-bold">{section.title}</h3>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none text-foreground">
                      {section.content.split("\n").map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-16 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" onClick={onGoBack}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Create Another Pitch
              </Button>
              <Button variant="gradient" size="lg" onClick={onRegenerate}>
                <RefreshCw className="h-5 w-5 mr-2" />
                Regenerate This Pitch
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
