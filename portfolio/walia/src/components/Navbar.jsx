import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Destinations', 'Experiences', 'Gallery', 'Plan']

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'py-3' : 'py-6'}`}>
      <div className={`mx-6 md:mx-12 px-6 py-3 flex items-center justify-between rounded-2xl transition-all duration-700 ${isScrolled ? 'bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl' : 'bg-transparent'}`}>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-2"
        >
          <span style={{ fontFamily: "'Outfit', sans-serif" }}
            className="text-xl font-bold tracking-[0.2em] text-white uppercase">WALIA</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
        </motion.div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="text-[11px] tracking-[0.25em] uppercase text-white/50 hover:text-white relative group transition-colors duration-300"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all duration-400" />
            </motion.a>
          ))}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 bg-[#d4af37] text-black text-[10px] tracking-[0.3em] uppercase font-bold rounded-full hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all duration-300"
          >
            Begin Journey
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden text-white">
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-6 mt-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-6 space-y-5">
              {links.map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-[12px] tracking-[0.3em] uppercase text-white/60 hover:text-white">
                  {l}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
