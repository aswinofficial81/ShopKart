# 🛒 ShopKart

[![Live Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=flat&logo=vercel)](https://shop-kart-neon.vercel.app)
[![Live Backend](https://img.shields.io/badge/Backend-Render-informational?style=flat&logo=render)](https://shopkart-y54q.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ShopKart is a full-stack **MERN** (MongoDB, Express, React, Node.js) e-commerce application built through a series of engineering labs. The project covers customer authentication, product catalog, wishlist, shopping cart, checkout, Razorpay payments, order management, API integration, and cloud deployment.

---

## 🔗 Live Demo

- **Frontend:** [https://shop-kart-neon.vercel.app](https://shop-kart-neon.vercel.app)
- **Backend:** [https://shopkart-y54q.onrender.com](https://shopkart-y54q.onrender.com)

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React
- React Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- CORS
- Razorpay

### Deployment
- GitHub
- Vercel
- Render
- MongoDB Atlas
- Razorpay Test Mode

---

## ✨ Features

### Authentication
- Customer registration
- Customer login
- JWT-based authentication
- HttpOnly cookie authentication
- Protected APIs
- Logout

### Product Catalog
- Create products
- View all products
- View product by ID
- Search products
- Filter products by category
- Combined search and category filtering

### Wishlist
- Add products to wishlist
- View wishlist
- Remove products from wishlist
- MongoDB ObjectId references
- Mongoose `populate()`
- Protected wishlist APIs

### Shopping Cart
- Add products to cart
- Increase quantity for existing products
- Update product quantity
- Remove products from cart
- Stock validation
- Persistent cart storage in MongoDB
- Global cart state using React Context API
- Dynamic cart count
- Dynamic subtotal

### Checkout and Orders
- Shipping address form
- Client-side validation
- Server-side stock validation
- Server-side total calculation
- Order snapshots
- Razorpay Test Mode payment
- Razorpay payment signature verification
- Cart clearing after successful payment
- Order success page
- Order history
- Order details
- Order ownership protection

---

## 🔄 Application Flow

```text
Register / Login
       ↓
 Product Catalog
       ↓
 Wishlist / Cart
       ↓
    Checkout
       ↓
Stock + Price Validation
       ↓
  Create Order
       ↓
 Razorpay Payment
       ↓
Payment Verification
       ↓
 Order Confirmed
       ↓
  Cart Cleared
       ↓
  Order History
```

---

## 📁 Project Structure

```text
ShopKart/
├── client/
│   ├── src/
│   │   ├── Pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── Services/
│   │   └── App.jsx
│   ├── package.json
│   └── vercel.json
│
└── server/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── utils/
    ├── index.js
    └── package.json
```

---

## 🌐 API Endpoints

### Customer APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/customers/register` | Register new customer |
| `POST` | `/customers/login` | Login customer |
| `GET` | `/customers/me` | Get current customer profile |
| `POST` | `/customers/logout` | Logout customer |

### Product APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/products` | Create a product |
| `GET` | `/products` | Fetch all products |
| `GET` | `/products/:id` | Fetch product by ID |

**Example queries:**
- `GET /products?search=keyboard`
- `GET /products?category=Electronics`
- `GET /products?search=keyboard&category=Electronics`

### Wishlist APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/wishlist/:productId` | Add product to wishlist |
| `GET` | `/wishlist` | Get wishlist |
| `DELETE` | `/wishlist/:productId` | Remove product from wishlist |

### Cart APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/cart/:productId` | Add product to cart |
| `GET` | `/cart` | Get cart items |
| `PATCH` | `/cart/:productId` | Update item quantity |
| `DELETE` | `/cart/:productId` | Remove product from cart |

### Order APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/orders/create-payment-order` | Create Razorpay order |
| `POST` | `/orders/verify-payment` | Verify payment and confirm order |
| `GET` | `/orders` | Get order history |
| `GET` | `/orders/:id` | Get order details |

---

## 🗄️ Database Models

### Customer
The Customer model stores customer information along with wishlist and cart data.

**The cart contains:**
- Product ObjectId
- Quantity

**The wishlist contains:**
- Product ObjectId

### Product
The Product model contains:
- `name`
- `description`
- `price`
- `category`
- `image`
- `stock`

### Order
The Order model stores:
- Customer reference
- Order items:
  - Product reference
  - Product name
  - Product price
  - Quantity
  - Product image
- Shipping address
- Total amount
- Payment status
- Order status
- Razorpay order ID
- Razorpay payment ID

> **Note:** Orders store product information as a snapshot so that historical orders remain accurate even if the product details change later.

---

## 🔑 Environment Variables

### Backend
Create a `server/.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
```

### Frontend
Create a `client/.env` file:

```env
VITE_API_URL=http://localhost:5000
```

> ⚠️ Never commit `.env` files or secret credentials to GitHub.

---

## 🚀 Running Locally

### Backend Setup
```bash
cd server
npm install
npm start
```
Backend runs on: `http://localhost:5000`

### Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🛡️ Payment Security

ShopKart uses Razorpay Test Mode.

**The backend:**
- Calculates the final order amount
- Validates product stock
- Creates the Razorpay order
- Keeps the Razorpay secret key on the backend
- Verifies the Razorpay payment signature
- Marks the order as paid only after successful verification
- Clears the cart only after successful payment verification

The frontend never controls the final payment amount or payment status.

---

## 🔒 Authentication and Security

- Authentication uses JWT stored in an `HttpOnly` cookie.
- Protected APIs use the authenticated customer from the JWT instead of accepting a customer ID from the frontend.
- The application uses CORS with credentials so authenticated requests can be made between the deployed frontend and backend.

---

## ⚛️ Global Cart State

The shopping cart uses React Context API to provide a shared cart state across the application.

**The shared state includes:**
- `cartItems`
- `loading`
- `error`
- `totalCount`
- `subtotal`
- `addToCart`
- `updateQuantity`
- `removeFromCart`
- `refreshCart`

This allows the Product Card, Navbar, Cart page, and Checkout page to work seamlessly with the same cart state.

---

## ☁️ Deployment

The frontend is deployed on Vercel and the backend is deployed on Render.

```text
                         User
                           │
                           ▼
                  ┌─────────────────┐
                  │     Vercel      │
                  │ React + Vite    │
                  └────────┬────────┘
                           │
                      HTTPS API
                           │
                           ▼
                  ┌─────────────────┐
                  │     Render      │
                  │ Node + Express  │
                  └────────┬────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      ┌─────────────────┐       ┌─────────────────┐
      │ MongoDB Atlas   │       │    Razorpay     │
      │    Database     │       │   Test Mode     │
      └─────────────────┘       └─────────────────┘
```

Production API configuration uses environment variables instead of hardcoded localhost URLs.

### Production Configuration

**Frontend:**
```env
VITE_API_URL=https://shopkart-y54q.onrender.com
```

**Backend:**
```env
CLIENT_URL=https://shop-kart-neon.vercel.app
NODE_ENV=production
```

The application uses production cookie settings so authentication works seamlessly between the Vercel frontend and Render backend.

---

## ⚠️ Error Handling

The application handles common cases such as:
- Invalid authentication
- Invalid product IDs
- Product not found
- Duplicate wishlist items
- Empty cart
- Invalid quantities
- Insufficient stock
- Invalid shipping information
- Payment failure
- Invalid payment signature
- Unauthorized order access
- Loading states
- Empty states
- API errors

---

## 💡 What I Learned

Through these assignments, I learned how to build a complete MERN e-commerce application step by step. I learned about authentication, REST APIs, MongoDB relationships, Mongoose references and `populate()`, React Context API, shopping cart management, checkout, Razorpay integration, payment verification, CORS, HttpOnly cookies, environment variables, API testing with Postman, Git and GitHub, and cloud deployment.

---

## 👤 Author

**Aswin Babu**
