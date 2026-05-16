import { motion } from 'framer-motion'
import { Calendar, Users, Wallet, Sparkles } from 'lucide-react'

const SmartTripPlanner = () => {
  return (
    <section id="planner" className="py-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-4 py-2 glass-dark rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Sparkles size={14} />
              <span>AI-Powered Planning</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-glow">Smart Trip Planner</h2>
            <p className="text-lg text-white/50 font-light">Customize your Ethiopian odyssey with our intelligent itinerary engine.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-dark p-8 md:p-12 relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <label className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center space-x-2">
                  <Calendar size={14} />
                  <span>When are you going?</span>
                </label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center space-x-2">
                  <Users size={14} />
                  <span>How many travelers?</span>
                </label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                  <option>Solo Traveler</option>
                  <option>Couple</option>
                  <option>Family (3-5)</option>
                  <option>Group (6+)</option>
                </select>
              </div>

              <div className="space-y-4 col-span-1 md:col-span-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center space-x-2">
                  <Wallet size={14} />
                  <span>Your Budget Range (USD)</span>
                </label>
                <div className="px-2 py-4">
                  <input type="range" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
                  <div className="flex justify-between text-xs text-white/40 mt-4">
                    <span>$500</span>
                    <span>$10,000+</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-primary to-[#b8952c] text-black font-bold rounded-xl text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
            >
              Generate Itinerary
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SmartTripPlanner
