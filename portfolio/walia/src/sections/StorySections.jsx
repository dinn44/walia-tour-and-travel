import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import lalibelaImg from '../assets/lalibela_bg.png'
import simienImg from '../assets/simien_bg.png'
import danakilImg from '../assets/danakil_bg.png'

gsap.registerPlugin(ScrollTrigger)

const StorySections = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const sections = gsap.utils.toArray('.story-section')
    
    sections.forEach((section) => {
      const bg = section.querySelector('.section-bg')
      const content = section.querySelector('.section-content')

      gsap.to(bg, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      })

      gsap.fromTo(content, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top center+=100",
            toggleActions: "play none none reverse"
          }
        }
      )
    })
  }, [])

  const stories = [
    {
      title: "Ancient Ethiopia",
      subtitle: "The Soul of Lalibela",
      description: "Carved from solid rock, the churches of Lalibela stand as a testament to faith and architectural genius. A place where history is etched in stone.",
      image: lalibelaImg,
      side: "left"
    },
    {
      title: "Mountains & Nature",
      subtitle: "Roof of Africa",
      description: "Traverse the rugged Simien Mountains, where jagged peaks meet emerald plateaus. Home to the unique Gelada baboons and breathtaking vistas.",
      image: simienImg,
      side: "right"
    },
    {
      title: "Desert & Adventure",
      subtitle: "The Gates of Hell",
      description: "Explore the Danakil Depression, one of the hottest and lowest places on Earth. Witness glowing lava lakes and alien-like sulfur pools.",
      image: danakilImg,
      side: "left"
    }
  ]

  return (
    <div ref={containerRef}>
      {stories.map((story, i) => (
        <section 
          key={i} 
          className="story-section relative h-[120vh] w-full flex items-center overflow-hidden"
        >
          {/* Parallax Background */}
          <div className="section-bg absolute inset-0 -top-[20%] h-[140%] w-full z-0">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img 
              src={story.image} 
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <div className={`section-content max-w-xl ${story.side === 'right' ? 'ml-auto text-right' : 'mr-auto'}`}>
              <motion.span className="text-primary font-cinematic tracking-widest uppercase text-xs mb-4 block">
                {story.title}
              </motion.span>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {story.subtitle}
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8 font-light">
                {story.description}
              </p>
              <button className="group flex items-center space-x-4 text-white font-medium hover:text-primary transition-colors">
                <span className="h-[1px] w-8 bg-white group-hover:bg-primary group-hover:w-12 transition-all" />
                <span>Read the Story</span>
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default StorySections
