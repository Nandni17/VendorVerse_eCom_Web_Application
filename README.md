# 🛍️ VendorVerse

**VendorVerse** is a full-stack multi-vendor e-commerce platform built using the **MERN stack**. It allows customers to browse and purchase products, sellers to manage their own products and orders, and administrators to manage the overall platform.

The application includes authentication, email verification, role-based authorization, product management, buyer-seller chat, cart and wishlist functionality, Stripe and Cash on Delivery payments, order tracking, profile management, image uploading with Cloudinary, reviews and ratings, seller management, admin management, and customer contact messages.

---

## 🚀 Features

### 👤 Customer Features

* User registration and login
* Email verification using OTP
* Email verification emails using **Brevo**
* Role-based authentication
* Browse all products
* View product details
* Search and shop products by category
* Add products to cart
* Increase/decrease product quantity
* Stock-limit validation
* Remove products from cart
* Wishlist functionality
* Checkout system
* Stripe payment integration
* Cash on Delivery (COD) payment
* Payment success and cancellation pages
* Automatic order creation after successful Stripe payment
* Order history
* Order details
* Order status tracking
* Cancel eligible pending orders
* Buyer ↔ Seller chat
* Customer profile management
* Update profile information
* Profile image uploading
* Cloudinary-based profile image storage
* Product reviews and ratings
* Verified Purchase reviews
* Edit own reviews
* Delete own reviews
* Contact Us form
* FAQ section
* Events section
* Responsive user interface

---

### 🏪 Seller Features

Sellers have their own dashboard and can manage their products, orders, profile, and customer conversations.

* Seller dashboard
* Add products
* View own products
* Edit products
* Delete products
* Inventory management
* Low-stock monitoring
* View seller orders
* View sales information
* Update order status
* Pending → Shipped → Delivered workflow
* Seller-specific product authorization
* Seller-specific order authorization
* Buyer ↔ Seller chat
* Communicate with customers through chat
* Seller profile management
* Update seller profile
* Profile image uploading
* Cloudinary image storage

A seller can only manage products and orders that belong to them.

---

### 👑 Admin Features

The administrator has access to platform-wide management.

* Admin dashboard
* View total customers
* View total sellers
* View total products
* View total orders
* View sales/payment overview
* Manage customers
* Manage sellers
* Manage products
* View all orders
* View contact messages
* Delete customers
* Delete sellers
* Delete inappropriate products
* Role-based admin authorization

The admin account is not publicly registered. It is created and managed directly in the database.

---

## 🔐 Authentication & Email Verification

VendorVerse uses **JWT authentication** and role-based authorization.

New users must verify their email during registration.

### Email Verification Flow

```text
User Registration
       ↓
Verification OTP Generated
       ↓
Brevo Email Service
       ↓
OTP Sent to User Email
       ↓
User Enters OTP
       ↓
Email Verified
       ↓
Account Activated
       ↓
Login
```

This helps prevent unverified users from accessing the application.

---

## 💬 Buyer ↔ Seller Chat

VendorVerse provides a buyer-seller communication system that allows customers to contact sellers directly.

A buyer can start a conversation from the product details page.

### Chat Flow

```text
Buyer
   ↓
Product Details
   ↓
Chat with Seller
   ↓
Conversation Created
   ↓
Buyer ↔ Seller Messages
```

The conversation is associated with the relevant product and seller, allowing buyers and sellers to communicate about products and orders.

---

## 👤 Profile Management

VendorVerse provides profile management for users.

Users can:

* View their profile
* Update profile information
* Upload a profile image
* Replace their existing profile image
* Store profile images securely using Cloudinary

### Profile Image Upload Flow

```text
User
  ↓
Select Image
  ↓
Multer
  ↓
Cloudinary
  ↓
Image URL
  ↓
MongoDB User Profile
```

**Multer** is used to handle image uploads on the backend, while **Cloudinary** is used for cloud-based image storage.

---

## ⭐ Reviews & Ratings

VendorVerse includes a complete product reviews and ratings system.

Customers can review a product **only after purchasing and receiving the product**.

### Review Features

* Submit product reviews
* Give 1–5 star ratings
* Verified Purchase badge
* Display average product rating
* Display total review count
* Edit own reviews
* Delete own reviews
* Review ownership validation
* Prevent unauthorized users from editing reviews
* Prevent unauthorized users from deleting reviews
* Prevent users from reviewing products they have not purchased and received

### Review Flow

```text
Customer
   ↓
Purchase Product
   ↓
Order Delivered
   ↓
Review Product
   ↓
Verified Purchase ✓
   ↓
Rating + Comment
   ↓
Product Rating Updated
```

Reviews are linked to the authenticated customer and product. Users can only edit or delete their own reviews.

---

## 💳 Payment System

VendorVerse supports both **Stripe online payments** and **Cash on Delivery (COD)**.

### Stripe Payment Flow

```text
Customer
   ↓
Checkout
   ↓
Stripe Checkout
   ↓
Payment
   ├───────────────┐
   ↓               ↓
Success          Cancel
   ↓               ↓
Webhook          Checkout
   ↓
Order Created
   ↓
Stock Reduced
   ↓
My Orders
```

Stripe webhooks are used to verify successful payments and securely create orders on the backend.

### Cash on Delivery Flow

```text
Customer
   ↓
Checkout
   ↓
Select COD
   ↓
Place Order
   ↓
Order Created
   ↓
Seller Processes Order
   ↓
Shipped
   ↓
Delivered
   ↓
Customer Receives Product
```

COD orders are managed through the same order tracking system and seller order workflow.

---

