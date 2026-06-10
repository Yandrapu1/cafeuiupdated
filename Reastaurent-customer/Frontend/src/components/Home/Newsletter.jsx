import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';

export default function Newsletter() {
  const features = [
    "Exclusive Discounts",
    "New Menu Launches",
    "Monthly Special Offers"
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#110e0d] to-[#0a0807] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#F5EFE6] rounded-[2.5rem] p-10 md:p-16 shadow-[0_30px_60px_rgba(26,18,13,0.4)] relative overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8DCC8] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E8DCC8] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-[#8B5A33] font-sans font-bold uppercase tracking-[0.2em] text-sm">
                Member Benefits
              </span>
              <h2 className="text-[#2D1B12] font-serif text-4xl md:text-5xl font-bold leading-tight">
                Join Our Coffee Club
              </h2>
              <p className="text-[#2D1B12]/80 font-sans text-lg leading-relaxed">
                Be the first to discover seasonal brews, freshly baked favorites, exclusive offers, and members-only rewards.
              </p>
              
              <ul className="space-y-3 pt-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[#2D1B12]/90 font-sans font-medium">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8B5A33]/10 flex items-center justify-center text-[#8B5A33]">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-xl">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-[#8B5A33]/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-[#8B5A33]" />
                </div>
              </div>
              <h3 className="text-[#2D1B12] font-serif text-2xl font-bold text-center mb-6">
                Subscribe Today
              </h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full bg-white border border-[#2D1B12]/10 rounded-2xl px-5 py-4 text-[#2D1B12] placeholder:text-[#2D1B12]/40 outline-none focus:border-[#8B5A33] focus:ring-2 focus:ring-[#8B5A33]/20 transition-all font-sans"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#2D1B12] hover:bg-[#1A120D] text-white font-bold uppercase tracking-wider text-sm py-4 rounded-2xl transition-all hover:shadow-[0_10px_30px_rgba(45,27,18,0.3)] hover:-translate-y-1"
                >
                  Join the Club
                </button>
                <p className="text-center text-[#2D1B12]/50 text-xs mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
