import { motion } from 'framer-motion'
import { Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#050505] pt-24 pb-12 relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-4xl font-bold text-white mb-8 tracking-tighter">WALIA</h2>
            <p className="text-white/40 text-lg max-w-sm mb-8 leading-relaxed font-light">
              Crafting immersive digital journeys into the heart of Ethiopia. Beyond the ordinary, into the extraordinary.
            </p>
            <div className="flex space-x-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: '#d4af37' }}
                  className="text-white/40 transition-colors"
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-4">
              {['Destinations', 'Culture', 'Adventures', 'Wildlife'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-white transition-colors flex items-center group">
                    <span>{item}</span>
                    <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
            <p className="text-white/40 text-sm mb-6">Join the odyssey for exclusive travel stories.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-primary transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-[10px] uppercase tracking-[0.2em] text-white/20">
          <p>© 2026 WALIA TRAVEL. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
