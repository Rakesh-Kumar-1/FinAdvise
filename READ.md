
# FinAdvice 💼📊

FinAdvice is a full‑stack financial advisory platform that connects **clients** with **verified financial advisors** for secure, scheduled, and paid video consultations. The platform focuses on trust, structured advisor verification, real‑time communication, and controlled consultation durations.

---

## 🚀 Features

### 👤 Client Features

* Browse and view **verified financial advisors**
* Advisor profiles with:

  * Qualifications & experience
  * Ratings & reviews
  * Availability schedule
* Book **exactly 40-minute video consultation sessions**
* Secure multi-step **payment gateway flow**
* Automatic meeting link generation (Zoom integration)
* Email confirmation with meeting details
* Real-time chat with advisors

### 🧑‍💼 Advisor Features

* Advisor onboarding & verification form
* Upload qualification certificates & documents
* Manage availability schedules (day & time slots)
* Temporary slot blocking to prevent double booking
* View client bookings & meeting history
* Ratings and feedback system

### ⚡ Performance & Scalability

* Redis-based caching for faster advisor data retrieval
* Reduced database load using in-memory caching
* Message-driven architecture using RabbitMQ

### 🔐 Authentication & Security

* JWT-based authentication
* Role-based access control (Client / Advisor / Admin)
* Protected routes using middleware
* Secure cookie handling

## 🛠 Tech Stack

### Frontend

* **React.js**
* Tailwind CSS / Custom CSS
* React Router
* Swiper.js (recommendation slider)

### Backend

* **Node.js**
* **Express.js**
* MongoDB with **Mongoose**
* JWT Authentication
* Nodemailer (email notifications)

### Caching & Messaging

* **Redis** – caching frequently accessed data (advisor profiles, availability) and session optimization
* **RabbitMQ** – message queue for asynchronous tasks (email notifications, meeting creation, payment callbacks)

### Real-Time & Media

* **Socket.io** – real-time chat
* **Zoom API** – meeting creation
* WebRTC concepts (future extensibility)

### Payments

* Custom simulated **Payment Gateway Flow**

  * Card / UPI / Wallet / Net Banking
  * Transaction ID generation

---

## 🔄 Booking Flow

1. Client selects an advisor
2. Chooses available day & time slot
3. Slot is **temporarily blocked** to avoid conflicts (Redis)
4. Client completes payment
5. Payment event is pushed to **RabbitMQ**
6. Zoom meeting is automatically created asynchronously
7. Email sent to both client & advisor
8. Slot is permanently booked
9. Slot auto-restores if time passes without confirmation

---

## 📧 Email Notifications

* Booking confirmation
* Meeting link & schedule
* Transaction ID details

---

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

````env
MONGO_URI
JWT_SECRET

# Redis
REDIS_HOST
REDIS_PORT

# RabbitMQ
RABBITMQ_URL

# Email
EMAIL_USER
EMAIL_PASS

# Zoom
ZOOM_API_KEY
ZOOM_API_SECRET
````

---
## 👨‍💻 Author

**Rakesh Kumar**
B.Tech – Computer Science
Full Stack Developer

* LinkedIn: *(add your LinkedIn)*

---
