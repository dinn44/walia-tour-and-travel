import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import lalibelaImg from '../assets/lalibela_bg.png'
import simienImg from '../assets/simien_bg.png'
import danakilImg from '../assets/danakil_bg.png'

gsap.registerPlugin(ScrollTrigger)

const stories = [
  {
    number: '01',
    label: 'Ancient History',
    title: 'Lalibela',
    subtitle: 'The Soul of Stone',
    body: 'Carved from solid volcanic rock in the 12th century, the monolithic churches of Lalibela stand as humanity\'s most extraordinary act of devotion — a living pilgrimage site still active today.',
    image: lalibelaImg,
    align: 'left',
  },
  {
    number: '02',
    label: 'Nature & Wildlife',
    title: 'Simien',
    subtitle: 'Roof of Africa',
    body: 'Jagged basalt pinnacles rise above valleys carved by ancient rivers. The Simien Mountains harbor the endemic Gelada baboon and Ethiopian wolf, creatures found nowhere else on Earth.',
    image: simienImg,
    align: 'right',
  },
  {
    number: '03',
    label: 'Raw Adventure',
    title: 'Danakil',
    subtitle: 'The Earth Exhales',
    body: 'One hundred metres below sea level, the Danakil Depression simmers and steams. Sulfur pools glow neon-yellow, lava lakes churn in permanent fury — the planet at its most primal.',
    image: danakilImg,
    align: 'left',
  },
]

const StorySections = () => {
  const sectionsRef = useRef([])

  useEffect(() => {
    sectionsRef.current.forEach((section) => {
      if (!section) return
      const bg = section.querySelector('.story-bg')
      gsap.to(bg, {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section id="destinations" className="bg-[#f8f5f0]">
      {/* Intro */}
      <div className="max-w-7xl mx-auto px-8 py-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#8a7f74] mb-6">Ethiopia Chapters</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-6xl md:text-8xl font-light text-[#2a2520] leading-none">
            Three<br /><em>Worlds</em>
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-sm text-[#8a7f74] font-light leading-relaxed max-w-xs"
        >
          From ancient rock-hewn churches to alien volcanic landscapes — Ethiopia contains multitudes that most travelers never imagine.
        </motion.p>
      </div>

      {/* Story Panels */}
      {stories.map((story, i) => (
        <div
          key={i}
          ref={(el) => (sectionsRef.current[i] = el)}
          className="relative h-[90vh] overflow-hidden"
        >
          {/* Parallax BG */}
          <div className="story-bg absolute inset-0 -top-[15%] h-[130%]">
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-full object-cover img-misty"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5f0]/40 via-transparent to-[#f8f5f0]/60" />
            {story.align === 'left'
              ? <div className="absolute inset-0 bg-gradient-to-r from-[#f8f5f0]/80 via-[#f8f5f0]/30 to-transparent" />
              : <div className="absolute inset-0 bg-gradient-to-l from-[#f8f5f0]/80 via-[#f8f5f0]/30 to-transparent" />
            }
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto w-full px-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-100px' }}
                className={`max-w-md ${story.align === 'right' ? 'ml-auto text-right' : ''}`}
              >
                <div className={`flex items-center gap-4 mb-8 ${story.align === 'right' ? 'justify-end' : ''}`}>
                  <span className="text-[9px] tracking-[0.4em] uppercase text-[#8a7f74]">{story.number}</span>
                  <div className="w-8 h-[1px] bg-[#8a7f74]" />
                  <span className="text-[9px] tracking-[0.4em] uppercase text-[#8a7f74]">{story.label}</span>
                </div>

                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  className="text-7xl md:text-8xl font-light text-[#2a2520] leading-none mb-2">
                  {story.title}
                </h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  className="text-xl italic text-[#8a7f74] mb-8">
                  {story.subtitle}
                </p>
                <p className="text-sm text-[#5a5248] leading-relaxed font-light mb-10">
                  {story.body}
                </p>
                <button
                  className={`text-[10px] tracking-[0.3em] uppercase text-[#2a2520] border-b border-[#2a2520]/30 pb-1 hover:border-[#2a2520] transition-all duration-300 ${story.align === 'right' ? 'ml-auto' : ''}`}
                >
                  Explore Chapter
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default StorySections
