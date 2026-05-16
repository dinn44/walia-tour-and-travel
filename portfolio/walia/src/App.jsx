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
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)

    // Custom cursor
    const dot = cursorDotRef.current
    const ring = cursorRingRef.current
    let mx = 0, my = 0, rx = 0, ry = 0

    const onMouseMove = (e) => {
      mx = e.clientX; my = e.clientY
      dot.style.left = `${mx}px`; dot.style.top = `${my}px`
    }
    window.addEventListener('mousemove', onMouseMove)

    let anim
    const tickRing = () => {
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`
      anim = requestAnimationFrame(tickRing)
    }
    tickRing()

    return () => {
      lenis.destroy()
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(anim)
    }
  }, [])

  return (
    <div style={{ backgroundColor: '#060608' }}>
      <div ref={cursorDotRef} className="cursor-dot" />
      <div ref={cursorRingRef} className="cursor-ring" />
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
