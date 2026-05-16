import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImg from '../assets/hero_bg.png'
import lalibelaImg from '../assets/lalibela_bg.png'
import simienImg from '../assets/simien_bg.png'
import danakilImg from '../assets/danakil_bg.png'

gsap.registerPlugin(ScrollTrigger)

const slides = [
  { image: heroImg, title: 'The Highlands', subtitle: 'Ethiopia' },
  { image: lalibelaImg, title: 'Sacred Stone', subtitle: 'Lalibela' },
  { image: simienImg, title: 'Jagged Horizons', subtitle: 'Simien' },
  { image: danakilImg, title: 'Fire & Ash', subtitle: 'Danakil' },
]

const CinematicGallery = () => {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalWidth = trackRef.current.scrollWidth - window.innerWidth
      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalWidth + window.innerHeight}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#f8f5f0]">
      <div ref={trackRef} className="flex h-screen w-max">
        {slides.map((slide, i) => (
          <div key={i} className="relative h-screen w-screen flex-shrink-0 overflow-hidden group">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover img-misty transition-transform duration-[1.5s] group-hover:scale-[1.03]"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5f0]/30 via-transparent to-[#f8f5f0]/50" />

            {/* Slide number */}
            <div className="absolute top-12 right-12 text-[9px] tracking-[0.4em] uppercase text-[#8a7f74]">
              {String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>

            {/* Title */}
            <div className="absolute bottom-16 left-16">
              <p className="text-[9px] tracking-[0.4em] uppercase text-[#8a7f74] mb-3">{slide.subtitle}</p>
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-7xl md:text-8xl font-light text-[#2a2520] leading-none"
              >
                {slide.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CinematicGallery
