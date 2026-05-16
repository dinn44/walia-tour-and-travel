import { motion } from 'framer-motion'
import { Instagram, ArrowUpRight } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#2a2520] text-[#f8f5f0] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-20 border-b border-white/10">
          <div className="md:col-span-2">
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-6xl font-light tracking-[0.1em] mb-6"
            >
              Walia
            </h2>
            <p className="text-sm text-white/40 leading-relaxed font-light max-w-xs mb-10">
              Crafting extraordinary Ethiopian journeys for those who seek depth, beauty, and meaning in travel.
            </p>
            <div className="flex items-center gap-2 group cursor-pointer">
              <Instagram size={16} className="text-white/40 group-hover:text-white transition-colors" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 group-hover:text-white transition-colors">
                @walia.travel
              </span>
            </div>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 mb-8">Explore</p>
            <ul className="space-y-5">
              {['Destinations', 'Culture', 'Adventures', 'Wildlife', 'About us'].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center justify-between group text-sm text-white/50 hover:text-white transition-colors font-light">
                    <span>{item}</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 mb-8">Newsletter</p>
            <p className="text-sm text-white/40 font-light leading-relaxed mb-8">
              Stories and journals from the heart of Ethiopia, delivered to your inbox.
            </p>
            <div className="border-b border-white/20 pb-3 flex items-center justify-between">
              <input
                type="email"
                placeholder="Your email"
                className="bg-transparent text-sm text-white placeholder-white/30 font-light focus:outline-none w-full"
              />
              <ArrowUpRight size={14} className="text-white/30 flex-shrink-0 ml-4 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[9px] tracking-[0.3em] uppercase text-white/20">
            © 2026 Walia Travel · All Rights Reserved
          </p>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-[9px] tracking-[0.3em] uppercase text-white/20 hover:text-white/50 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
