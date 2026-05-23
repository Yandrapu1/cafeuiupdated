# Frontend Modifications Log

This document tracks all major UI, UX, and architectural changes made to the frontend application during the comprehensive refactor phase.

## 1. Routing & Architecture
- **Global Layout (`Layout.jsx`)**: Extracted all persistent global state (Cart, Customer Profile, Drawer visibility) out of the Home page to ensure data survives across page loads.
- **Dedicated Pages**: Moved from a single-page scrolling layout to dedicated routes for Menu, About, Gallery, and Contact.
- **New Flow Pages**: Created dedicated pages for Authentication (`/login`, `/register`, `/forgot-password`), Customer Profile (`/profile`), and Checkout (`/checkout`), moving these out of cluttered side-drawers.

## 2. Theming & Consistency
- **Light Theme Conversion**: Overhauled the dark theme (`#110e0d`) to a premium light cream theme (`#F9F6F0`) globally. Adjusted all text, shadows, and hover effects accordingly.
- **Navbar Fixes**: The navbar is now transparent over the Hero banner with white text, and transitions to a solid light background with dark text upon scrolling.

## 3. Dynamic API Integration
- **Dynamic Categories & Popular Items**: The Home page now fetches real category data and popular items from the backend instead of using static mockups.
- **Menu Features**: Added search, category filtering, and skeleton loaders to `MenuPage.jsx`.
- **Gallery Lightbox**: Refactored the Gallery page to include a `framer-motion` driven lightbox modal for viewing images.

## 4. Checkout & Cart Polish
- **Dedicated Checkout**: Moved the complex Delivery/Pickup, time slot, and payment logic to a full-screen `/checkout` page.
- **Cart Interactions**: Polished quantity adjustments, item removal, and subtotal calculations inside the Cart drawer.
