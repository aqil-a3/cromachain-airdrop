"use client"

import { useRef, useEffect, useCallback } from "react"

export function CustomParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | null>(null)

  const initParticles = useCallback(() => {
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const radiusLength = (canvas.width * canvas.height) / 8000
      let particlesArray: Particle[] = []

      const mouse = {
        x: undefined as number | undefined,
        y: undefined as number | undefined,
        radius: radiusLength,
      }

      class Particle {
        x: number
        y: number
        velX: number
        velY: number
        size: number
        color: string

        constructor(x: number, y: number, velX: number, velY: number, size: number, color: string) {
          this.x = x
          this.y = y
          this.velX = velX
          this.velY = velY
          this.size = size
          this.color = color
        }

        draw() {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
          ctx.fillStyle = "rgba(255, 100, 0, 0.31875)" // Bright orange for particles with 15% reduced opacity
          ctx.fill()
        }

        update() {
          if (this.x > canvas.width || this.x < 0) {
            this.velX = -this.velX
          }
          if (this.y > canvas.height || this.y < 0) {
            this.velY = -this.velY
          }

          // collisions with mouse
          if (mouse.x !== undefined && mouse.y !== undefined) {
            const dx = mouse.x - this.x
            const dy = mouse.y - this.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < mouse.radius + this.size) {
              const buffer = this.size * 10
              if (mouse.x < this.x && this.x < canvas.width - buffer) {
                this.x += 10
              }
              if (mouse.x > this.x && this.x > buffer) {
                this.x -= 10
              }
              if (mouse.y < this.y && this.y < canvas.height - buffer) {
                this.y += 10
              }
              if (mouse.y > this.y && this.y > buffer) {
                this.y -= 10
              }
            }
          }

          // moving
          this.x += this.velX
          this.y += this.velY
          this.draw()
        }
      }

      function createParticles() {
        particlesArray = []
        const noOfParticles = (canvas.width * canvas.height) / 5000

        for (let i = 0; i < noOfParticles; i++) {
          const size = Math.random() * 5 + 1
          const x = Math.random() * (innerWidth - 2 * size) + size
          const y = Math.random() * (innerHeight - 2 * size) + size
          const velX = Math.random() * 5 - 2.5
          const velY = Math.random() * 5 - 2.5
          const color = "rgb(255, 100, 0)" // Bright orange for particles
          particlesArray.push(new Particle(x, y, velX, velY, size, color))
        }
      }

      function connect() {
        const vicinityDist = (canvas.width * canvas.height) / 81
        for (let i = 0; i < particlesArray.length; i++) {
          for (let j = i; j < particlesArray.length; j++) {
            const distance =
              Math.pow(particlesArray[i].x - particlesArray[j].x, 2) +
              Math.pow(particlesArray[i].y - particlesArray[j].y, 2)
            const opacity = 1 - distance / 25000 // This calculation is based on the original code

            if (distance < vicinityDist) {
              ctx.strokeStyle = `rgba(255, 100, 0, ${opacity * 0.31875})` // Bright orange for lines with 15% reduced opacity
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
              ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
              ctx.stroke()
            }
          }
        }
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update()
        }
        connect()
        animationFrameId.current = requestAnimationFrame(animate)
      }

      const handleMouseMove = (event: MouseEvent) => {
        mouse.x = event.x
        mouse.y = event.y
      }

      const handleMouseOut = () => {
        mouse.x = undefined
        mouse.y = undefined
      }

      const handleResize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        mouse.radius = (canvas.width * canvas.height) / 9000
        createParticles()
      }

      // Initial setup
      createParticles()
      animate()

      // Event listeners
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseout", handleMouseOut)
      window.addEventListener("resize", handleResize)

      // Cleanup function
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseout", handleMouseOut)
        window.removeEventListener("resize", handleResize)
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current)
        }
      }
    } catch (error) {
      console.error("Particles initialization error:", error)
      return
    }
  }, [])

  useEffect(() => {
    initParticles()
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-transparent" // Ensure canvas background is transparent
    />
  )
}