## 📦 Order System

VendorVerse supports a multi-vendor order structure.

If a customer purchases products from multiple sellers, the backend groups the products according to their seller and creates separate seller-specific orders.

Example:

```text
Customer buys:

Laptop → Seller A
Shoes   → Seller B
Perfume → Seller A

                ↓

Seller A Order
├── Laptop
└── Perfume

Seller B Order
└── Shoes
```

This allows each seller to manage only their own orders.

Both **Stripe-paid orders and COD orders** are supported.

---

## 🔐 Authentication & Authorization

VendorVerse uses **JWT authentication** and role-based authorization.

There are three roles:

```text
Buyer
Seller
Admin
```

### Buyer

Can:

* Register and verify email
* Shop products
* Manage cart
* Manage wishlist
* Checkout using Stripe or COD
* View own orders
* Cancel eligible orders
* Chat with sellers
* Manage profile
* Upload profile image
* Submit product reviews
* Edit own reviews
* Delete own reviews

### Seller

Can:

* Manage own products
* Add products
* Edit products
* Delete products
* View own orders
* Update own order statuses
* View seller dashboard
* Chat with buyers
* Manage profile
* Upload profile image

### Admin

Can:

* Manage customers
* Manage sellers
* Manage products
* View all orders
* View payment information
* Manage contact messages

Protected routes prevent unauthorized users from accessing restricted pages.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer

### Authentication & Email

* JWT Authentication
* Brevo Email Service
* Email OTP Verification

### Payment

* Stripe
* Stripe Webhooks
* Cash on Delivery (COD)

### Image Storage

* Cloudinary
* Multer

### Database

* MongoDB Atlas

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## 📁 Project Structure

```text
VendorVerse/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── api/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd VendorVerse
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

EMAIL_HOST=your_email_host

EMAIL_PORT=your_email_port

EMAIL_USER=your_email_user

EMAIL_PASS=your_email_password

BREVO_API_KEY=your_brevo_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create the frontend environment file:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🗄️ Database

VendorVerse uses **MongoDB Atlas** as its cloud database.

Main collections include:

```text
Users
Products
Orders
Reviews
Conversations
Messages
Hero Banners
Contact Messages
```

MongoDB Atlas stores customer, seller, profile, product, order, review, chat, and contact information.

---

## 🔑 User Roles

| Role   | Access |
| ------ | ------ |
| Buyer  | Shopping, Cart, Wishlist, Checkout, Orders, Chat, Reviews, Profile |
| Seller | Products, Inventory, Seller Orders, Sales, Chat, Profile |
| Admin  | Platform-wide management |

---

## 🧪 Testing

The application was tested using:

* Browser testing
* Postman API testing
* MongoDB Atlas verification
* Stripe test payments
* Cash on Delivery testing
* Authentication and protected-route testing
* Email OTP verification testing
* Buyer workflow testing
* Seller CRUD testing
* Buyer ↔ Seller chat testing
* Profile management testing
* Profile image upload testing
* Cloudinary image storage testing
* Product reviews and ratings testing
* Verified Purchase validation
* Review ownership validation
* Seller authorization testing
* Admin management testing

### Customer Flow

```text
Register
   ↓
Email OTP Verification
   ↓
Login
   ↓
Shop
   ↓
Product Details
   ↓
Wishlist / Cart
   ↓
Checkout
   ├── Stripe
   │     ↓
   │   Payment
   │     ↓
   │   Order Created
   │
   └── COD
         ↓
      Order Created

   ↓
My Orders
   ↓
Order Delivered
   ↓
Review & Rating
   ↓
Verified Purchase ✓
```

### Seller Flow

```text
Seller Login
     ↓
Seller Dashboard
     ↓
My Products
     ↓
Add / Edit / Delete
     ↓
Inventory
     ↓
Seller Orders
     ↓
Update Status
     ↓
Chat with Buyers
     ↓
Manage Profile
```

### Admin Flow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Users
Sellers
Products
Orders
Payments
Contact Messages
```

---

## 🔒 Security

The application includes:

* JWT-based authentication
* Password hashing using bcrypt
* Email OTP verification
* Role-based authorization
* Protected frontend routes
* Protected backend APIs
* Seller ownership validation
* Buyer order ownership validation
* Review ownership validation
* Verified Purchase validation
* Stock validation before ordering
* Stripe webhook verification
* Secure image storage using Cloudinary
* Environment variables for sensitive credentials

> Never commit `.env` files or secret API keys to GitHub.

---

## 🌐 Deployment

The production deployment architecture is planned as:

```text
                    ┌──────────────┐
                    │   Vercel     │
                    │   Frontend   │
                    └──────┬───────┘
                           │
                           ↓
                    ┌──────────────┐
                    │   Vercel     │
                    │   Backend    │
                    └──────┬───────┘
                           │
             ┌─────────────┴─────────────┐
             ↓                           ↓
      MongoDB Atlas                  Stripe
       Cloud Database                Payments
             │
             ↓
         Cloudinary
       Image Storage
```

Production environment variables should be configured through the hosting platforms rather than committed to the repository.

---

## 🎯 Future Improvements

Possible future improvements include:

* Advanced product search
* Seller analytics
* Email order notifications
* Order delivery notifications
* Advanced admin analytics
* Coupon and discount system
* Product recommendation system
* Advanced real-time chat notifications

---

## 👩‍💻 Author

**Nandni Kumari**

Software Engineering Student  
Full-Stack Web Development Project

---

## ⭐ Project

**VendorVerse — Multi-Vendor E-Commerce Platform**

Built with ❤️ using the MERN stack.
