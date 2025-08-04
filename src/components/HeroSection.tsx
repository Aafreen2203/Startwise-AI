"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, Sparkles, TrendingUp, Lightbulb, Star, Zap, Target, Users, BarChart3, Rocket, Shield, Brain, DollarSign } from "lucide-react"
// import { PiShootingStarFill } from "react-icons/pi"
import TextType from "@/components/ui/texttype"
import LightRays from '@/components/ui/lightrays';

gsap.registerPlugin(ScrollTrigger)

interface FeatureCard {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  label: string
  color: string
  gradient: string
  stats?: string
}

const features: FeatureCard[] = [
  {
    id: "ai-analysis",
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Powered Analysis",
    description:
      "Advanced RAG technology analyzes your startup idea against real market data, competitor insights, and industry trends. Our AI processes millions of data points to provide comprehensive market intelligence and strategic recommendations tailored to your specific business concept.",
    label: "Real-time Market Data",
    color: "rgba(99, 102, 241, 0.1)",
    gradient: "from-indigo-500/20 to-purple-600/20",
    stats: "10M+ data points",
  },
  {
    id: "evaluation",
    icon: <BarChart3 className="w-8 h-8" />,
    title: "6-Section Evaluation",
    description:
      "Comprehensive analysis covering uniqueness assessment, tech stack recommendations, pitch generation, competitor mapping, improvement strategies, and success probability scoring. Each section provides detailed insights with actionable recommendations for your startup journey.",
    label: "Complete Coverage",
    color: "rgba(16, 185, 129, 0.1)",
    gradient: "from-emerald-500/20 to-teal-600/20",
    stats: "6 key metrics",
  },
  {
    id: "investment",
    icon: <DollarSign className="w-8 h-8" />,
    title: "Investment Ready",
    description:
      "Generate professional pitch decks and presentations that investors want to see, backed by comprehensive market data and strategic insights. Includes financial projections, market sizing, competitive analysis, and growth strategies that resonate with VCs and angel investors.",
    label: "Investor Grade",
    color: "rgba(245, 158, 11, 0.1)",
    gradient: "from-amber-500/20 to-orange-600/20",
    stats: "95% success rate",
  },
  {
    id: "speed",
    icon: <Zap className="w-8 h-8" />,
    title: "Lightning Fast",
    description:
      "Get comprehensive startup evaluations in under 3 minutes. No more weeks of manual research and analysis - instant, accurate results at your fingertips. Our optimized AI pipeline ensures rapid processing without compromising on depth or quality of analysis.",
    label: "Instant Results",
    color: "rgba(168, 85, 247, 0.1)",
    gradient: "from-purple-500/20 to-pink-600/20",
    stats: "<3 minutes",
  },
  {
    id: "intelligence",
    icon: <Target className="w-8 h-8" />,
    title: "Market Intelligence",
    description:
      "Deep competitor analysis and market positioning insights to help you find your unique advantage and competitive edge in the marketplace. Includes SWOT analysis, market trends, customer segmentation, and strategic positioning recommendations.",
    label: "Competitive Edge",
    color: "rgba(59, 130, 246, 0.1)",
    gradient: "from-blue-500/20 to-cyan-600/20",
    stats: "500K+ companies analyzed",
  },
  {
    id: "recommendations",
    icon: <Rocket className="w-8 h-8" />,
    title: "Smart Recommendations",
    description:
      "Get actionable tech stack recommendations, improvement suggestions, and strategic guidance tailored specifically for your startup journey and goals. Our AI considers your industry, target market, budget constraints, and growth objectives to provide personalized advice.",
    label: "Strategic Guidance",
    color: "rgba(236, 72, 153, 0.1)",
    gradient: "from-pink-500/20 to-rose-600/20",
    stats: "1000+ strategies",
  },
]

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}

