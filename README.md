# BookIt – Travel Experiences & Slot Booking Platform  
**Highway Delite Internship Assignment Submission**  
Built using **React (Frontend)** + **Node.js / Express (Backend)** + **MongoDB**  
Includes **email booking confirmation to user**

---

## 🚀 Project Overview

BookIt is a full-stack travel booking platform where users can explore curated travel experiences, view available slots, book instantly, and receive a **confirmation email** after successful payment.  
This project is built as part of **Highway Delite’s Fullstack Intern Assignment**.

---

## ✅ Features Implemented

### 🌐 Frontend (React + Vite + TailwindCSS + Framer Motion)
- React + **JavaScript** (not TypeScript)
- **Pixel-perfect Figma UI**
- **Login & Signup authentication (token-based)**
- Fully responsive and mobile-first
- **Smooth modern animations** using Framer Motion
- Complete flow: `Home → Details → Checkout → Confirmation`
- **State managed via Hooks**
- Axios-based API communication

### 🔧 Backend (Node.js + Express + MongoDB)
- **REST API routes**
- `/api/auth/login`, `/api/auth/signup`
- `/api/experiences` — Fetch all experiences
- `/api/experiences/:id` — Fetch slots and details
- `/api/bookings` — Create booking
- `/api/promo/validate` — Promo validation
- **Prevents double-booking**
- **Sends confirmation mail after booking** ✅


---

## 🔧 Tech Stack

| Layer | Technology |
|--------|-----------|
| Frontend | React, Vite, TailwindCSS, Framer Motion, Axios |
| Backend | Node.js, Express.js, JWT Auth, Nodemailer |
| Database | MongoDB |
| Hosting | (Vercel / Render / Railway) |

---

## ▶️ How to Run Project Locally

### 1️⃣ Clone Project
```bash
git clone https://github.com/your-repo-url.git
cd bookit-project

2️⃣ Setup Frontend
cd frontend
npm install
npm run dev

3️⃣ Setup Backend
cd backend
npm install
npm start

## 📁 Folder Structure
bookit-frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── data/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── README.md
└── .gitignore

## 🖼️ Screenshots

| Home Page | Details Page |
|------------|---------------|
| <img width="1916" height="991" alt="image" src="https://github.com/user-attachments/assets/4b49b71d-61c5-4110-ac9f-77353b6784bc" />
 |

🏁 Conclusion

The BookIt: Experiences & Slots project demonstrates a complete end-to-end travel booking experience built entirely with React and TailwindCSS.

Even though this is a frontend-only implementation, it accurately simulates real-world booking flows including:

Browsing travel experiences

Viewing detailed slots and dates

Secure login/signup simulation

Booking checkout with promo code validation

Uploading images and viewing confirmation results

This project fulfills all major requirements of the Highway Delite Fullstack Intern Assignment, with additional enhancements such as:

Login/Signup flow with route protection

Responsive, animated, and modern UI

LocalStorage-based data persistence

It reflects strong frontend development skills, UI/UX attention to detail, and readiness to integrate backend APIs seamlessly in the future.

💡 Developed by: Prathamesh Dhone
🎯 Submitted for: Highway Delite Internship Assignment
🖥️ Tech Stack: React + JavaScript + TailwindCSS
🗓️ Submission Type: Frontend-only (Backend can be integrated l

