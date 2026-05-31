# D I N — Premium E-commerce Platform

DIN is an absolute-luxury, online shopping platform featuring a highly-aesthetic, minimal React frontend (Vite) and a robust, secure Node.js + Express backend. 

---

## 💎 Features Checklist
*   **Aesthetic Visual Design**: Premium typography (Inter & Outfit), fluid glassmorphism layers, default luxurious dark mode, high-ratio thumbnails, and smooth transform hover zooms.
*   **Secured Authentication**: Robust JWT session validation, secure bcrypt password hashing, and role-based route protection.
*   **Stripe Integration**: Dynamic payment session processing with out-of-the-box local mock checkouts if credentials are absent.
*   **Admin Command Center**: Visual sales trends graph, item stock alerts, product/coupon CRUD overlays, and live order shift status toggles.
*   **Refined Client Capabilities**: AI-powered dynamic product recommendations, recently viewed history matching, multi-criteria shop catalog filtering, and multi-language/multi-currency switchers.

---

## 📂 Project Architecture

```
DIN_WORKSPACE/
├── backend/
│   ├── config/db.js          # MongoDB Mongoose connection
│   ├── controllers/          # Business logic handlers (Auth, Admin, Orders...)
│   ├── middleware/           # Auth validation and Admin guards
│   ├── models/               # Mongoose database schemas (User, Product, Order...)
│   ├── routes/               # API endpoint configurations
│   ├── utils/memoryStore.js  # Dynamic in-memory mock fallback data seed
│   ├── .env.example          # Sample environment key templates
│   ├── .env                  # Active development environment key values
│   ├── package.json          # Node backend dependencies
│   └── server.js             # Entry express server configuration
├── frontend/
│   ├── public/               # Asset folders
│   ├── src/
│   │   ├── components/       # Shared UI (Navbar, Footers, ProductCards...)
│   │   ├── context/          # State managers (Cart, Auth, Theme contexts)
│   │   ├── pages/            # View components (Home, Catalog, Dashboards...)
│   │   ├── App.jsx           # Main router orchestrator
│   │   ├── index.css         # Luxury-grade CSS system tokens
│   │   └── main.jsx          # React app DOM injection point
│   ├── index.html            # Core document scaffold (Google font pre-loaders)
│   ├── package.json          # Vite React UI dependencies
│   └── vite.config.js        # Vite configs with backend proxy setup
└── README.md                 # Project Manual & Operations Documentation
```

---

## ⚡ Getting Started Locally

### 1. Prerequisite Installations
*   Ensure **Node.js** (v18.0.0 or higher) is installed on your local OS machine.

### 2. Startup the Secure Backend Server
Open a terminal in the `backend/` directory:
```bash
cd backend
npm install
npm run start
```
> [!NOTE]
> **Graceful Database Fallback**: If a local MongoDB daemon is not running, the backend server will print a warning and *automatically activate* an In-Memory local JSON database fallback. **You do not need MongoDB installed to test or run the application immediately.**

### 3. Startup the Vite React Client
Open a secondary terminal in the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔒 Local Developer Testing Profiles
To test role-based actions on the active application, sign in with these pre-seeded local credentials:
*   **Administrator Access**:
    *   Email: `admin@din.com`
    *   Password: `admin123`
*   **Standard Customer Access**:
    *   Email: `customer@din.com`
    *   Password: `customer123`

---

## 📦 Database Schemas Blueprint

### 1. User Schema (`User.js`)
*   `name` (String, required): Customer display profile name.
*   `email` (String, required, unique): Account identification credential.
*   `password` (String, required, select: false): Hashed representation.
*   `role` (String, enum: ['customer', 'admin']): Privilege access key.
*   `wishlist` (Array of Product ObjectIds): Favorited catalog reference points.
*   `recentlyViewed` (Array of Product ObjectIds): Limit 5 visited design entities.

### 2. Product Schema (`Product.js`)
*   `title` (String, required, trim): Curated design release name.
*   `description` (String, required): Detailed specs specification text.
*   `price` (Number, required): Numeric price value.
*   `category` (String, required): Selection tag.
*   `brand` (String, required): Manufacturer design label.
*   `images` (Array of Strings): Cloudinary URLs or Unsplash high-res backups.
*   `stock` (Number, required): Inventory counts.
*   `ratings` (Number, default 0): Average rating calculations.
*   `reviews` (Array of embedded Review subdocuments): Embedded rating/comment feedback cards.

