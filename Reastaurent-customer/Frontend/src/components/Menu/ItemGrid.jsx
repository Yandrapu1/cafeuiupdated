import { useState } from "react";
import { getImageUrl } from "../../Utils/imageUrl";

function ItemCard({ item, onProductClick }) {
  const [hovered, setHovered] = useState(false);
  const hasDiscount = item.discount_price && item.discount_price < item.price;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (item.is_available) onProductClick(item);
      }}
      className={`customer-card flex flex-col overflow-hidden p-0 transition-all duration-500 cursor-pointer border border-theme-border bg-theme-surface ${
        hovered ? "-translate-y-2 shadow-premium border-theme-border" : "translate-y-0"
      }`}
    >
      <div className="relative overflow-hidden bg-theme-bg">
        {getImageUrl(item, "item_image") ? (
          <img
            src={getImageUrl(item, "item_image")}
            alt={item.item_name || item.name}
            loading="lazy"
            decoding="async"
            className={`h-[220px] w-full object-cover transition-transform duration-700 ${
              hovered ? "scale-110" : "scale-100"
            }`}
          />
        ) : (
          <div className="grid h-[220px] w-full place-items-center bg-theme-surface text-5xl">
            ☕
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {item.is_new === 1 ? (
            <span className="rounded-full bg-theme-surface px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-theme-text shadow-lg">
              New
            </span>
          ) : null}
          {item.is_popular === 1 ? (
            <span className="rounded-full bg-theme-accent px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-theme-inverse-text shadow-lg">
              Popular
            </span>
          ) : null}
          {hasDiscount ? (
            <span className="rounded-full bg-red-600 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              {Math.round(((item.price - item.discount_price) / item.price) * 100)}% OFF
            </span>
          ) : null}
        </div>

        <div className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full border border-theme-border bg-theme-surface backdrop-blur-md">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              item.is_veg === 1 ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
        
        {!item.is_available && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-theme-surface backdrop-blur-sm">
             <span className="rounded-full bg-red-500 px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                Out of Stock
             </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="m-0 font-serif text-xl font-bold leading-tight text-theme-text">
          {item.item_name || item.name}
        </h3>

        {item.item_description || item.description ? (
          <p className="m-0 overflow-hidden font-sans text-sm font-light leading-relaxed text-theme-text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {item.item_description || item.description}
          </p>
        ) : null}

        {item.preparation_time ? (
          <div className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider text-theme-text-muted">
            <span>⏱️</span>
            <span>{item.preparation_time} min prep</span>
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="font-sans text-[13px] text-theme-text-muted line-through">
                  ${Number(item.price).toFixed(2)}
                </span>
                <span className="font-serif text-xl font-bold text-theme-accent">
                  ${Number(item.discount_price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-serif text-xl font-bold text-theme-accent">
                ${Number(item.price).toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="rounded-full bg-theme-accent px-4 py-1.5 font-sans text-xs font-bold text-theme-inverse-text transition-transform group-hover:scale-105">
            View
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemGrid({
  items,
  loading,
  onProductClick,
  sentinelRef,
  isFetchingMore,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5 px-4 py-5 sm:px-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-[20px] bg-theme-surface"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-[60px]">
        <div className="text-5xl">🍽️</div>
        <p className="m-0 text-base text-theme-text-muted">
          No items available in this category
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5 px-4 pb-24 pt-5 sm:px-6">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onProductClick={onProductClick}
        />
      ))}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="col-span-full h-10" />

      {isFetchingMore ? (
        <div className="col-span-full flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-theme-accent border-t-transparent" />
        </div>
      ) : null}
    </div>
  );
}

export default ItemGrid;
