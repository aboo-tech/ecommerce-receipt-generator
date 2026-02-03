# E-commerce Receipt Generator

A scalable and asynchronous receipt generation service for e-commerce platforms. This service generates styled PDF receipts and automatically emails them to customers after checkout — without blocking the main order flow.

---

## 🚀 Features

- Asynchronous receipt generation using **BullMQ + Redis**
- HTML → PDF rendering using **Puppeteer**
- Dynamic templating with **Handlebars**
- Automatic **email delivery of PDF receipts to customers**
- Cloud upload and hosting via **Cloudinary**
- MongoDB-based receipt & order storage
- Non-blocking checkout flow
- Scalable job queue processing
- Clean and modular architecture

---

## 🛠 Tech Stack

- **Node.js / TypeScript**
- **MongoDB + Mongoose**
- **BullMQ + Redis**
- **Puppeteer**
- **Handlebars**
- **Cloudinary**
- **Nodemailer**
- **Express.js**

---

## 🧠 How It Works

1. Customer completes checkout.
2. Order is saved to MongoDB.
3. A **BullMQ job** is dispatched for receipt generation.
4. Worker compiles **Handlebars HTML template**.
5. **Puppeteer renders HTML → PDF**.
6. PDF is uploaded to **Cloudinary**.
7. Receipt record is saved with secure download URL.
8. **Receipt PDF is emailed to the customer automatically.**
9. Checkout response returns instantly (no blocking).

