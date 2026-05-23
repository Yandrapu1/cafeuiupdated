import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { CategoryBar, ItemGrid, CategoryGrid } from "../../components/Menu";
import AddonModal from "../../components/Addons/AddonModal";
import ProductPopup from "../../components/Menu/ProductPopup";
import { fetchCategories, fetchItemAddons, fetchItemsByCategory } from "../../services/menuApi";
import { useMenuUpdates } from "../../realtime/useMenuUpdates";
import { applyAddonChange, applyCategoryChange, applyItemChange } from "../../realtime/applyMenuChange";
import { Search } from "lucide-react";

export default function MenuPage() {
  const { cart, addToCart, removeFromCart, restaurantSettings } = useOutletContext();
  const location = useLocation();
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(location.state?.categoryId || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  
  const [addonCache, setAddonCache] = useState({});
  const [selectedItemForAddons, setSelectedItemForAddons] = useState(null);
  const [selectedItemAddons, setSelectedItemAddons] = useState([]);
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [loadingAddons, setLoadingAddons] = useState(false);
  
  // New Product Popup State
  const [popupItem, setPopupItem] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const sentinelRef = useRef(null);
  
  const selectedCategoryRef = useRef(selectedCategory);
  const itemsRef = useRef(items);
  const skipNextSelectedCategoryFetchRef = useRef(false);

  useEffect(() => { selectedCategoryRef.current = selectedCategory; }, [selectedCategory]);
  useEffect(() => { itemsRef.current = items; }, [items]);

  const loadCategories = useEffectEvent(async (preferredCategoryId = null) => {
    try {
      const data = await fetchCategories();
      const nextCategories = data || [];

      const requestedCategoryId = preferredCategoryId ?? selectedCategoryRef.current;
      const hasRequestedCategory = nextCategories.some((c) => String(c.id) === String(requestedCategoryId));
      const nextSelectedCategory = hasRequestedCategory ? requestedCategoryId : null;

      setCategories(nextCategories);
      setSelectedCategory(nextSelectedCategory);
      setLoadingCategories(false);

      if (nextSelectedCategory && nextSelectedCategory !== selectedCategoryRef.current) {
        skipNextSelectedCategoryFetchRef.current = true;
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      setLoadingCategories(false);
    }
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadItems = useEffectEvent(async (categoryId, page = 1, search = "") => {
    if (!categoryId) return;
    try {
      if (page === 1) setLoadingItems(true);
      else setIsFetchingMore(true);

      const data = await fetchItemsByCategory(categoryId, page, 12, search);
      const nextItems = page === 1 ? data.items : [...itemsRef.current, ...data.items];

      setItems(nextItems);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setLoadingItems(false);
      setIsFetchingMore(false);
    }
  });

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      if (skipNextSelectedCategoryFetchRef.current && !debouncedSearchQuery) {
        skipNextSelectedCategoryFetchRef.current = false;
        return;
      }
      void loadItems(selectedCategory, 1, debouncedSearchQuery);
    }
  }, [selectedCategory, debouncedSearchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && currentPage < totalPages) {
          void loadItems(selectedCategory, currentPage + 1, debouncedSearchQuery);
        }
      },
      { rootMargin: "200px" }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isFetchingMore, currentPage, totalPages, selectedCategory]);

  useMenuUpdates({
    onCategoryUpdate: useEffectEvent((data) => {
      const nextCategories = applyCategoryChange(categories, data);
      if (nextCategories !== categories) setCategories(nextCategories);
      if (data.type === "CATEGORY_DELETED" && String(data.category_id) === String(selectedCategory)) {
        setSelectedCategory(null);
      }
    }),
    onItemUpdate: useEffectEvent((data) => {
      const nextItems = applyItemChange(items, data, selectedCategory);
      if (nextItems !== items) setItems(nextItems);
    }),
    onAddonUpdate: useEffectEvent((data) => {
      if (data.type === "ADDON_DELETED") {
        setAddonCache((prev) => {
          const next = { ...prev };
          Object.keys(next).forEach((key) => {
            next[key] = next[key].filter((a) => String(a.id) !== String(data.addon_id));
          });
          return next;
        });
        if (selectedItemForAddons) {
          setSelectedItemAddons((prev) => prev.filter((a) => String(a.id) !== String(data.addon_id)));
        }
      } else {
        const nextAddons = applyAddonChange(selectedItemAddonsRef.current, data);
        if (nextAddons !== selectedItemAddonsRef.current) {
          setSelectedItemAddons(nextAddons);
        }
      }
    }),
  });

  const handleProductClick = (item) => {
    setPopupItem(item);
    setPopupOpen(true);
  };

  const handleOpenAddons = async (item) => {
    setSelectedItemForAddons(item);
    setAddonModalOpen(true);
    if (addonCache[item.id]) {
      setSelectedItemAddons(addonCache[item.id]);
      return;
    }
    setLoadingAddons(true);
    try {
      const fetchedAddons = await fetchItemAddons(item.id);
      setSelectedItemAddons(fetchedAddons);
      setAddonCache((prev) => ({ ...prev, [item.id]: fetchedAddons }));
    } catch (error) {
      console.error("Failed to load addons:", error);
    } finally {
      setLoadingAddons(false);
    }
  };

  const handleAddToCart = (item, addons) => {
    addToCart(item, addons);
    setPopupOpen(false);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-theme-bg">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 sm:px-6 mb-8 mt-4 gap-4">
          <h1 className="font-serif text-3xl font-bold text-theme-text">Our Menu</h1>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-text-muted" />
            <input 
              type="text" 
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!selectedCategory) {
                  setSelectedCategory("all");
                }
              }}
              className="w-full md:w-[300px] rounded-full bg-theme-surface border border-theme-border py-3 pl-11 pr-4 font-sans text-sm outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all"
            />
          </div>
        </div>

        {!selectedCategory ? (
          <CategoryGrid
            categories={categories}
            onSelect={setSelectedCategory}
            loading={loadingCategories}
          />
        ) : (
          <>
            <div className="flex items-center justify-between px-4 sm:px-6 mb-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 rounded-xl bg-theme-surface px-4 py-2 font-sans text-sm font-semibold text-theme-text transition-colors hover:bg-theme-border"
              >
                ← Back to Categories
              </button>
            </div>
            
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              loading={loadingCategories}
            />
            
            {/* Note: ItemGrid is modified to call handleProductClick on card click */}
            <ItemGrid
              items={items}
              loading={loadingItems}
              onAddToCart={addToCart}
              onProductClick={handleProductClick}
              onOpenAddons={handleOpenAddons}
              cart={cart}
              onRemoveFromCart={removeFromCart}
              sentinelRef={sentinelRef}
              isFetchingMore={isFetchingMore}
            />
          </>
        )}
      </div>

      {popupOpen && popupItem && (
        <ProductPopup 
          item={popupItem}
          onClose={() => setPopupOpen(false)}
          onAddToCart={handleAddToCart}
          onOpenAddons={handleOpenAddons}
        />
      )}

      {addonModalOpen && (
        <AddonModal
          isOpen={addonModalOpen}
          onClose={() => {
            setAddonModalOpen(false);
            setSelectedItemForAddons(null);
          }}
          item={selectedItemForAddons}
          addons={selectedItemAddons}
          loading={loadingAddons}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}
