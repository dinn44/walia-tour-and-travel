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
    region: 'Amhara Region',
    title: 'Ancient Ethiopia',
    subtitle: 'The Soul of Lalibela',
    body: 'Carved from solid rock in the 12th century, the monolithic churches of Lalibela are Ethiopia\'s most sacred site — a living pilgrimage where history breathes through stone.',
    image: lalibelaImg,
    color: '#6b3f1f',
    accentColor: '#d4803a',
    align: 'left',
  },
  {
    number: '02',
    region: 'Northern Highlands',
    title: 'Mountains & Nature',
    subtitle: 'Roof of Africa',
    body: 'The Simien Mountains rise dramatically above Africa, their jagged escarpments home to the endemic Gelada baboon and the elusive Ethiopian wolf — creatures of an ancient world.',
    image: simienImg,
    color: '#1a2e1a',
    accentColor: '#4a8c4a',
    align: 'right',
  },
  {
    number: '03',
    region: 'Afar Region',
    title: 'Desert & Adventure',
    subtitle: 'The Earth Exhales',
    body: 'One of the hottest places on Earth, the Danakil Depression is where our planet shows its raw volcanic soul — neon sulfur pools, lava lakes, and crystalline salt flats stretch to the horizon.',
    image: danakilImg,
    color: '#3d1a00',
    accentColor: '#e8751a',
    align: 'left',
  },
]

const StorySections = () => {
  const panelsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      panelsRef.current.forEach((panel) => {
        if (!panel) return

        const bg = panel.querySelector('.story-bg-img')
        const mid = panel.querySelector('.story-mid-layer')
        const content = panel.querySelector('.story-content')
        const title = panel.querySelector('.story-title')

        // Background zooms in slowly = entering the scene
        gsap.fromTo(bg,
          { scale: 1.0, yPercent: -5 },
          {
            scale: 1.18,
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )

        // Mid layer moves faster = depth
        if (mid) {
          gsap.to(mid, {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        // Content fades + rises into view = arriving
        gsap.fromTo(content,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Title does a subtle scale as you approach
        gsap.fromTo(title,
          { scale: 0.92 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'center center',
              scrub: true,
            },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div id="destinations">
      {stories.map((story, i) => (
        <section
          key={i}
          ref={(el) => (panelsRef.current[i] = el)}
          className="relative h-[110vh] overflow-hidden flex items-center"
          style={{ backgroundColor: story.color }}
        >
          {/* === Background image layer (slowest, zooms in) === */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={story.image}
              alt={story.title}
              className="story-bg-img w-full h-full object-cover origin-center"
            />
            {/* Deep atmosphere darkening */}
            <div className="absolute inset-0 bg-black/50" />
            {/* Gradient from the side where text is */}
            {story.align === 'left'
              ? <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
              : <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />
            }
            {/* Bottom fade into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060608] to-transparent" />
          </div>

          {/* === Mid atmosphere layer === */}
          <div className="story-mid-layer absolute inset-0 z-10 pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-[#060608]/60 to-transparent" />
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 z-15 vignette pointer-events-none" />

          {/* === Content === */}
          <div className="relative z-20 max-w-7xl mx-auto w-full px-8 md:px-16">
            <div className={`story-content max-w-xl ${story.align === 'right' ? 'ml-auto text-right' : ''}`}>

              {/* Chapter number + region */}
              <div className={`flex items-center gap-4 mb-8 ${story.align === 'right' ? 'justify-end' : ''}`}>
                <span className="travel-label opacity-60">{story.number}</span>
                <div className="w-8 h-[1px] opacity-60" style={{ background: story.accentColor }} />
                <span className="travel-label opacity-60">{story.region}</span>
              </div>

              {/* Section heading */}
              <p className="travel-label mb-3 opacity-80">{story.title}</p>

              {/* Giant title */}
              <h2
                className="story-title text-6xl md:text-8xl font-bold text-white leading-none tracking-tight mb-6"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {story.subtitle}
              </h2>

              {/* Body */}
              <p className="text-base text-white/50 leading-relaxed font-light mb-10 max-w-sm">
                {story.body}
              </p>

              {/* CTA */}
              <motion.button
                whileHover={{ x: story.align === 'right' ? -6 : 6 }}
                className="inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase font-medium transition-colors"
                style={{ color: story.accentColor }}
              >
                {story.align === 'right' && <span className="w-8 h-[1px]" style={{ background: story.accentColor }} />}
                Explore Destination
                {story.align === 'left' && <span className="w-8 h-[1px]" style={{ background: story.accentColor }} />}
              </motion.button>
            </div>
          </div>

          {/* Large background text number */}
          <div className={`absolute bottom-8 z-10 ${story.align === 'right' ? 'left-8' : 'right-8'}`}>
            <span className="text-[20vw] font-bold leading-none opacity-[0.03] text-white select-none"
              style={{ fontFamily: "'Outfit', sans-serif" }}>
              {story.number}
            </span>
          </div>
        </section>
      ))}
    </div>
  )
}

export default StorySections
