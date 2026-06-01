# ShopReact 🛍️

A full-stack ecommerce web application built with React, Firebase, and Paystack payment integration.

🔗 **Live Demo:** [shopreact-gilt.vercel.app](https://shopreact-gilt.vercel.app)

---

## 📸 Screenshots

> Add screenshots of your app here after deployment

---

## ✨ Features

- 🔐 **Authentication** — Email/password and Google login via Firebase Auth
- 🛒 **Shopping Cart** — Persistent cart per user using localStorage
- ❤️ **Wishlist** — Save favourite products, synced to Firestore in real time
- 💳 **Paystack Payment** — Secure NGN payment integration
- 📦 **Orders** — Order history with estimated delivery date
- 🔍 **Search & Filter** — Search by name, filter by category, sort by price/rating
- 💀 **Skeleton Loading** — Shimmer loading effect while products load
- 🔔 **Toast Notifications** — Add to cart and wishlist feedback
- 📱 **Fully Responsive** — Mobile-first design with hamburger menu

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| React 19 | Frontend UI |
| React Router v7 | Client-side routing |
| Firebase Auth | User authentication |
| Firestore | Wishlist and orders database |
| localStorage | Persistent cart per user |
| Paystack | Payment processing |
| Vercel | Deployment and hosting |
| Vite | Build tool |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project
- Paystack account

### Installation

```bash
# Clone the repo
git clone https://github.com/Dev-Golden/Shopreact.git

# Navigate to project
cd Shopreact

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root folder:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📁 Project Structure


---

## 🔑 Key Implementations

- **Protected Routes** — Wishlist, Checkout, and Orders require authentication
- **Per-user Cart** — Each user's cart is saved separately in localStorage
- **Real-time Wishlist** — Firestore `onSnapshot` listener for live updates
- **Paystack Integration** — NGN payment with order saved to Firestore on success
- **Context API** — Global state for cart, auth, and wishlist without Redux

---

## 👨‍💻 Author

**Dev Golden**
- GitHub: [@Dev-Golden](https://github.com/Dev-Golden)
- LinkedIn: [Add your LinkedIn here]

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).