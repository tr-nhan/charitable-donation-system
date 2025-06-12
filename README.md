# 🎯 Charitable Donation System

A full-stack web application designed to simplify charitable fundraising and donations. Users can create, discover, and contribute to various donation campaigns while admins manage campaigns and monitor platform activity.

Link demo: https://gofund.io.vn
## 🏫 Course Information

- **Class**: NT208.P23.ANTT  
- **Instructor**: Trần Tuấn Dũng  
- **Group Members**:
  - **23521298** – Huỳnh Minh Quí
  - **23520606** – Huỳnh Hoàng Huy
  - **20520666** – Lê Trung Nhân
  - **23520612** – Lê Huỳnh Nhật Huy

---

## 🚀 Technologies Used

- **Frontend**: ReactJS, TailwindCSS  
- **Backend**: NodeJS, ExpressJS  
- **Database**: PostgreSQL  
- **Authentication**: JWT, Middleware Authorization  
- **Cloud Storage**: Cloudinary (for image uploads)  
- **Other Tools**: React Router, Axios, Form Validation Libraries, etc.

---

## 💡 Key Features

### 🧑 User Features

- **User Registration and Login**
  - Sign up and sign in with email and password
  - Secure JWT-based authentication

- **Campaign Management**
  - Create a new donation campaign (title, goal, image, description, category)
  - Edit owned campaigns
  - View all campaigns or search by keyword or category

- **Donation System**
  - Donate to any campaign via integrated payment form
  - View total amount raised and supporter list
  - See personal transaction and donation history

- **Wallet & Balance**
  - Deposit money into account balance (with paypal and metamask)
  - Track deposits, withdrawals, and spending history

- **User Profile**
  - View and edit personal profile information
  - View all campaigns created by the user

- **Campaign Discovery**
  - Browse campaigns by category or popularity
  - Discover other users and their public campaigns

- **Knowledge Center**
  - Read fundraising tips to run better campaigns
  - Access common questions and help articles

---

### 🔧 Admin Features

- **Admin Dashboard**
  - Overview of platform metrics (number of users, donations, reports, etc.)

- **Campaign Moderation**
  - Review reported campaigns
  - Approve campaigns that violate policies

- **User & Balance Oversight**
  - View user information and activities
  - Access and monitor financial transaction data

---

### 🌐 General Features

- Responsive design with TailwindCSS  
- Client-side routing using React Router  
- Page not found (404) handling  
- Reusable layout components  

---

## 🧪 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/charitable-donation-system.git

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../Server
npm install

# Setup environment variables
# Create a `.env` file in the root of the server with DB credentials, JWT secret, etc.

# Run backend server
npm run dev

# Run frontend app
cd ../Client
npm run dev
