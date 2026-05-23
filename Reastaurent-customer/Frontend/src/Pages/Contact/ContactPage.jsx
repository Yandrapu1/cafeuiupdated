import { motion } from "framer-motion";
import Footer from "../../components/common/Footer";

export default function ContactPage() {
  return (
    <div className="pt-24 min-h-screen bg-theme-bg flex flex-col">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <div className="text-center mb-16">
          <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-theme-accent">
            Get In Touch
          </h2>
          <h1 className="font-serif text-4xl font-bold text-theme-text md:text-5xl">
            Contact <span className="italic text-theme-accent">Us</span>
          </h1>
          <p className="mt-4 mx-auto max-w-xl text-theme-text-muted">
            Have a question or feedback? We would love to hear from you. Fill out the form below or reach us using the contact details.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-theme-surface p-8 shadow-sm border border-theme-border"
          >
            <h3 className="font-serif text-2xl font-bold text-theme-text mb-6">Send a Message</h3>
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-2">Name</label>
                <input type="text" className="customer-input bg-theme-surface border-transparent focus:border-theme-accent/50 focus:bg-theme-surface" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-2">Email</label>
                <input type="email" className="customer-input bg-theme-surface border-transparent focus:border-theme-accent/50 focus:bg-theme-surface" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-2">Message</label>
                <textarea className="customer-textarea bg-theme-surface border-transparent focus:border-theme-accent/50 focus:bg-theme-surface" placeholder="How can we help you?" />
              </div>
              <button type="submit" className="customer-primary-button mt-4">
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Map/Info Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="h-[300px] w-full rounded-3xl overflow-hidden bg-theme-surface border border-theme-border relative">
              {/* Dummy Map Image */}
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
                alt="Map location"
                className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-theme-surface px-6 py-3 rounded-full shadow-lg font-bold text-theme-text flex items-center gap-2">
                  <span className="text-red-500">📍</span> Bagel Cafe HQ
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-theme-surface p-6 shadow-sm border border-theme-border">
                <h4 className="font-serif text-lg font-bold text-theme-text mb-2">Location</h4>
                <p className="text-sm text-theme-text-muted leading-relaxed">
                  123 Artisan Street<br />
                  London, UK<br />
                  EC1A 1BB
                </p>
              </div>
              <div className="rounded-2xl bg-theme-surface p-6 shadow-sm border border-theme-border">
                <h4 className="font-serif text-lg font-bold text-theme-text mb-2">Hours</h4>
                <p className="text-sm text-theme-text-muted leading-relaxed">
                  Mon - Fri: 7:00 AM - 8:00 PM<br />
                  Sat - Sun: 8:00 AM - 9:00 PM
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Render Footer manually here since Layout suppresses it on /contact */}
      <Footer />
    </div>
  );
}
