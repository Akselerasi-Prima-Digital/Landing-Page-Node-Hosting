<div align="center">

# � Landing Page Node Hosting

**A modern server monitoring dashboard with Node.js backend API**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1-lightgrey.svg)](https://expressjs.com/)

[Features](#-features) • [Installation](#-installation) • [Deployment](#-deployment) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Tech Stack](#-tech-stack)
- [License](#-license)

---

## 🌟 Overview

**Landing Page Node Hosting** is a beautiful server monitoring dashboard that displays real-time server statistics including uptime, response time, and server location. The project consists of a static frontend with glassmorphism design and a Node.js backend API that acts as a proxy to fetch server status from third-party monitoring services.

### Key Features

- 🎨 **Modern UI Design**: Glassmorphism with gradient backgrounds and smooth animations
- � **Real-time Monitoring**: Live server status updates
- � **Secure API Proxy**: Backend handles API keys securely
- ⚡ **Fast & Lightweight**: Optimized for performance

---

## ✨ Features

### Frontend

- **Responsive Dashboard**: Beautiful card-based layout with server metrics
- **Status Indicators**: Animated ping indicator for online status
- **Real-time Updates**: Auto-refresh timestamp and data fetching
- **Modern Design**: Dark theme with gradient backgrounds and blur effects
- **SEO Optimized**: Proper meta tags with `noindex, nofollow` for dashboard pages

### Backend

- **API Proxy**: Securely forwards requests to third-party monitoring APIs
- **Data Processing**: Filters and calculates average response time
- **Environment Variables**: Secure configuration management
- **Error Handling**: Comprehensive error responses

---

## � Project Structure

```
Landing-Page-Node-Hosting/
├── README.md
├── LICENSE
├── .gitignore
├── package.json              ← Frontend build tools (Tailwind CSS)
├── src/
│   └── input.css             ← Tailwind source file
│
├── public/                   ← Static files (ready to upload to public_html)
│   ├── index.html            ← Main dashboard page
│   ├── favicon.ico
│   ├── robots.txt
│   └── assets/
│       └── css/
│           └── main.css      ← Compiled Tailwind CSS
│
└── backend/                  ← Node.js API server
    ├── .env.example          ← Environment variables template
    ├── package.json          ← Backend dependencies
    └── index.js              ← Express API server
```

---

## 📋 Prerequisites

| Requirement         | Version  | Required |
| ------------------- | -------- | -------- |
| **Node.js**         | ≥ 18.0.0 | ✅ Yes   |
| **npm** or **yarn** | Latest   | ✅ Yes   |

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/reynaldiarya/Landing-Page-Node-Hosting.git
cd Landing-Page-Node-Hosting
```

### 2️⃣ Install Frontend Dependencies (Optional)

Only needed if you want to rebuild Tailwind CSS:

```bash
npm install
```

### 3️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## ⚙️ Configuration

### Environment Variables

1. **Navigate to backend folder:**

```bash
cd backend
```

2. **Create your `.env` file:**

```bash
cp .env.example .env
```

3. **Configure the following variables:**

```env
# Server Configuration
PORT=3000

# Third-party Monitoring API
HT_API_SERVER=https://api.example.com
HT_API_KEY=your_api_key_here
HT_MONITOR_ID=your_monitor_id
```

### Configuration Options

| Variable        | Description                    | Default | Required |
| --------------- | ------------------------------ | ------- | -------- |
| `PORT`          | Backend server port            | `3000`  | No       |
| `HT_API_SERVER` | Third-party monitoring API URL | -       | Yes      |
| `HT_API_KEY`    | API authentication key         | -       | Yes      |
| `HT_MONITOR_ID` | Monitor ID to fetch data for   | -       | Yes      |

---

## 👨‍💻 Development

### Frontend Development

If you need to modify Tailwind CSS styles:

```bash
# Build CSS from src/input.css to public/assets/css/main.css
npm run build:css
```

### Backend Development

Run the backend API server with hot-reloading:

```bash
cd backend
npm run dev
```

The server will start at `http://localhost:3000` (or your configured port).

### Testing Locally

1. **Start the backend server:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Open the frontend:**
   - Open `public/index.html` in your browser, or
   - Use a local server:
     ```bash
     npx serve public
     ```

---

## 📦 Deployment

### Deploy Frontend (Static Files)

Upload the entire **`public/`** folder to your web hosting's `public_html`:

```
public_html/
├── index.html
├── favicon.ico
├── robots.txt
└── assets/
    └── css/
        └── main.css
```

**Steps:**

1. Connect to your hosting via FTP/SFTP or File Manager
2. Upload all contents from the `public/` folder to `public_html/`
3. Your dashboard will be accessible at `https://yourdomain.com/`

---

### Deploy Backend (Node.js API)

#### Option 1: Same Server (Subdirectory)

If your hosting supports Node.js applications:

1. **Upload the `backend/` folder** to your server (e.g., `/home/user/backend/`)

2. **Install production dependencies:**

   ```bash
   cd backend
   npm install --production
   ```

3. **Configure environment variables:**

   ```bash
   nano .env  # or edit via file manager
   ```

4. **Start the server:**

   ```bash
   npm start
   ```

5. **Use a process manager** (recommended):
   ```bash
   npm install -g pm2
   pm2 start index.js --name "landing-page-api"
   pm2 save
   pm2 startup
   ```

#### Option 2: Separate Server/Subdomain

1. Set up a subdomain (e.g., `api.yourdomain.com`)
2. Deploy the backend to this subdomain
3. Update CORS settings if needed
4. Update frontend to point to the API subdomain

---

## 📖 API Documentation

### Base URL

```
http://localhost:3000
```

---

### Get Server Status

Retrieves server uptime, average response time, and location.

#### Request

```http
GET /api/get-status
```

#### Response

```json
{
  "uptime": "99.987",
  "average_response_time": 342,
  "location": "Jakarta, Indonesia"
}
```

#### Response Fields

| Field                   | Type   | Description                           |
| ----------------------- | ------ | ------------------------------------- |
| `uptime`                | string | Server uptime percentage              |
| `average_response_time` | number | Average response time in milliseconds |
| `location`              | string | Server location (City, Country)       |

#### Example Usage

**cURL:**

```bash
curl http://localhost:3000/api/get-status
```

**JavaScript (Fetch):**

```javascript
fetch('/api/get-status')
  .then((response) => response.json())
  .then((data) => {
    console.log('Uptime:', data.uptime);
    console.log('Response Time:', data.average_response_time, 'ms');
    console.log('Location:', data.location);
  });
```

#### Error Response

```json
{
  "message": "Gagal mengambil data"
}
```

---

## 🛠️ Tech Stack

### Frontend

| Technology             | Version | Purpose           |
| ---------------------- | ------- | ----------------- |
| **HTML5**              | -       | Structure         |
| **Tailwind CSS**       | 4.1.11  | Styling framework |
| **Vanilla JavaScript** | -       | Client-side logic |

### Backend

| Technology  | Version | Purpose                   |
| ----------- | ------- | ------------------------- |
| **Node.js** | ≥18.0.0 | Runtime environment       |
| **Express** | 5.1.0   | Web framework             |
| **Axios**   | 1.11.0  | HTTP client for API calls |
| **dotenv**  | 17.2.1  | Environment management    |

### Development Tools

| Technology           | Version | Purpose                 |
| -------------------- | ------- | ----------------------- |
| **Nodemon**          | 3.1.10  | Auto-restart dev server |
| **@tailwindcss/cli** | 4.1.11  | CSS build tool          |

---

## 🎨 Design Features

- **Glassmorphism**: Modern blur effect with backdrop filters
- **Gradient Backgrounds**: Purple and indigo color scheme
- **Animated Elements**: Ping animation for status indicator
- **Grid Pattern**: Subtle background pattern for depth
- **Responsive Layout**: Mobile-first design approach
- **SVG Icons**: Heroicons for clean vector graphics

---

## 🔒 Security Notes

- ✅ API keys are stored in `.env` and never exposed to frontend
- ✅ Backend acts as a proxy to hide third-party API credentials
- ✅ `.env` is in `.gitignore` to prevent accidental commits
- ✅ Dashboard has `noindex, nofollow` meta tags

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact & Support

- **GitHub**: [@reynaldiarya](https://github.com/reynaldiarya)
- **Repository**: [Landing-Page-Node-Hosting](https://github.com/reynaldiarya/Landing-Page-Node-Hosting)

---

<div align="center">

**Built with ❤️ using Node.js and modern web technologies**

If this project helped you, consider giving it a ⭐!

</div>
