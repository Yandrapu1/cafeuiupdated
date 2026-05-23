# Backend Modifications Log

This document tracks all new APIs and structural changes added to the Customer Backend for the UI redesign.

## Added Endpoints

### 1. Restaurant Settings
- **Route:** `GET /api/restaurant/settings`
- **Location:** `restaurant/restaurantRoutes.js`, `restaurant/restaurantController.js`
- **Purpose:** Fetches the cafe's working hours, schedules, and manual overrides from the `restaurant_settings` table so the frontend can prevent ordering when closed.

### 2. Gallery API
- **Route:** `GET /api/gallery`
- **Location:** `gallery/galleryRoutes.js`, `gallery/galleryController.js`
- **Purpose:** Returns a list of image objects for the new Gallery page. Currently returns static high-quality images. You can later update `galleryController.js` to fetch from a database table if you build a gallery manager in the Admin panel.

### 3. Popular Items API
- **Route:** `GET /api/popular`
- **Location:** `menu/menuRoutes.js`, `menu/menuController.js`
- **Purpose:** Fetches the top best-selling / popular items to dynamically render on the Home page.
