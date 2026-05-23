import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-theme-bg">
      <section className="relative py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            
            {/* Images Grid */}
            <div className="relative grid grid-cols-2 gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="mt-12 overflow-hidden rounded-[2rem] shadow-sm"
              >
                <img 
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop" 
                  alt="Coffee preparation" 
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="overflow-hidden rounded-[2rem] shadow-sm"
              >
                <img 
                  src="https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=1974&auto=format&fit=crop" 
                  alt="Fresh bagels" 
                  className="h-[120%] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </motion.div>
              
              {/* Decorative element */}
              <div className="absolute -left-8 -top-8 -z-10 h-64 w-64 rounded-full bg-theme-accent/20 blur-3xl" />
              <div className="absolute -bottom-12 -right-12 -z-10 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
            </div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:pl-10"
            >
              <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-theme-accent">
                Our Heritage
              </h2>
              <h3 className="mb-6 font-serif text-4xl font-bold leading-tight text-theme-text md:text-5xl">
                Crafting Moments <br />
                <span className="italic text-theme-accent">Since 2010</span>
              </h3>
              
              <p className="mb-6 font-sans text-lg font-light leading-relaxed text-theme-text-muted">
                What started as a small neighborhood bakery has blossomed into a haven for coffee enthusiasts and bagel lovers alike. We believe in the power of simple ingredients, treated with respect and crafted with passion.
              </p>
              
              <p className="mb-10 font-sans text-lg font-light leading-relaxed text-theme-text-muted">
                Every morning, our master bakers hand-roll our signature dough, boiling and baking them to that perfect chewy-yet-crisp texture. Paired with our locally roasted, ethically sourced coffee, we offer an experience that feels like home, yet tastes extraordinary.
              </p>

              <div className="grid grid-cols-2 gap-8 border-t border-theme-border pt-8">
                <div>
                  <p className="font-serif text-4xl font-bold text-theme-accent">15+</p>
                  <p className="mt-2 font-sans text-sm uppercase tracking-wider text-theme-text-muted">Years of Excellence</p>
                </div>
                <div>
                  <p className="font-serif text-4xl font-bold text-theme-accent">100%</p>
                  <p className="mt-2 font-sans text-sm uppercase tracking-wider text-theme-text-muted">Handcrafted Daily</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