const FeatureCardComponent = ({ feature, index }: { feature: FeatureCard; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)

    rotateX.set((e.clientY - centerY) / 10)
    rotateY.set((e.clientX - centerX) / 10)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className={`
        relative h-full p-8 rounded-2xl glass-card transition-all duration-500
        hover:shadow-2xl hover:shadow-primary/10
        transform-gpu group-hover:scale-105
      `}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl`} />
        </div>

        {/* Floating particles on hover */}
        {isHovered && <FloatingParticles />}

        {/* Content */}
        <div className="relative z-10">
          {/* Icon and label */}
          <div className="flex items-center justify-between mb-6">
            <motion.div
              className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="text-primary">{feature.icon}</div>
            </motion.div>

            <motion.span
              className="px-3 py-1 text-xs font-medium glass-card"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {feature.label}
            </motion.span>
          </div>

          {/* Title */}
          <motion.h3
            className="text-2xl font-bold mb-4 gradient-text"
            whileHover={{ scale: 1.02 }}
          >
            {feature.title}
          </motion.h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground transition-colors duration-300">
            {feature.description}
          </p>

          {/* Stats */}
          {feature.stats && (
            <motion.div
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <TrendingUp className="w-4 h-4" />
              {feature.stats}
            </motion.div>
          )}
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 blur-xl" />
        </div>
      </div>
    </motion.div>
  )
}

interface HeroSectionProps {
  onScrollToForm?: () => void
}

export const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const handleEvaluateClick = () => {
    navigate('/evaluate')
  }

  useEffect(() => {
    const hero = heroRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const cta = ctaRef.current

    if (!hero || !title || !subtitle || !cta) return

    // Reset initial states
    gsap.set([title, subtitle, cta], {
      opacity: 0,
      y: 50,
    })

    // Create timeline for entrance animations
    const tl = gsap.timeline({ delay: 0.2 })

    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    })
      .to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5",
      )
      .to(
        cta,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.3",
      )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* LightRays Background - Full Screen */}
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#C8B3F9"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 px-6 py-6 bg-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                <PiShootingStarFill className="h-7 w-7 text-white" />
              </div> */}
              {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-primary" />
              </div> */}
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">StartwiseAI</h1>
              <p className="text-xs text-muted-foreground font-medium">Startup Intelligence</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              How it Works
            </a>
            <Button onClick={handleEvaluateClick} variant="gradient" size="sm">
              Start Evaluation
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Badge */}
          {/* <div className="inline-flex items-center space-x-2 glass-card rounded-full px-6 py-2 mb-8">
            <Star className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">AI-Powered Startup Evaluation</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          </div> */}

          {/* Main Headline */}
          <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-12 leading-relaxed">
            <span className="gradient-text">Transform Ideas Into</span>
            <br />
            <div className="gradient-text pt-2 pb-4">
              <TextType
                text={["Investment-Ready Pitches", "Market Intelligence", "Strategic Success"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                className="inline-block"
              />
            </div>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Get comprehensive startup evaluations powered by advanced AI. From market analysis to pitch generation,
            <span className="text-primary font-semibold"> StartwiseAI</span> provides the insights you need to succeed.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">6</div>
              <div className="text-sm text-muted-foreground">Analysis Sections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{"<3min"}</div>
              <div className="text-sm text-muted-foreground">Evaluation Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">99%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={handleEvaluateClick}
              variant="gradient"
              size="lg"
              className="px-8 py-4 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-105 group"
            >
              <Lightbulb className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Evaluate Your Startup Idea
              <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 rounded-xl glass-card bg-transparent">
              <TrendingUp className="mr-2 h-5 w-5" />
              See Demo
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div> */}
      </section>

      {/* Features Preview Section */}
      <section id="features" className="relative py-24 px-6 overflow-hidden">
        {/* Animated background elements - consistent with hero */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Powered by Advanced AI</span>
            </motion.div> */}

            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Why Choose{" "}
              <span className="gradient-text">StartwiseAI</span>
              ?
            </motion.h2>

            <motion.p
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Our AI-powered platform provides comprehensive startup evaluation that goes beyond basic analysis
            </motion.p>

            {/* Stats bar */}
            {/* <motion.div
              className="flex flex-wrap justify-center gap-8 mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { icon: <Users className="w-5 h-5" />, value: "10K+", label: "Startups Analyzed" },
                { icon: <Shield className="w-5 h-5" />, value: "95%", label: "Accuracy Rate" },
                { icon: <Zap className="w-5 h-5" />, value: "<3min", label: "Analysis Time" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 px-6 py-3 rounded-full glass-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-accent">{stat.icon}</div>
                  <div>
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div> */}
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCardComponent key={feature.id} feature={feature} index={index} />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Button
              onClick={handleEvaluateClick}
              variant="gradient"
              size="lg"
              className="px-8 py-4 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-105 group"
            >
              <Lightbulb className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Start Your Analysis
              <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 glass-card rounded-full px-6 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your startup idea into a comprehensive business evaluation in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-10">
                <div className="w-24 h-24 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-primary/50 group-hover:shadow-primary/70 transition-all duration-300 group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                {/* Connection Line */}
                <div className="absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-accent opacity-40 hidden md:block transform translate-x-12"></div>
                {/* Animated Dots */}
                <div className="absolute top-12 left-1/2 w-full hidden md:block transform translate-x-12">
                  <div className="flex justify-center space-x-2 animate-pulse">
                    <div className="w-1 h-1 bg-primary rounded-full opacity-60"></div>
                    <div className="w-1 h-1 bg-primary rounded-full opacity-40"></div>
                    <div className="w-1 h-1 bg-primary rounded-full opacity-20"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">Describe Your Vision</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Share your startup idea, target market, and vision. Our intelligent form captures the essential details that drive meaningful analysis.
              </p>
              {/* Subtle feature indicators */}
              <div className="flex justify-center mt-6 space-x-4 text-xs text-muted-foreground/60">
                <span>• Idea Description</span>
                <span>• Market Focus</span>
                <span>• File Upload</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-10">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-accent/50 group-hover:shadow-accent/70 transition-all duration-300 group-hover:scale-110">
                  <span className="text-3xl font-bold text-primary">2</span>
                </div>
                {/* Connection Line */}
                <div className="absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-accent to-secondary opacity-40 hidden md:block transform translate-x-12"></div>
                {/* Animated Dots */}
                <div className="absolute top-12 left-1/2 w-full hidden md:block transform translate-x-12">
                  <div className="flex justify-center space-x-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <div className="w-1 h-1 bg-accent rounded-full opacity-60"></div>
                    <div className="w-1 h-1 bg-accent rounded-full opacity-40"></div>
                    <div className="w-1 h-1 bg-accent rounded-full opacity-20"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">AI Deep Analysis</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Advanced AI processes your idea through comprehensive market research, competitor analysis, and trend evaluation using real-time data.
              </p>
              {/* Subtle feature indicators */}
              <div className="flex justify-center mt-6 space-x-4 text-xs text-muted-foreground/60">
                <span>• Market Research</span>
                <span>• Competitor Intel</span>
                <span>• RAG Technology</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-10">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-secondary/50 group-hover:shadow-secondary/70 transition-all duration-300 group-hover:scale-110">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
                {/* Glow effect for final step */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-2xl bg-secondary/20 animate-pulse opacity-50"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">Investment-Ready Results</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Receive a comprehensive 6-section evaluation with actionable insights, professional pitch materials, and strategic recommendations.
              </p>
              {/* Subtle feature indicators */}
              <div className="flex justify-center mt-6 space-x-4 text-xs text-muted-foreground/60">
                <span>• 6-Section Report</span>
                <span>• Pitch Deck</span>
                <span>• Success Score</span>
              </div>
            </div>
          </div>

          {/* Bottom highlight */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span>Complete evaluation in under 3 minutes</span>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Startup Idea?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of entrepreneurs who've used StartwiseAI to validate and refine their startup concepts.
            </p>
            <Button
              onClick={handleEvaluateClick}
              variant="gradient"
              size="lg"
              className="px-12 py-6 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-105 group"
            >
              <Lightbulb className="mr-3 h-6 w-6 group-hover:animate-pulse" />
              Start Your Free Evaluation
              <ArrowDown className="ml-3 h-6 w-6 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}