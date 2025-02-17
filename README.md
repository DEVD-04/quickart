# Quickart - E-commerce App

## Overview
Quickart is a full-featured e-commerce application developed using the **MERN (MongoDB, Express.js, React.js, Node.js) stack**. The application provides separate interfaces for **Users** and **Admins** with functionalities such as product browsing, ordering, tracking, and payment processing via **Stripe**.

## Links:
User: https://quickart-frontend.vercel.app/
Admin: https://quickart-admin.vercel.app/

## Features
### User Features
- Browse products across different categories
- Search and filter products
- Add products to cart and manage orders
- Secure checkout process using **Stripe**
- Order tracking and history
- User authentication (Login/Signup)

### Admin Features
- Add, edit, and remove products
- Manage product inventory
- Process and manage customer orders
- View and update order statuses
- Admin authentication and access control

## Tech Stack
- **Frontend:** React.js, Redux, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Payment Gateway:** Stripe

## Installation & Setup

### Prerequisites
Ensure you have the following installed on your system:
- Node.js
- MongoDB
- Git



### Backend Setup
```sh
cd backend
npm install
npm start
```

### Frontend Setup
```sh
cd frontend
npm install
npm start
```

### Environment Variables
Create a `.env` file in the `backend` directory and add the following:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```


## Future Enhancements
- Wishlist and Favorites functionality
- Email notifications for order updates
- User reviews and ratings for products
- Improved UI and responsiveness
