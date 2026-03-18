# BizCollab ERP/CRM

<div align="center">

![BizCollab Logo](./frontend/src/Biz-logo.png)

**Enterprise Resource Planning & Customer Relationship Management System**

[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D6.0-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://reactjs.org/)

[Features](#features) • [Architecture](#architecture) • [Installation](#installation) • [Usage](#usage) • [API Documentation](#api-documentation) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Multi-Tenant Architecture](#multi-tenant-architecture)
- [Security](#security)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**BizCollab** is a modern, full-stack ERP/CRM solution designed for Indian businesses. Built with a multi-tenant architecture, it provides complete business management capabilities including client management, invoicing, quotations, payments, and comprehensive reporting.

### Why BizCollab?

- 🏢 **Multi-Tenant**: Complete data isolation for each business
- 🇮🇳 **India-First**: GST support, Indian payment modes, and localization
- 🚀 **Modern Stack**: React + Node.js + MongoDB
- 🔒 **Secure**: JWT authentication, bcrypt password hashing
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Beautiful UI**: Modern design with Ant Design components

---

## ✨ Key Features

### Core Modules

#### 📊 Client Management

- Complete client database with categorization
- Client types: Company, People
- Status tracking and source management
- Advanced search and filtering

#### 💰 Financial Management

- **Invoices**: Create, manage, and track invoices
- **Quotes**: Generate professional quotations
- **Payments**: Record and track payments
- **Payment Modes**: Cash, UPI, Bank Transfer, Cheque, Online Payment

#### 📈 Business Intelligence

- Real-time dashboard with key metrics
- Revenue tracking and analytics
- Payment status monitoring
- Client insights

#### 👤 User Management

- Multi-tenant user isolation
- Role-based access control
- Profile management
- Password security

#### 🧾 Tax & Compliance

- GST number validation
- Tax calculations
- Customizable tax rates
- Invoice numbering system

---

## 🛠 Technology Stack

### Frontend

```
├── React 18.3.1          # UI Framework
├── Redux Toolkit         # State Management
├── Ant Design 5.x        # UI Component Library
├── React Router 6        # Routing
├── Axios                 # HTTP Client
├── Vite                  # Build Tool
└── Day.js                # Date Manipulation
```

### Backend

```
├── Node.js 18+           # Runtime Environment
├── Express.js            # Web Framework
├── MongoDB 6+            # Database
├── Mongoose              # ODM
├── JWT                   # Authentication
├── Bcrypt.js             # Password Hashing
├── Joi                   # Validation
└── UUID                  # Unique ID Generation
```

### DevOps & Tools

```
├── Nodemon               # Development Server
├── ESLint                # Code Linting
├── Git                   # Version Control
└── dotenv                # Environment Management
```

---

## 🏗 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │    Tablet    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React SPA)                      │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Components │ Redux Store │ API Services │ Router  │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                 │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Auth Middleware │ Tenant Middleware │ Controllers │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (MongoDB)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ BizCollab_   │  │  biz_tenant1 │  │  biz_tenant2 │      │
│  │    core      │  │   (hash16)   │  │   (hash16)   │      │
│  │  (Users)     │  │  (Business   │  │  (Business   │      │
│  │              │  │    Data)     │  │    Data)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Tenant Architecture

```
User Registration
       │
       ▼
Generate UUID (tenantId)
       │
       ▼
Create User in BizCollab_core
       │
       ▼
Hash tenantId → biz_xxxxxxxxxxxxxxxx (16 chars)
       │
       ▼
Create Tenant Database
       │
       ├─→ Initialize Settings
       ├─→ Create Payment Modes
       ├─→ Create Default Tax
       └─→ Return JWT Token

User Login
       │
       ▼
Verify Credentials
       │
       ▼
Generate JWT (contains tenantId)
       │
       ▼
Frontend stores token

API Request
       │
       ▼
Auth Middleware (verify JWT)
       │
       ▼
Tenant Middleware (extract tenantId)
       │
       ▼
Switch to Tenant Database
       │
       ▼
Execute Business Logic
       │
       ▼
Return Response
```

### Database Schema

#### Core Database (BizCollab_core)

```javascript
User {
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  mobile: String,
  tenantId: String (UUID, unique),
  companyName: String,
  gstNumber: String,
  isSetupComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Tenant Database (biz_xxxxxxxxxxxxxxxx)

```javascript
Client {
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  type: String,
  status: String,
  // ... more fields
}

Invoice {
  _id: ObjectId,
  number: Number,
  year: Number,
  client: ObjectId (ref: Client),
  items: Array,
  subTotal: Number,
  taxTotal: Number,
  total: Number,
  status: String,
  paymentStatus: String,
  // ... more fields
}

Payment {
  _id: ObjectId,
  invoice: ObjectId (ref: Invoice),
  amount: Number,
  paymentMode: ObjectId (ref: PaymentMode),
  date: Date,
  // ... more fields
}

Setting {
  _id: ObjectId,
  settingCategory: String,
  settingKey: String,
  settingValue: Mixed,
  valueType: String,
  // ... more fields
}
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **MongoDB**: v6.0 or higher ([Download](https://www.mongodb.com/try/download/community))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))

### System Requirements

| Component | Minimum                               | Recommended     |
| --------- | ------------------------------------- | --------------- |
| RAM       | 4 GB                                  | 8 GB+           |
| CPU       | 2 cores                               | 4+ cores        |
| Storage   | 10 GB                                 | 20 GB+          |
| OS        | Windows 10, macOS 10.15, Ubuntu 20.04 | Latest versions |

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bizcollab-erp-crm.git
cd bizcollab-erp-crm
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DATABASE=mongodb://localhost:27017/BizCollab_core
# OR for MongoDB Atlas:
# DATABASE=mongodb+srv://username:password@cluster.mongodb.net/BizCollab_core

# Server Configuration
PORT=8888
NODE_ENV=development

# JWT Secret (Generate a secure random string)
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_generated_secret_here

# API Keys (Optional)
OPENAI_API_KEY=your_openai_key_here
RESEND_API=your_resend_api_key_here

# File Server
PUBLIC_SERVER_FILE=http://localhost:8888/
```

### Frontend Configuration

The frontend uses Vite environment variables. Create `.env` in the `frontend` directory:

```env
# API Configuration
VITE_BACKEND_SERVER=http://localhost:8888/
VITE_DEV_REMOTE=local

# File Upload
VITE_FILE_BASE_URL=http://localhost:8888/public/
```

### Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` in `.env`.

---

## 🎯 Running the Application

### Development Mode

#### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will start on `http://localhost:8888`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:3000`

#### Option 2: Run from Root (if configured)

```bash
# From project root
npm run dev
```

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Start Backend (Production)

```bash
cd backend
npm start
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8888/api
- **API Documentation**: http://localhost:8888/api-docs (if configured)

---

## 📁 Project Structure

```
bizcollab-erp-crm/
│
├── backend/                    # Backend Node.js application
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── clientController.js
│   │   │   └── ...
│   │   ├── models/             # Database models
│   │   │   ├── User.js
│   │   │   ├── schemas/        # Tenant schemas
│   │   │   │   ├── Client.js
│   │   │   │   ├── Invoice.js
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── routes/             # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── clientRoutes.js
│   │   │   └── ...
│   │   ├── middlewares/        # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── tenantMiddleware.js
│   │   │   └── ...
│   │   ├── utils/              # Utility functions
│   │   │   ├── dbSwitch.js
│   │   │   └── ...
│   │   ├── setup/              # Default settings
│   │   │   └── defaultSettings/
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server entry point
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── ...
│
├── frontend/                   # Frontend React application
│   ├── src/
│   │   ├── apps/               # Main app components
│   │   │   ├── BizCollabOs.jsx
│   │   │   └── ErpApp.jsx
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Client/
│   │   │   ├── Invoice/
│   │   │   └── ...
│   │   ├── modules/            # Feature modules
│   │   │   ├── AuthModule/
│   │   │   ├── ErpPanelModule/
│   │   │   └── ...
│   │   ├── redux/              # State management
│   │   │   ├── auth/
│   │   │   ├── erp/
│   │   │   └── store.js
│   │   ├── router/             # Routing configuration
│   │   ├── forms/              # Form components
│   │   ├── context/            # React contexts
│   │   ├── locale/             # Internationalization
│   │   ├── request/            # API client
│   │   ├── settings/           # App settings
│   │   ├── style/              # Global styles
│   │   └── RootApp.jsx         # Root component
│   ├── public/                 # Static assets
│   ├── .env                    # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── README.md                   # This file
├── LICENSE                     # License file
└── .gitignore                  # Git ignore rules
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobile": "9876543210",
  "companyName": "ABC Pvt Ltd",
  "gstNumber": "22AAAAA0000A1Z5",
  "country": "IN"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "result": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "companyName": "ABC Pvt Ltd",
    "gstNumber": "22AAAAA0000A1Z5",
    "role": "owner",
    "tenantId": "uuid-here",
    "isSetupComplete": false
  }
}
```

#### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "companyName": "ABC Pvt Ltd",
    "role": "owner",
    "tenantId": "uuid-here"
  }
}
```

### Protected Endpoints

All protected endpoints require the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

#### Client Management

```http
# Get all clients
GET /api/client/list?page=1&items=10

# Create client
POST /api/client/create
{
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "9876543210",
  "type": "company"
}

# Update client
PATCH /api/client/update/:id

# Delete client
DELETE /api/client/delete/:id
```

#### Invoice Management

```http
# Get all invoices
GET /api/invoice/list?page=1&items=10

# Create invoice
POST /api/invoice/create

# Get invoice by ID
GET /api/invoice/read/:id

# Update invoice
PATCH /api/invoice/update/:id

# Delete invoice
DELETE /api/invoice/delete/:id
```

---

## 🏢 Multi-Tenant Architecture

### How It Works

1. **User Registration**
   - User registers with company details
   - System generates unique UUID as `tenantId`
   - User record stored in `BizCollab_core` database

2. **Tenant Database Creation**
   - UUID is hashed to create short database name: `biz_xxxxxxxxxxxxxxxx`
   - New MongoDB database created for tenant
   - Default settings, payment modes, and taxes initialized

3. **Request Flow**
   - User logs in, receives JWT containing `tenantId`
   - Frontend sends JWT with every API request
   - `authMiddleware` verifies JWT
   - `tenantMiddleware` extracts `tenantId` and switches to tenant database
   - Business logic executes on tenant-specific data

4. **Data Isolation**
   - Each tenant has completely separate database
   - No data mixing between tenants
   - Scalable and secure architecture

### Database Naming Convention

```javascript
// Original UUID
tenantId = "27b544b5-1393-4c28-bc79-f93c41748c72";

// Hashed to 16 characters
hash = MD5(tenantId).substring(0, 16);
// Result: "6a047b26338076cb"

// Final database name
dbName = "biz_6a047b26338076cb";
// Length: 20 characters (within MongoDB's 38-byte limit)
```

---

## 🔒 Security

### Authentication & Authorization

- **JWT Tokens**: Stateless authentication with 24-hour expiry
- **Password Hashing**: Bcrypt with salt rounds
- **Token Storage**: Secure localStorage with automatic cleanup
- **CORS**: Configured for specific origins

### Data Protection

- **Input Validation**: Joi schema validation on all inputs
- **SQL Injection**: Protected by Mongoose ODM
- **XSS Protection**: React's built-in escaping
- **CSRF**: Token-based protection

### Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (32+ characters)
3. **Regularly update dependencies**
4. **Enable HTTPS in production**
5. **Implement rate limiting**
6. **Regular security audits**

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use strong, unique JWT_SECRET
- [ ] Configure MongoDB Atlas or production database
- [ ] Enable HTTPS/SSL
- [ ] Set up reverse proxy (Nginx)
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Implement rate limiting
- [ ] Set up CI/CD pipeline

### Deployment Options

#### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

```bash
# Build frontend
cd frontend
npm run build

# Copy build to backend public folder
cp -r dist ../backend/public

# Start backend with PM2
cd ../backend
npm install -g pm2
pm2 start src/server.js --name bizcollab
pm2 save
pm2 startup
```

#### Option 2: Docker (Recommended)

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8888
CMD ["node", "src/server.js"]
```

#### Option 3: Platform as a Service (Heroku, Render, etc.)

Follow platform-specific deployment guides.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

**Error**: `MongoNetworkError: failed to connect to server`

**Solution**:

- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- Verify network connectivity
- Check firewall settings

#### 2. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::8888`

**Solution**:

```bash
# Windows
netstat -ano | findstr :8888
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8888 | xargs kill -9
```

#### 3. JWT Token Invalid

**Error**: `401 Unauthorized: Invalid token`

**Solution**:

- Clear browser localStorage
- Ensure JWT_SECRET is consistent
- Check token expiry (24 hours)
- Re-login to get fresh token

#### 4. Database Name Too Long

**Error**: `Database name is too long. Max database name length is 38 bytes`

**Solution**:

- Already fixed in current version
- Database names are hashed to 20 characters
- Update to latest code if seeing this error

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

### What this means:

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Must disclose source
- ⚠️ Must include license
- ⚠️ Network use is distribution

---

## 👥 Authors & Contributors

- **Your Name** - _Initial work_ - [GitHub](https://github.com/yourusername)

See also the list of [contributors](https://github.com/yourusername/bizcollab-erp-crm/contributors) who participated in this project.

---

## 🙏 Acknowledgments

- Ant Design for the beautiful UI components
- MongoDB for the flexible database
- React team for the amazing framework
- All open-source contributors

---

## 📞 Support

- **Email**: bizcollab@gmail.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/bizcollab-erp-crm/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/bizcollab-erp-crm/wiki)

---

## 🗺 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Email integration
- [ ] SMS notifications
- [ ] Inventory management
- [ ] Project management module
- [ ] Time tracking
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export to PDF/Excel

---

<div align="center">

**Made with ❤️ for Indian Businesses**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/yourusername/bizcollab-erp-crm/issues) • [Request Feature](https://github.com/yourusername/bizcollab-erp-crm/issues)

</div>
