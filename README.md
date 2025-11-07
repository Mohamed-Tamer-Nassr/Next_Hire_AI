# 🚀 Next Hire AI

> **Your Shortcut to Interview Success** - AI-powered interview preparation platform built with Next.js 15, TypeScript, and OpenAI.

![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19.1-green?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Next Hire AI** is a comprehensive interview preparation platform that leverages artificial intelligence to help professionals ace their interviews. With features like AI-powered mock interviews, real-time analytics, speech recognition, and personalized feedback, users can practice and improve their interview skills with confidence.

### 🌟 Why Next Hire AI?

- **AI-Driven Practice** - Intelligent question generation powered by OpenAI
- **Real-Time Feedback** - Instant analysis and improvement suggestions
- **Progress Tracking** - Detailed analytics and performance insights
- **Speech Recognition** - Practice with voice-based interview simulations
- **Subscription Management** - Flexible pricing with Stripe integration

---

## ✨ Features

### 🎨 **User Features**

- ✅ **Beautiful Landing Page** - Modern design with animations and gradients
- ✅ **AI Mock Interviews** - Practice with AI-generated questions
- ✅ **Speech Recognition** - Voice-based interview practice
- ✅ **Analytics Dashboard** - Track your progress with interactive charts
- ✅ **Performance Insights** - Daily stats, trends, and completion rates
- ✅ **Dark/Light Theme** - Seamless theme switching
- ✅ **Responsive Design** - Works perfectly on all devices

### 🔐 **Authentication & Security**

- ✅ **NextAuth Integration** - Secure authentication with email/password
- ✅ **Role-Based Access** - User and Admin roles with protected routes
- ✅ **Password Encryption** - Bcrypt hashing for secure password storage
- ✅ **Rate Limiting** - API protection against abuse
- ✅ **Middleware Protection** - Route-level security

### 💳 **Subscription & Payments**

- ✅ **Stripe Integration** - Secure payment processing
- ✅ **Subscription Tiers** - Flexible pricing plans ($9.99/month)
- ✅ **Webhook Handling** - Automated subscription status updates
- ✅ **Invoice Management** - Track payments and billing history

### 📊 **Analytics & Reporting**

- ✅ **Interactive Charts** - Area, Line, Bar, and Pie charts using Recharts
- ✅ **Daily Statistics** - Interview counts, completion rates, and trends
- ✅ **Performance Metrics** - Best performance day, improvement trends
- ✅ **Date Range Filtering** - Custom date range analytics

### 👨‍💼 **Admin Features**

- ✅ **User Management** - View and manage all users
- ✅ **Subscription Monitoring** - Track active subscriptions and revenue (MRR)
- ✅ **Interview Analytics** - Platform-wide statistics and insights
- ✅ **Admin Dashboard** - Comprehensive overview with key metrics

---

## 🛠️ Tech Stack

### **Frontend**

- **Framework:** Next.js 15.0.3 (App Router)
- **Language:** TypeScript 5.9.3
- **UI Library:** HeroUI (NextUI fork) 2.8.5
- **Styling:** Tailwind CSS 4
- **State Management:** React 18.3.1
- **Charts:** Recharts 3.3.0
- **Icons:** Iconify React 6.0.2
- **Animations:** Framer Motion 12.23.24
- **Theme:** next-themes 0.4.6
- **Forms:** React Hot Toast 2.6.0

### **Backend**

- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** MongoDB with Mongoose 8.19.1
- **Authentication:** NextAuth 4.24.11
- **Password Hashing:** Bcrypt 6.0.0 / Bcryptjs 3.0.2
- **Email:** Resend 6.4.2
- **AI:** OpenAI 6.7.0

### **Payments & Subscriptions**

- **Payment Gateway:** Stripe 19.2.0
- **Client SDK:** @stripe/stripe-js 8.2.0
- **React Integration:** @stripe/react-stripe-js 5.3.0

### **DevOps & Tools**

- **Rate Limiting:** rate-limiter-flexible 8.1.0
- **Image Hosting:** Cloudinary 2.7.0
- **Speech Recognition:** react-speech-recognition 4.0.1
- **Validation:** Validator 13.15.15
- **Environment:** dotenv-cli 10.0.0

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Stripe account for payments
- OpenAI API key
- Cloudinary account (optional, for images)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/next-hire-ai.git
cd next-hire-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see [Environment Variables](#-environment-variables))

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

```
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@nexthire.ai
```

---

## 🔗 API Routes

### **Authentication**

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### **Interviews**

- `GET /api/interviews` - Get all user interviews
- `POST /api/interviews` - Create new interview
- `GET /api/interviews/:id` - Get interview by ID
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Delete interview

### **Dashboard**

- `GET /api/dashboard/stats` - Get user statistics
- `GET /api/dashboard/analytics` - Get detailed analytics

### **Payments**

- `POST /api/payment/create-checkout-session` - Create Stripe checkout
- `POST /api/payment/create-portal-session` - Customer portal
- `POST /api/webhooks/stripe` - Stripe webhook handler

### **Admin**

- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Admin dashboard stats
- `GET /api/admin/interviews` - All platform interviews

---

## 📸 Screenshots

### Landing Page

![Landing Page](./screenshots/landing-page.png)

### User Dashboard

![Dashboard](./screenshots/dashboard.png)

### Analytics

![Analytics](./screenshots/analytics.png)

### Interview Session

![Interview](./screenshots/interview.png)

### Admin Panel

![Admin](./screenshots/admin.png)

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git push origin main
```

2. **Import to Vercel**

- Go to [Vercel](https://vercel.com)
- Click "Import Project"
- Select your repository
- Add environment variables
- Deploy!

3. **Configure Stripe Webhooks**

- Update webhook URL to your production URL
- Test webhook endpoints

### Environment Setup

- Ensure all environment variables are set in Vercel
- Update `NEXTAUTH_URL` to your production domain
- Configure MongoDB Atlas for production

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [HeroUI](https://www.heroui.com/) - Beautiful UI Components
- [OpenAI](https://openai.com/) - AI-Powered Features
- [Stripe](https://stripe.com/) - Payment Processing
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Hosting Platform

---

## 📊 Project Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat-square)
![Maintenance](https://img.shields.io/badge/maintenance-active-green?style=flat-square)

---

**Made with ❤️ and ☕ - Transforming recruitment through AI and innovation.**

**⭐ Star this repo if you find it helpful!**
