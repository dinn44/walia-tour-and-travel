import { motion } from 'framer-motion'
import { Sparkles, Calendar, Users, Wallet } from 'lucide-react'

const SmartTripPlanner = () => (
  <section id="plan" className="bg-[#060608] py-32 relative overflow-hidden">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/6 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/6 rounded-full blur-[120px] pointer-events-none" />

    <div className="max-w-3xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/20 text-[#d4af37] text-[10px] tracking-[0.3em] uppercase mb-6">
          <Sparkles size={12} /> AI-Powered
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontFamily: "'Outfit', sans-serif" }}
          className="text-5xl md:text-6xl font-bold text-white mb-4 glow">
          Smart Trip Planner
        </motion.h2>
        <p className="text-white/40 font-light">Customize your Ethiopian odyssey</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass rounded-3xl p-8 md:p-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">
              <Calendar size={12} /> When
            </label>
            <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-colors" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">
              <Users size={12} /> Travelers
            </label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-colors appearance-none">
              <option>Solo Explorer</option>
              <option>Couple</option>
              <option>Small Group (3–5)</option>
              <option>Large Group (6+)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">
            <Wallet size={12} /> Budget Range (USD)
          </label>
          <input type="range" className="w-full h-[2px] bg-white/10 rounded-lg accent-[#d4af37]" />
          <div className="flex justify-between text-[10px] text-white/30 mt-3">
            <span>$500</span><span>$10,000+</span>
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-[#d4af37] text-black text-[11px] tracking-[0.3em] uppercase font-bold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300">
          Generate Itinerary
        </motion.button>
      </motion.div>
    </div>
  </section>
)

export default SmartTripPlanner
