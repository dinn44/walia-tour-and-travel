import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import lalibelaImg from '../assets/lalibela_bg.png'
import simienImg from '../assets/simien_bg.png'
import danakilImg from '../assets/danakil_bg.png'

const destinations = [
  {
    name: 'Rock-Hewn Churches',
    location: 'Lalibela, Amhara',
    duration: '4 Days',
    price: '$1,200',
    image: lalibelaImg,
    tag: 'History',
  },
  {
    name: 'Simien Mountains',
    location: 'Gondar, Amhara',
    duration: '6 Days',
    price: '$950',
    image: simienImg,
    tag: 'Nature',
  },
  {
    name: 'Danakil Depression',
    location: 'Afar Region',
    duration: '3 Days',
    price: '$1,500',
    image: danakilImg,
    tag: 'Adventure',
  },
]

const DestinationCards = () => {
  return (
    <section id="journeys" className="bg-[#f8f5f0] py-32">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#8a7f74] mb-4">Curated Experiences</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-5xl md:text-7xl font-light text-[#2a2520] leading-none">
              Signature<br /><em>Journeys</em>
            </h2>
          </motion.div>
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[#8a7f74] hover:text-[#2a2520] transition-colors"
          >
            View all <ArrowRight size={12} />
          </motion.a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#ede8e0]">
          {destinations.map((dest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="card-hover group bg-[#f8f5f0] cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover img-misty transition-transform duration-700 group-hover:scale-105"
                />
                {/* Tag */}
                <span className="absolute top-5 left-5 text-[9px] tracking-[0.3em] uppercase bg-[#f8f5f0]/80 backdrop-blur-sm text-[#2a2520] px-3 py-1.5">
                  {dest.tag}
                </span>
              </div>

              {/* Info */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] tracking-[0.3em] uppercase text-[#8a7f74]">{dest.location}</span>
                  <span className="text-[9px] tracking-[0.3em] uppercase text-[#8a7f74]">{dest.duration}</span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  className="text-2xl font-light text-[#2a2520] mb-6 group-hover:italic transition-all duration-500">
                  {dest.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    className="text-xl text-[#2a2520]">{dest.price}</span>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="w-8 h-8 border border-[#2a2520]/20 flex items-center justify-center group-hover:border-[#2a2520] transition-colors duration-300"
                  >
                    <ArrowRight size={14} className="text-[#2a2520]" />
                  </motion.div>
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
