# 🚗 Vehicle Rental System

🔗 **Live URL:** https://your-live-site-link.com  


---

## 🚀 Features

### 🔐 Authentication
- JWT-based secure login & registration  
- Role-based access (Admin, Customer)

---

### 🚘 Vehicle Management
- Add new vehicles  
- Update vehicle details  
- Delete vehicles *(only when no active bookings exist)*  
- Auto-update availability based on booking status  

---

### 📅 Booking Management
- Create a booking  
- Cancel booking **only before the start date**  
- System automatically marks bookings as **"returned"** when rent_end_date has passed  
- Vehicle availability updates automatically when a booking is returned  

---

### 👤 Customer Management
- Delete customer account **only if** there are no active bookings  
- View customer booking history  

---

### ⚙ System Automations

  - Check expired bookings  
  - Mark them as “returned”  
  - Update vehicle availability accordingly  

---

## 🛠️ Technology Stack

### **Backend**
- Node.js  
- Express.js  
- TypeScript  
- PostgreSQL  
- pg (Node PostgreSQL Client)  
- bcrypt.js (Password Hashing)  
- jsonwebtoken (JWT Authentication)

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-repo-link.git
cd vehicle-rental-system

npm install

PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=10

npm run dev
npm run build
npm start





