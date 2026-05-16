import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Destinations', 'Culture', 'Journeys', 'Plan']

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'py-4 bg-[#f8f5f0]/90 backdrop-blur-md shadow-sm' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col"
        >
          <span style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-2xl font-light tracking-[0.25em] text-[#2a2520] uppercase">
            Walia
          </span>
          <span className="text-[9px] tracking-[0.4em] text-[#8a7f74] uppercase -mt-1">Ethiopia</span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-12">
          {links.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.4, duration: 0.6 }}
              className="text-[11px] tracking-[0.25em] text-[#8a7f74] hover:text-[#2a2520] transition-colors duration-300 uppercase"
            >
              {link}
            </motion.a>
          ))}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="text-[10px] tracking-[0.3em] uppercase border border-[#2a2520] text-[#2a2520] px-6 py-2.5 hover:bg-[#2a2520] hover:text-[#f8f5f0] transition-all duration-500"
          >
            Begin Journey
          </motion.button>
        </div>

        {/* Mobile */}
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden text-[#2a2520]">
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#f8f5f0]/95 backdrop-blur-md border-t border-[#ede8e0] px-8 py-6 space-y-5"
          >
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`}
                onClick={() => setIsMobileOpen(false)}
                className="block text-[11px] tracking-[0.3em] uppercase text-[#8a7f74]">{l}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
