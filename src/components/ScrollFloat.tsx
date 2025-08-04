"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollFloatProps {
  children: React.ReactNode
  animationDuration?: number
  ease?: string
  scrollStart?: string
  scrollEnd?: string
  stagger?: number
  className?: string
}

const ScrollFloat = ({
  children,
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  className = ''
}: ScrollFloatProps) => {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = textRef.current
    if (!element) return

    // Convert text content to individual character spans
    const text = element.textContent || ''
    const chars = text.split('')
    
    element.innerHTML = chars
      .map((char) => {
        if (char === ' ') {
          return '<span class="char"> </span>'
        }
        return `<span class="char">${char}</span>`
      })
      .join('')

    const charElements = element.querySelectorAll('.char')

    // Set initial state
    gsap.set(charElements, {
      opacity: 0,
      y: 100,
      rotationX: -90,
      transformOrigin: '50% 50% -50px'
    })

    // Create scroll-triggered animation
    gsap.to(charElements, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: animationDuration,
      ease: ease,
      stagger: stagger,
      scrollTrigger: {
        trigger: element,
        start: scrollStart,
        end: scrollEnd,
        toggleActions: 'play none none reverse'
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger])

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  )
}

export default ScrollFloat
