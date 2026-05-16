import { useEffect } from 'react'
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
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <StorySections />
        <div className="container mx-auto px-6 py-24">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center text-glow">Curated Experiences</h2>
          <DestinationCards />
        </div>
        <CinematicGallery />
        <SmartTripPlanner />
      </main>
      <Footer />
    </div>
  )
}

export default App
 
 
 
 
