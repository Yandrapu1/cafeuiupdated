import { useState, useEffect } from "react";
import Hero from "../../components/Home/Hero";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchCategories, fetchPopularItems } from "../../services/menuApi";
import { getImageUrl } from "../../Utils/imageUrl";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, items] = await Promise.all([
          fetchCategories(),
          fetchPopularItems(4)
        ]);
        setCategories(cats);
        setPopularItems(items);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };
    loadData();
  }, []);
  return (
    <div className="flex flex-col">
      <Hero />
      
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Categories Section */}
        <section className="mb-24">
          <div className="flex items-center gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                to="/menu"
                state={{ categoryId: cat.id }}
                className="group flex flex-col items-center gap-3 min-w-[100px]"
              >
                <div className="flex h-[80px] w-[80px] items-center justify-center rounded-2xl bg-theme-surface shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 overflow-hidden p-2">
                  {getImageUrl(cat, "category_image") ? (
                    <img 
                      src={getImageUrl(cat, "category_image")} 
                      alt={cat.category_name} 
                      className="h-full w-full object-contain mix-blend-multiply" 
                    />
                  ) : (
                    <span className="text-4xl">🍽️</span>
                  )}
                </div>
                <span className="text-sm font-semibold text-theme-text text-center">
                  {cat.category_name}
                </span>
              </Link>
            ))}
            <Link to="/menu" className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-theme-accent text-theme-inverse-text ml-4 shrink-0 transition-transform hover:scale-110 shadow-warm">
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Captivating Culinary Favorites */}
        <section className="mb-32 flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
          <div className="relative flex-1">
            <div className="relative z-10 aspect-[4/5] w-[80%] overflow-hidden rounded-3xl shadow-premium">
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1999&auto=format&fit=crop" 
                alt="Burger" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-4 z-20 aspect-square w-[55%] overflow-hidden rounded-3xl border-8 border-[#F9F6F0] shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop" 
                alt="Grill" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 mt-12 lg:mt-0">
            <h2 className="mb-4 font-serif text-4xl font-bold leading-tight text-theme-text md:text-5xl">
              Captivating Culinary <br />
              <span className="text-theme-accent">Favorites.</span>
            </h2>
            <p className="mb-8 text-theme-text-muted leading-relaxed max-w-md text-sm md:text-base">
              Experience the perfect blend of artisanal ingredients and passionate preparation. Our culinary team crafts every dish to deliver an unforgettable taste journey.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/menu" className="customer-primary-button inline-flex items-center gap-2">
                Order Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="text-sm font-bold text-theme-accent hover:text-theme-accent underline underline-offset-4 decoration-2 decoration-green-600/30 transition-colors">
                About Bagel Cafe
              </Link>
            </div>
          </div>
        </section>

        {/* Best Selling Items */}
        <section className="mb-32">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-theme-text md:text-4xl">
              Best Selling <span className="text-theme-accent">Items</span>
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-sm text-theme-text-muted">
              Discover the absolute favorites chosen by our customers every day. Fresh, delicious, and made to order.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularItems.length > 0 ? popularItems.map((item) => {
              const hasDiscount = item.discount_price && item.discount_price < item.price;
              
              return (
                <div key={item.id} className="group flex flex-col rounded-3xl bg-theme-surface p-4 shadow-sm transition-shadow hover:shadow-premium border border-theme-border relative">
                  {hasDiscount && (
                    <span className="absolute top-6 left-6 z-10 rounded-full bg-red-600 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Sale
                    </span>
                  )}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-theme-bg mb-4">
                    {getImageUrl(item, "item_image") ? (
                      <img src={getImageUrl(item, "item_image")} alt={item.item_name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-4xl">☕</div>
                    )}
                  </div>
                  <h3 className="font-sans text-sm font-bold text-theme-text mb-1">{item.item_name}</h3>
                  <div className="flex text-theme-accent text-xs mb-3">
                    ★★★★★
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      {hasDiscount ? (
                        <>
                          <span className="font-sans text-[11px] text-theme-text-muted line-through">
                            ${Number(item.price).toFixed(2)}
                          </span>
                          <span className="font-sans text-sm font-bold text-theme-accent">
                            ${Number(item.discount_price).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="font-sans text-sm font-bold text-theme-accent">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Link to="/menu" className="rounded-full bg-theme-accent px-3 py-1 font-sans text-xs font-bold text-theme-inverse-text transition-transform hover:scale-105 shadow-sm">
                      View
                    </Link>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-4 py-12 text-center text-theme-text-muted">
                Loading popular items...
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Choice of Customers */}
      <section className="bg-theme-surface/50 py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { title: "Warm & Enjoy", desc: "Always served at the perfect temperature.", icon: "🍲" },
                { title: "Savour & Replay", desc: "Flavors that bring you back for more.", icon: "🍽️" },
                { title: "Delivery Services", desc: "Fast and reliable to your doorstep.", icon: "🛵" },
                { title: "Organic Food", desc: "Sourced from the best local farms.", icon: "🥗" },
              ].map((feature, i) => (
                <div key={i} className="rounded-2xl bg-theme-surface p-6 shadow-sm border border-theme-border transition-transform hover:-translate-y-1">
                  <div className="mb-4 text-3xl">{feature.icon}</div>
                  <h4 className="mb-2 font-sans text-sm font-bold text-theme-text">{feature.title}</h4>
                  <p className="text-xs leading-relaxed text-theme-text-muted">{feature.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="flex-1 lg:pl-12">
              <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-theme-text md:text-4xl">
                The Choice of <br />
                <span className="text-theme-accent">Customers</span>
              </h2>
              <p className="mb-8 text-theme-text-muted leading-relaxed text-sm md:text-base">
                We take pride in providing an exceptional dining experience. From our carefully selected organic ingredients to our rapid delivery service, every aspect is designed with your satisfaction in mind.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-3 text-sm font-bold text-theme-inverse-text shadow-warm transition-transform hover:-translate-y-0.5">
                View More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