### 3. Order Schema (`Order.js`)
*   `user` (ObjectId, ref: 'User'): Client catalog index reference.
*   `items` (Array of OrderItems): Captured pricing and quantities.
*   `total` (Number, required): Payment invoice value.
*   `paymentStatus` (String, enum: ['pending', 'paid', 'failed']): Checkout stage status.
*   `stripeSessionId` (String): Secure transaction tracking key.
*   `shippingAddress` (Object): Delivery coordinates.
*   `status` (String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered']): Transit stage timeline tag.

---

## 📡 API Reference Endpoint Documentation

All backend requests should contain `Content-Type: application/json` headers. Private endpoints require authorization via `Authorization: Bearer <JWT_TOKEN>`.

### Authentication Routes (`/api/auth`)
*   `POST /api/auth/register` : Create user account. Returns profile info and JWT token.
*   `POST /api/auth/login` : Login user. Returns profile info and JWT token.
*   `GET /api/auth/profile` : [PRIVATE] Get hydrated details for active user profile (wishlist, recently viewed).
*   `POST /api/auth/wishlist/:productId` : [PRIVATE] Toggle catalog item bookmark. Returns updated wishlist array.

### Catalog Routes (`/api/products`)
*   `GET /api/products` : Query products catalog. Supports query filters: `?category=`, `?brand=`, `?search=`, `?minPrice=`, `?maxPrice=`, `?rating=`.
*   `GET /api/products/:id` : Fetch detailed specifications. Optional query parameter `?userId=` automatically updates user recently-viewed logs.
*   `POST /api/products/:id/reviews` : [PRIVATE] Submit comment feedback. Re-calculates ratings average.
*   `GET /api/products/recommendations/ai` : Dynamic category-matcher recommendations list. Optional query `?userId=` matches wishlist category behaviors.

### Checkout & Voucher Routes (`/api/orders`, `/api/coupons`)
*   `POST /api/orders/checkout` : [PRIVATE] Initialize Stripe/Mock checkout sessions. Calculates line-item totals and handles stock decrements.
*   `GET /api/orders/my-orders` : [PRIVATE] Return logged-in user order invoices list.
*   `GET /api/orders/:id` : [PRIVATE] Track package progress stages and dispatch addresses.
*   `POST /api/coupons/validate` : [PRIVATE] Verify active promotional codes (e.g. `DINWELCOME10` for 10% off).

### Administrator Control Routes (`/api/admin`)
*   `GET /api/admin/stats` : [PRIVATE/ADMIN] Fetch high-level statistics cards, category maps, and weekly sales metrics.
*   `GET /api/admin/orders` : [PRIVATE/ADMIN] Review all order invoices processed on application.
*   `PUT /api/admin/orders/:id/status` : [PRIVATE/ADMIN] Update delivery status from `Pending` -> `Processing` -> `Shipped` -> `Delivered`.
*   `GET /api/admin/users` : [PRIVATE/ADMIN] List all safe registered client profiles.
*   `POST /api/admin/products` : [PRIVATE/ADMIN] Create new catalog product specs.
*   `PUT /api/admin/products/:id` : [PRIVATE/ADMIN] Update details on an existing item.
*   `DELETE /api/admin/products/:id` : [PRIVATE/ADMIN] Drop product from the exhibition catalog.

---

## 🚀 Deployment Instructions

### 1. MongoDB Database Setup
1.  Navigate to **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** and provision a free shared cluster.
2.  Navigate to Network Access and allow connections from `0.0.0.0/0` (anywhere).
3.  Generate a database user and copy the connection string (looks like `mongodb+srv://<user>:<password>@cluster0.abc.mongodb.net/din_db`).

### 2. Express Backend Deployment (Render / Heroku)
1.  Connect your Git Repository to the web deployment platform (e.g. Render).
2.  Configure a new **Web Service** pointing to the `backend/` directory.
3.  Set the start command to `npm install && npm start`.
4.  Configure these environment variables in the dashboard:
    *   `NODE_ENV` = `production`
    *   `JWT_SECRET` = `your_strong_private_jwt_secret_phrase`
    *   `MONGO_URI` = `your_copied_mongodb_atlas_connection_string`
    *   `STRIPE_SECRET_KEY` = `your_live_stripe_secret_key` (optional)
5.  Copy your deployed Web Service URL (e.g. `https://din-backend.onrender.com`).

### 3. Vite React Frontend Deployment (Vercel / Netlify)
1.  Connect your Git Repository to your host service (e.g. Vercel).
2.  Configure a new **Project** pointing to the `frontend/` directory.
3.  Vercel will automatically auto-detect **Vite** configuration details.
4.  Configure the build directories:
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
5.  Configure proxy redirects or adjust the fetch base URL inside `frontend/src/context/AuthContext.jsx`, `CartContext.jsx`, and pages to point directly to your deployed backend URL. (e.g., replacing relative `/api` paths with `https://din-backend.onrender.com/api` for production builds).
