import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImg from '../assets/hero_bg.png'
import lalibelaImg from '../assets/lalibela_bg.png'
import simienImg from '../assets/simien_bg.png'
import danakilImg from '../assets/danakil_bg.png'

gsap.registerPlugin(ScrollTrigger)

const CinematicGallery = () => {
  const sectionRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    const pin = gsap.fromTo(sectionRef.current, 
      { translateX: 0 },
      {
        translateX: "-300vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "2000 top",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1
        }
      }
    )

    return () => {
      pin.kill()
    }
  }, [])

  const images = [
    { src: heroImg, title: "The Highlands" },
    { src: lalibelaImg, title: "Sacred Stone" },
    { src: simienImg, title: "Jagged Horizons" },
    { src: danakilImg, title: "Fire and Ash" }
  ]

  return (
    <section className="overflow-hidden">
      <div ref={triggerRef}>
        <div ref={sectionRef} className="h-screen w-[400vw] flex flex-row relative">
          {images.map((img, i) => (
            <div key={i} className="h-screen w-screen flex-shrink-0 relative overflow-hidden flex items-center justify-center group">
              <img 
                src={img.src} 
                className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" 
                alt={img.title} 
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 text-center">
                <h3 className="text-8xl md:text-[12rem] font-bold text-white/10 uppercase tracking-tighter leading-none select-none">
                  {img.title}
                </h3>
                <h3 className="text-4xl md:text-6xl font-bold text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-glow">
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CinematicGallery
