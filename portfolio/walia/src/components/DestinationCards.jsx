import { motion } from 'framer-motion'
import { ArrowRight, Star, MapPin } from 'lucide-react'
import lalibelaImg from '../assets/lalibela_bg.png'
import simienImg from '../assets/simien_bg.png'
import danakilImg from '../assets/danakil_bg.png'

const destinations = [
  { name: 'Rock-Hewn Churches', location: 'Lalibela', price: '$1,200', rating: '4.9', image: lalibelaImg, tag: 'History' },
  { name: 'Simien Mountains', location: 'Gondar', price: '$950', rating: '4.8', image: simienImg, tag: 'Nature' },
  { name: 'Danakil Depression', location: 'Afar', price: '$1,500', rating: '4.9', image: danakilImg, tag: 'Adventure' },
]

const DestinationCards = () => {
  return (
    <section id="experiences" className="bg-[#060608] py-32">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <p className="travel-label mb-4">Curated Experiences</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif" }}
              className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tight">
              Signature<br />
              <span className="text-[#d4af37]">Journeys</span>
            </h2>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.4 } }}
              className="group rounded-2xl overflow-hidden border border-white/8 relative"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <img src={dest.image} alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                {/* Tag */}
                <span className="absolute top-4 left-4 text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white border border-white/10">
                  {dest.tag}
                </span>
                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur border border-white/10">
                  <Star size={10} className="text-[#d4af37] fill-[#d4af37]" />
                  <span className="text-[10px] text-white font-bold">{dest.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={11} className="text-[#d4af37]" />
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/40">{dest.location}</span>
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif" }}
                  className="text-xl font-bold text-white mb-6">{dest.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-white/30 block mb-1">Starting from</span>
                    <span className="text-2xl font-bold text-white">{dest.price}</span>
                  </div>
                  <motion.button
                    whileHover={{ x: 4 }}
                    className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-black transition-all duration-300"
                  >
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DestinationCards
