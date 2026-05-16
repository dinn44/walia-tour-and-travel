import { motion } from 'framer-motion'
import { Instagram, Twitter, ArrowUpRight } from 'lucide-react'

const Footer = () => (
  <footer className="bg-[#030305] pt-24 pb-12 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="md:col-span-2">
          <h2 style={{ fontFamily: "'Outfit', sans-serif" }}
            className="text-5xl font-bold text-white tracking-tight mb-6 glow">WALIA</h2>
          <p className="text-white/30 font-light leading-relaxed max-w-xs mb-10 text-sm">
            Crafting immersive Ethiopian journeys for those who seek depth, beauty, and meaning beyond the ordinary.
          </p>
          <div className="flex gap-5">
            {[Instagram, Twitter].map((Icon, i) => (
              <motion.a key={i} href="#" whileHover={{ y: -4 }}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all">
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <p className="travel-label mb-8 opacity-40">Explore</p>
          <ul className="space-y-4">
            {['Destinations', 'Culture', 'Adventures', 'Wildlife'].map((item) => (
              <li key={item}>
                <a href="#" className="flex items-center justify-between group text-sm text-white/30 hover:text-white transition-colors font-light">
                  {item} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="travel-label mb-8 opacity-40">Newsletter</p>
          <p className="text-sm text-white/30 font-light mb-6 leading-relaxed">Stories from the heart of Ethiopia in your inbox.</p>
          <div className="flex items-center border-b border-white/15 pb-3 gap-3">
            <input type="email" placeholder="your@email.com"
              className="bg-transparent text-sm text-white placeholder-white/20 font-light focus:outline-none flex-1" />
            <ArrowUpRight size={14} className="text-white/20 cursor-pointer hover:text-[#d4af37] transition-colors flex-shrink-0" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
        <p className="text-[9px] tracking-[0.3em] uppercase text-white/15">© 2026 Walia Travel · All Rights Reserved</p>
        <div className="flex gap-8">
          {['Privacy', 'Terms', 'Cookies'].map(i => (
            <a key={i} href="#" className="text-[9px] tracking-[0.3em] uppercase text-white/15 hover:text-white/40 transition-colors">{i}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
