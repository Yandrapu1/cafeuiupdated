import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[#0F0B08] bg-cover bg-center bg-no-repeat opacity-85"
        style={{
          backgroundImage:
"url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=2070&auto=format&fit=crop')"
        }}
      />
      {/* Overlay gradient */}
   <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
      {/* Warm golden highlight */}
     

      <div className="relative z-10 w-full max-w-[1400px] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className=" tracking-[0.2em] text-cafe-gold">
            Begals & Bakers
          </span>
         <h1 className="mb-6 leading-[0.95] text-white text-5xl md:text-7xl lg:text-8xl font-serif font-bold">
            The Art of <br />
         <span className="tracking-[0.35em] uppercase text-cafe-gold text-sm font-semibold">
  Artisan Coffee • Fresh Bagels
</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-white/75 leading-relaxed">
  Freshly baked artisan bagels and expertly crafted coffee,
  served daily in a warm and welcoming atmosphere.
</p>
        </motion.div>

        {/* <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-2xl font-sans text-lg font-light text-white/80 md:text-xl"
        >
          Experience the perfect blend of artisanal bagels baked fresh daily and ethically sourced coffee roasted to perfection.
        </motion.p> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
        <button
  onClick={() => navigate("/menu")}
   className="group flex items-center gap-2 rounded-full bg-[#D4B483] px-8 py-4 font-sans text-sm font-bold uppercase tracking-wider text-[#110e0d] transition-all duration-300 hover:bg-[#E2C89B] hover:shadow-[0_0_30px_rgba(197,168,128,0.4)]"
>
            Explore Menu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        <button
  onClick={() => navigate("/about")}
  className="rounded-full border border-white/30 bg-white/10 px-8 py-4 font-sans text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:text-cafe-gold"
>
  Our Story
</button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/50">Scroll</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="h-12 w-[1px] bg-gradient-to-b from-cafe-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
