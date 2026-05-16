import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StorySections from './sections/StorySections'
import DestinationCards from './components/DestinationCards'
import CinematicGallery from './components/CinematicGallery'
import SmartTripPlanner from './components/SmartTripPlanner'
import Footer from './components/Footer'
import './App.css'

function App() {
  const cursorDotRef = useRef(null)
  const cursorRingRef = useRef(null)

  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Custom cursor
    const dot = cursorDotRef.current
    const ring = cursorRingRef.current
    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = `${mouseX}px`
      dot.style.top = `${mouseY}px`
    }
    window.addEventListener('mousemove', onMouseMove)

    let animId
    const animatRing = () => {
      ringX += (mouseX - ringX) * 0.1
      ringY += (mouseY - ringY) * 0.1
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`
      animId = requestAnimationFrame(animatRing)
    }
    animatRing()

    return () => {
      lenis.destroy()
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div className="bg-[#f8f5f0]">
      {/* Custom Cursor */}
      <div ref={cursorDotRef} className="custom-cursor" style={{ transform: 'translate(-50%, -50%)' }} />
      <div ref={cursorRingRef} className="cursor-ring" style={{ transform: 'translate(-50%, -50%)' }} />

      <Navbar />
      <main>
        <Hero />
        <StorySections />
        <DestinationCards />
        <CinematicGallery />
        <SmartTripPlanner />
      </main>
      <Footer />
    </div>
  )
}

export default App
