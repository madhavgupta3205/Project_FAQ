# Project_FAQ


## 📌 Project Structure

```
Project_FAQ/
│── backend/      # Node.js + Express.js backend (Dockerized)
│── admin/        # React.js Admin Panel (Frontend)
```

---

## 🛠️ **Prerequisites**

Ensure you have the following installed before proceeding:

- **Docker & Docker Compose** 🐳
- **Node.js (Latest LTS version)** 
- **NPM or Yarn** (For package management)

---

## 🚀 **Setup & Run Backend (Dockerized)**

1. **Navigate to the backend directory:**
   ```sh
   cd backend
   ```
   
2. **Update `.env` file** :
   ```sh
   PORT=3000
   MONGODB_URI=mongodb://mongodb:27017/faq_system
   REDIS_URL=redis://redis:6379
   JWT_SECRET=your_secret_key
   ```

3. **Start backend services using Docker Compose:**
   ```sh
   docker-compose up --build
   ```
   _This will pull necessary images, build the backend container, and start MongoDB & Redis._

4. **Access the backend API** at:
   - `http://localhost:3000/api/faqs` (FAQ API)
   - `http://localhost:3000/api/admin` (Admin Authentication API)


5. **To stop services**, run:
   ```sh
   docker-compose down
   ```

---

# 📌 API Routes Documentation

## 🔑 Authentication (Admin)

### 1️⃣ Register Admin
- **Endpoint:** `POST /api/admin/register`
- **Description:** Registers a new admin (only used once for setup).
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Response (Success - 201):**
  ```json
  {
    "success": true,
    "message": "Admin registered successfully"
  }
  ```

---

### 2️⃣ Login Admin
- **Endpoint:** `POST /api/admin/login`
- **Description:** Logs in an admin and returns a JWT token.
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

- **Headers Required for Protected Routes:**
  ```json
  {
    "Authorization": "Bearer your-jwt-token"
  }
  ```

---

## 📖 FAQ Management

### 3️⃣ Get All FAQs
- **Endpoint:** `GET /api/faqs`
- **Description:** Retrieves all FAQs, optionally in a specific language.
- **Query Parameters:**
  - `lang` - Language code (`hi`, `bn`)


---

### 4️⃣ Create FAQ (Admin Only)
- **Endpoint:** `POST /api/faqs`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer your-jwt-token"
  }
  ```
- **Request Body:**
  ```json
  {
    "question": "What is an API?",
    "answer": "API stands for Application Programming Interface."
  }
  ```

---

### 5️⃣ Update FAQ (Admin Only)
- **Endpoint:** `PUT /api/faqs/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer your-jwt-token"
  }
  ```
- **Request Body:**
  ```json
  {
    "question": "What is a REST API?",
    "answer": "REST API is a web service that follows REST architecture principles."
  }
  ```

---

### 6️⃣ Delete FAQ (Admin Only)
- **Endpoint:** `DELETE /api/faqs/:id`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer your-jwt-token"
  }
  ```
---

## 🚀 Additional Notes
- **Protected routes require an `Authorization` header with a valid JWT token.**
- **Language support:** Translations are available for Hindi (`hi`) and Bengali (`bn`).
- **Caching:** FAQs are cached in Redis for faster responses.

---

### 🛠️ Setup & Running the API

1. **Access API on:** `http://localhost:3000`
2. **Test API using Postman or cURL.**


---

## 🎨 **Setup & Run Frontend (Admin Panel)**

1. **Navigate to the admin directory:**
   ```sh
   cd ../admin
   ```

2. **Install dependencies:**
   ```sh
   npm install  # or yarn install
   ```

3. **Update the `.env` file** :
   ```sh
   VITE_TINYMCE_API_KEY=(Your tinyMCE API key here)
   ```

4. **Start the frontend:**
   ```sh
   npm run dev  # or yarn dev
   ```

5. **Access the admin panel** at:
   - `http://localhost:5173` 

6. **Login using credentials created in Backend part (Step 5)** 


---


## 📌 **Common Issues & Fixes**

- **Port 3000 is already in use?**
  ```sh
  lsof -i :3000  # Find the process using the port
  kill -9 <PID>  # Kill the process
  ```

- **Database connection issues?**
  ```sh
  docker-compose down -v  # Remove volumes and restart
  docker-compose up --build
  ```

---

## 🎯 **Contributing**

Feel free to open issues or submit pull requests. Let's build this together! 🚀
