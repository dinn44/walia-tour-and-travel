import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'
import heroImg from '../assets/hero_bg.png'
import simienImg from '../assets/simien_bg.png'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const containerRef = useRef(null)
  const skyRef = useRef(null)
  const midRef = useRef(null)
  const fgRef = useRef(null)
  const textRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  // Text moves up and fades - like camera leaving the ground
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sky layer - moves SLOWEST (like a distant background)
      gsap.to(skyRef.current, {
        yPercent: -20,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Mid layer - moves at medium speed
      gsap.to(midRef.current, {
        yPercent: -40,
        scale: 1.25,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Foreground layer - moves FASTEST (creates sense of rushing through)
      gsap.to(fgRef.current, {
        yPercent: -70,
        scale: 1.4,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative h-[120vh] w-full overflow-hidden bg-[#060608]">

      {/* ---- LAYER 1: Sky / Background (slowest) ---- */}
      <div ref={skyRef} className="scene-layer z-0">
        <img src={heroImg} alt="Ethiopia sky" className="w-full h-full object-cover" />
        {/* Darken the sky dramatically */}
        <div className="absolute inset-0 bg-[#060608]/50" />
      </div>

      {/* ---- LAYER 2: Mid Mountains (medium speed) ---- */}
      <div ref={midRef} className="scene-layer z-10 top-auto bottom-0 h-[80%]">
        <img src={simienImg} alt="Mountains" className="w-full h-full object-cover object-top opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/20 to-transparent" />
      </div>

      {/* ---- LAYER 3: Bottom ground / vignette (fastest) ---- */}
      <div ref={fgRef} className="scene-layer z-20 top-auto bottom-[-5%] h-[35%]">
        <div className="w-full h-full bg-gradient-to-t from-[#060608] via-[#060608]/90 to-transparent" />
      </div>

      {/* Radial vignette overlay */}
      <div className="absolute inset-0 z-25 vignette pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 40}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 12 + 8}s`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      {/* ---- Hero Text ---- */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6"
      >
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.45em' }}
          transition={{ duration: 2, delay: 0.3 }}
          className="travel-label mb-8 block"
        >
          Discover Ethiopia
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Outfit', sans-serif" }}
          className="text-[16vw] md:text-[11vw] font-bold text-white leading-none tracking-tighter glow mb-4"
        >
          WALIA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-lg md:text-xl text-white/50 font-light tracking-widest mb-12 max-w-lg"
        >
          Scroll to travel through Ethiopia
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#d4af37] to-transparent" />
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown size={14} className="text-[#d4af37]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
