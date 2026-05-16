import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImg from '../assets/hero_bg.png'
import lalibelaImg from '../assets/lalibela_bg.png'
import simienImg from '../assets/simien_bg.png'
import danakilImg from '../assets/danakil_bg.png'

gsap.registerPlugin(ScrollTrigger)

const slides = [
  { image: heroImg, title: 'The Highlands', label: 'Ethiopia' },
  { image: lalibelaImg, title: 'Sacred Stone', label: 'Lalibela' },
  { image: simienImg, title: 'Jagged Horizons', label: 'Simien' },
  { image: danakilImg, title: 'Fire & Ash', label: 'Danakil' },
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
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Each image zooms in slightly as it comes into view
      const images = trackRef.current.querySelectorAll('.gallery-img')
      images.forEach((img) => {
        gsap.fromTo(img,
          { scale: 1.15 },
          {
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: ScrollTrigger.getAll().find(st => st.pin === sectionRef.current),
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="gallery" ref={sectionRef} className="overflow-hidden bg-[#060608]">
      <div ref={trackRef} className="flex h-screen w-max">
        {slides.map((slide, i) => (
          <div key={i} className="relative h-screen w-screen flex-shrink-0 overflow-hidden group">
            <img
              src={slide.image}
              alt={slide.title}
              className="gallery-img w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent" />

            {/* Slide counter */}
            <div className="absolute top-10 right-10 travel-label opacity-50">
              {String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>

            {/* Title */}
            <div className="absolute bottom-16 left-16">
              <p className="travel-label mb-3 opacity-60">{slide.label}</p>
              <h3
                style={{ fontFamily: "'Outfit', sans-serif" }}
                className="text-7xl md:text-9xl font-bold text-white leading-none glow"
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
