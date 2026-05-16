import { motion } from 'framer-motion'

const SmartTripPlanner = () => {
  return (
    <section id="plan" className="bg-[#ede8e0] py-32">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">

          {/* Left — editorial text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#8a7f74] mb-8">Bespoke Travel</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-6xl md:text-7xl font-light text-[#2a2520] leading-none mb-10"
            >
              Plan Your<br /><em>Journey</em>
            </h2>
            <p className="text-sm text-[#8a7f74] leading-relaxed font-light max-w-sm mb-12">
              Every journey to Ethiopia is unique. Let us craft an itinerary that reflects your pace, your curiosity, and your sense of adventure.
            </p>
            <div className="space-y-6">
              {['Tailor-made itineraries', 'Expert local guides', 'Luxury accommodations', 'Private transfers'].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="w-4 h-[1px] bg-[#8a7f74]" />
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#8a7f74]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Name */}
            <div className="border-b border-[#8a7f74]/30 pb-4">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#8a7f74] block mb-3">Your Name</label>
              <input
                type="text"
                placeholder="Full name"
                className="w-full bg-transparent text-[#2a2520] placeholder-[#8a7f74]/50 text-sm font-light focus:outline-none"
              />
            </div>

            {/* Travel Date */}
            <div className="border-b border-[#8a7f74]/30 pb-4">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#8a7f74] block mb-3">When are you traveling?</label>
              <input
                type="date"
                className="w-full bg-transparent text-[#2a2520] text-sm font-light focus:outline-none"
              />
            </div>

            {/* Travelers */}
            <div className="border-b border-[#8a7f74]/30 pb-4">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#8a7f74] block mb-3">Travelers</label>
              <select className="w-full bg-transparent text-[#2a2520] text-sm font-light focus:outline-none appearance-none cursor-pointer">
                <option>Solo</option>
                <option>Couple</option>
                <option>Small Group (3–5)</option>
                <option>Large Group (6+)</option>
              </select>
            </div>

            {/* Budget */}
            <div className="border-b border-[#8a7f74]/30 pb-4">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#8a7f74] block mb-3">Budget Range (USD)</label>
              <input
                type="range"
                className="w-full h-[1px] bg-[#8a7f74]/30 cursor-pointer accent-[#2a2520]"
              />
              <div className="flex justify-between mt-3 text-[9px] tracking-widest text-[#8a7f74]">
                <span>$500</span>
                <span>$10,000+</span>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ letterSpacing: '0.35em' }}
              className="w-full py-5 border border-[#2a2520] text-[10px] tracking-[0.3em] uppercase text-[#2a2520] hover:bg-[#2a2520] hover:text-[#f8f5f0] transition-all duration-700"
            >
              Request Proposal
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SmartTripPlanner
