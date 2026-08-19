# 🛍️ VendorVerse

**VendorVerse** is a full-stack multi-vendor e-commerce platform built using the **MERN stack**. It allows customers to browse and purchase products, sellers to manage their own products and orders, and administrators to manage the overall platform.

The application includes authentication, role-based authorization, product management, cart and wishlist functionality, Stripe payments, order tracking, seller management, admin management, and customer contact messages.

---

## 🚀 Features

### 👤 Customer Features

* User registration and login
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
* Payment success and cancellation pages
* Automatic order creation after successful payment
* Order history
* Order details
* Order status tracking
* Cancel pending orders
* Contact Us form
* FAQ section
* Events section
* Responsive user interface

---

### 🏪 Seller Features

Sellers have their own dashboard and can manage their products and orders.

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

## 💳 Payment System

VendorVerse uses **Stripe** for online payments.

Payment flow:

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

Stripe webhooks are used to verify successful payments and create orders securely on the backend.

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

* Shop products
* Manage cart
* Manage wishlist
* Checkout
* View own orders
* Cancel eligible orders

### Seller

Can:

* Manage own products
* View own orders
* Update own order statuses
* View seller dashboard

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

### Payment

* Stripe
* Stripe Webhooks

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
Hero Banners
Contact Messages
```

MongoDB Atlas stores customer, seller, product, order, and contact information.

---

## 🔑 User Roles

| Role   | Access                                     |
| ------ | ------------------------------------------ |
| Buyer  | Shopping, Cart, Wishlist, Checkout, Orders |
| Seller | Products, Inventory, Seller Orders, Sales  |
| Admin  | Platform-wide management                   |

---

## 🧪 Testing

The application was tested using:

* Browser testing
* Postman API testing
* MongoDB Atlas verification
* Stripe test payments
* Authentication and protected-route testing
* Buyer workflow testing
* Seller CRUD testing
* Admin management testing

### Customer Flow

```text
Register
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
   ↓
Stripe
   ├── Success
   │     ↓
   │   Order Created
   │     ↓
   │   My Orders
   │     ↓
   │   Order Details
   │
   └── Cancel
         ↓
      Checkout
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
* Role-based authorization
* Protected frontend routes
* Protected backend APIs
* Seller ownership validation
* Buyer order ownership validation
* Stock validation before ordering
* Stripe webhook verification
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
                    │    Railway   │
                    │   Backend    │
                    └──────┬───────┘
                           │
             ┌─────────────┴─────────────┐
             ↓                           ↓
      MongoDB Atlas                  Stripe
       Cloud Database                Payments
```

Production environment variables should be configured through the hosting platforms rather than committed to the repository.

---

## 🎯 Future Improvements

Possible future improvements include:

* Product reviews and ratings
* Advanced product search
* Seller analytics
* Email notifications
* Order delivery notifications
* Product image upload storage
* Advanced admin analytics
* Coupon and discount system

---

## 👩‍💻 Author

**Nandni Kumari**

Software Engineering Student
Full-Stack Web Development Project

---

## ⭐ Project

**VendorVerse — Multi-Vendor E-Commerce Platform**

Built with ❤️ using the MERN stack.
