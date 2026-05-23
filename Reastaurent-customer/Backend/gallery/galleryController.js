const getGalleryImages = async (req, res) => {
  try {
    // For now, this returns a static array of high-quality cafe images.
    // In the future, you can replace this with a database query:
    // const result = await db.query('SELECT * FROM gallery_images ORDER BY created_at DESC');
    
    const staticImages = [
      { id: 1, url: "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=2070&auto=format&fit=crop", title: "Cafe Interior" },
      { id: 2, url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop", title: "Fresh Coffee" },
      { id: 3, url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop", title: "Barista Setup" },
      { id: 4, url: "https://images.unsplash.com/photo-1445116572660-236099ce4059?q=80&w=2071&auto=format&fit=crop", title: "Cozy Corner" },
      { id: 5, url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop", title: "Morning Bagel" },
      { id: 6, url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop", title: "Cafe Outside" },
      { id: 7, url: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2070&auto=format&fit=crop", title: "Coffee Art" },
      { id: 8, url: "https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=2070&auto=format&fit=crop", title: "Cafe Vibe" },
    ];

    return res.status(200).json({
      success: true,
      data: staticImages,
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery images",
      error: error.message,
    });
  }
};

module.exports = {
  getGalleryImages,
};
