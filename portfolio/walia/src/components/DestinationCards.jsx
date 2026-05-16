import { motion } from 'framer-motion'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import lalibelaImg from '../assets/lalibela_bg.png'
import simienImg from '../assets/simien_bg.png'
import danakilImg from '../assets/danakil_bg.png'

const DestinationCards = () => {
  const destinations = [
    {
      name: "Rock-Hewn Churches",
      location: "Lalibela",
      price: "$1,200",
      rating: "4.9",
      image: lalibelaImg,
    },
    {
      name: "Simien Mountains",
      location: "Gondar",
      price: "$950",
      rating: "4.8",
      image: simienImg,
    },
    {
      name: "Danakil Depression",
      location: "Afar",
      price: "$1,500",
      rating: "4.9",
      image: danakilImg,
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {destinations.map((dest, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          viewport={{ once: true }}
          whileHover={{ y: -10 }}
          className="glass-dark group overflow-hidden cursor-pointer"
        >
          <div className="relative h-80 overflow-hidden">
            <img 
              src={dest.image} 
              alt={dest.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4 glass px-3 py-1 flex items-center space-x-1">
              <Star size={14} className="text-primary fill-primary" />
              <span className="text-xs font-bold text-white">{dest.rating}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="p-8">
            <div className="flex items-center space-x-2 text-primary mb-2">
              <MapPin size={14} />
              <span className="text-[10px] uppercase tracking-widest font-bold">{dest.location}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{dest.name}</h3>
            
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <div>
                <span className="text-xs text-white/40 block">Starting from</span>
                <span className="text-xl font-bold text-white">{dest.price}</span>
              </div>
              <motion.button
                whileHover={{ x: 5 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors"
              >
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default DestinationCards
 
 
