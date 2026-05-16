import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import heroImg from '../assets/hero_bg.png'
import simienImg from '../assets/simien_bg.png'

const Hero = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const titleVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
  }

  const charVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  }

  const title = "WALIA"

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#f0ece6]">

      {/* Background image layer (slowest) */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 top-[-10%] h-[120%]">
        <img src={heroImg} alt="Ethiopia" className="w-full h-full object-cover img-misty" />
        {/* Heavy mist overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0ece6]/80 via-[#f0ece6]/20 to-[#f0ece6]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f0ece6]/60 via-transparent to-[#f0ece6]/60" />
      </motion.div>

      {/* Foreground mountain layer (medium speed) */}
      <motion.div style={{ y: fgY }} className="absolute bottom-0 left-0 right-0 z-10 h-[55%]">
        <img src={simienImg} alt="Mountains" className="w-full h-full object-cover object-top img-misty opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f0ece6] via-[#f0ece6]/50 to-transparent" />
      </motion.div>

      {/* Mist bands */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-[25%] left-0 right-0 h-32 bg-gradient-to-r from-[#f0ece6]/70 via-white/40 to-[#f0ece6]/70 blur-2xl" />
        <div className="absolute top-[45%] left-0 right-0 h-24 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-xl" />
      </div>

      {/* Text content */}
      <motion.div style={{ y: textY, opacity }} className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="text-[10px] uppercase text-[#8a7f74] tracking-[0.4em] mb-8"
        >
          Discover Ethiopia
        </motion.p>

        {/* Main title */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="flex overflow-hidden mb-6"
        >
          {title.split('').map((char, i) => (
            <motion.span
              key={i}
              variants={charVariants}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[12vw] md:text-[10vw] font-light text-[#2a2520] leading-none tracking-[0.15em]"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-xl md:text-2xl text-[#8a7f74] font-light italic tracking-wide max-w-md mb-12"
        >
          Beyond the Ordinary
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          whileHover={{ letterSpacing: '0.35em' }}
          className="text-[10px] uppercase tracking-[0.3em] text-[#2a2520] border-b border-[#2a2520] pb-1 transition-all duration-500"
        >
          Begin Exploration
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-[#8a7f74]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <ChevronDown size={14} className="text-[#8a7f74]" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
