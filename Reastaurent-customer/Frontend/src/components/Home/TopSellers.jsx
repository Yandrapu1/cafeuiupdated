import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopSellers() {
  const navigate = useNavigate();

  const topItems = [
    {
      id: 1,
      name: "The Everything Bagel",
      desc: "Our signature blend of sesame, poppy seeds, onion, garlic, and sea salt.",
      price: "150.00",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Cold Brew Espresso",
      desc: "Slow-steeped for 18 hours, incredibly smooth with chocolate notes.",
      price: "220.00",
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2069&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Lox & Cream Cheese",
      desc: "Premium smoked salmon with dill cream cheese, capers, and red onion.",
      price: "350.00",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-24  border-t relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cafe-gold/10 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-cafe-gold font-sans font-bold uppercase tracking-[0.2em] mb-4 block">
              Customer Favorites
            </span>
            <h2 className="text-white font-serif text-4xl md:text-5xl font-bold">
              Our Top Sellers
            </h2>
          </div>
          <button 
            onClick={() => navigate('/menu')}
            className="text-white/60 uppercase font-bold tracking-widest text-sm hover:text-cafe-gold transition-colors border-b border-transparent hover:border-cafe-gold pb-1 self-start md:self-end"
          >
            View Full Menu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative bg-[#110e0d] rounded-3xl overflow-hidden border border-white/10 hover:border-cafe-gold/30 transition-colors"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110e0d] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <h3 className="text-xl font-serif font-bold text-white shadow-sm">{item.name}</h3>
                  <div className="bg-[#110e0d]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-cafe-gold font-serif font-bold shadow-lg">
                    £{item.price}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-white/60 font-sans text-sm leading-relaxed mb-6">
                  {item.desc}
                </p>
                <button 
                  onClick={() => navigate('/menu')}
                  className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-wider hover:bg-cafe-gold hover:text-[#110e0d] transition-colors flex items-center justify-center gap-2 group-hover:border-cafe-gold/50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Order Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
