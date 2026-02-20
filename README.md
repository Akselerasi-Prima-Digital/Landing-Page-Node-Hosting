<div align="center">

# 🖥️ Landing Page Node Hosting

**A modern server monitoring dashboard with Cloudflare Worker backend API**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020.svg)](https://workers.cloudflare.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4.svg)](https://tailwindcss.com/)

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

**Landing Page Node Hosting** is a beautiful server monitoring dashboard that displays real-time server statistics including uptime, response time, and server location. The project consists of a static frontend with glassmorphism design and a **Cloudflare Worker** backend API that acts as a proxy to fetch server status from [HetrixTools](https://hetrixtools.com/).

### Key Features

- 🎨 **Modern UI Design**: Glassmorphism with gradient backgrounds and smooth animations
- 🔄 **Real-time Monitoring**: Auto-refresh every 60 seconds
- 🔒 **Secure API Proxy**: Backend handles API keys securely via Cloudflare Workers
- ⚡ **Fast & Lightweight**: Edge-deployed with built-in response caching
- 🌐 **Multi-Server Support**: Monitor any server via query parameter

---

## ✨ Features

### Frontend

- **Responsive Dashboard**: Beautiful card-based layout with server metrics
- **Status Indicators**: Animated ping indicator for online status
- **Auto-Refresh**: Data automatically updates every 60 seconds
- **Configurable Monitor ID**: Set via `data-monitor-id` attribute (no code change needed)
- **Accessible**: `aria-hidden` on decorative icons, `<noscript>` fallback
- **Modern Design**: Dark theme with gradient backgrounds and blur effects
- **SEO Optimized**: Proper meta tags with `noindex, nofollow` for dashboard pages

### Backend (Cloudflare Worker)

- **API Proxy**: Securely forwards requests to HetrixTools API
- **Response Caching**: 60-second TTL via Cloudflare Cache API to reduce upstream calls
- **Wildcard CORS**: Supports exact domain or wildcard subdomain (e.g., `*.example.com`)
- **Data Processing**: Filters and calculates average response time from all monitoring locations
- **Error Handling**: Comprehensive error responses with `console.error` logging

---

## 📂 Project Structure

```
Landing-Page-Node-Hosting/
├── README.md
├── LICENSE
├── .gitignore
├── .prettierrc
├── package.json                ← Frontend build tools (Tailwind CSS)
├── src/
│   └── css/
│       └── input.css           ← Tailwind CSS source + custom styles
│
├── public/                     ← Static files (deploy to hosting)
│   ├── index.html              ← Main dashboard page
│   ├── favicon.ico
│   ├── robots.txt
│   └── assets/
│       ├── css/
│       │   └── style.css       ← Compiled & minified Tailwind CSS
│       └── js/
│           └── app.js          ← Dashboard logic (fetch, auto-refresh)
│
└── backend/                    ← Cloudflare Worker API
    ├── .env.example            ← Environment variables template
    ├── package.json            ← Wrangler dependency
    ├── wrangler.jsonc          ← Worker configuration
    └── src/
        └── index.js            ← Worker entry point
```

---

## 📋 Prerequisites

| Requirement            | Version  | Required |
| ---------------------- | -------- | -------- |
| **Node.js**            | ≥ 18.0.0 | ✅ Yes   |
| **npm**                | Latest   | ✅ Yes   |
| **Cloudflare Account** | -        | ✅ Yes   |

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Akselerasi-Prima-Digital/Landing-Page-Node-Hosting.git
cd Landing-Page-Node-Hosting
```

### 2️⃣ Install Frontend Dependencies

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

### Frontend Configuration

Set the monitor ID in `public/index.html` on the `<body>` tag:

```html
<body data-monitor-id="YOUR_MONITOR_ID" ...></body>
```

### Backend Environment Variables

Configure via `wrangler.jsonc` (variables) and Cloudflare Dashboard (secrets):

**Variables** (set in `wrangler.jsonc`):

```jsonc
{
  "vars": {
    "HT_API_SERVER": "https://api.hetrixtools.com/v3",
    "ALLOWED_ORIGIN": "*.yourdomain.com",
  },
}
```

**Secrets** (set via CLI):

```bash
cd backend
npx wrangler secret put HT_API_KEY
```

### Configuration Options

| Variable         | Type     | Description                                           | Default | Required |
| ---------------- | -------- | ----------------------------------------------------- | ------- | -------- |
| `HT_API_SERVER`  | Variable | HetrixTools API base URL                              | -       | ✅ Yes   |
| `HT_API_KEY`     | Secret   | HetrixTools API key                                   | -       | ✅ Yes   |
| `ALLOWED_ORIGIN` | Variable | CORS origin, supports wildcard (e.g. `*.example.com`) | `*`     | No       |

### CORS — Wildcard Subdomain

Set `ALLOWED_ORIGIN` to allow all subdomains of your domain:

```
ALLOWED_ORIGIN=*.example.com
```

| Request Origin          | Result     |
| ----------------------- | ---------- |
| `https://a.example.com` | ✅ Allowed |
| `https://b.example.com` | ✅ Allowed |
| `https://example.com`   | ✅ Allowed |
| `https://evil.com`      | ❌ Blocked |

---

## 👨‍💻 Development

### Frontend — Tailwind CSS

```bash
# Watch mode (auto-rebuild on changes)
npm run dev

# Build & minify for production
npm run build:css

# Format code
npm run format
```

### Backend — Cloudflare Worker

```bash
cd backend

# Start local development server
npm run dev

# Deploy to Cloudflare
npm run deploy
```

The local dev server provides a URL (e.g. `http://localhost:8787`) with hot-reloading.

---

## 📦 Deployment

### Deploy Frontend (Static Files)

Upload the **`public/`** folder to your web hosting:

```
public_html/
├── index.html
├── favicon.ico
├── robots.txt
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

**Steps:**

1. Build CSS: `npm run build:css`
2. Upload all contents from `public/` to your hosting's `public_html/`
3. Dashboard accessible at `https://yourdomain.com/`

### Deploy Backend (Cloudflare Worker)

```bash
cd backend

# First time: login to Cloudflare
npx wrangler login

# Set API key as secret
npx wrangler secret put HT_API_KEY

# Deploy
npm run deploy
```

The Worker will be available at `https://landing-page-node-hosting.<your-subdomain>.workers.dev`.

> **Note**: Make sure the frontend's API call (`/api/get-status`) points to the correct Worker URL if hosted on different domains.

---

## 📖 API Documentation

### Base URL

```
https://your-worker.workers.dev
```

### Get Server Status

Retrieves server uptime, average response time, and location.

#### Request

```http
GET /api/get-status?monitor=MONITOR_ID
```

| Parameter | Type   | Required | Description            |
| --------- | ------ | -------- | ---------------------- |
| `monitor` | string | ✅ Yes   | HetrixTools monitor ID |

#### Success Response (200)

```json
{
  "uptime": "99.987",
  "average_response_time": 342,
  "location": "Jakarta, Indonesia"
}
```

| Field                   | Type   | Description                           |
| ----------------------- | ------ | ------------------------------------- |
| `uptime`                | string | Server uptime percentage              |
| `average_response_time` | number | Average response time in milliseconds |
| `location`              | string | Server location (City, Country)       |

#### Error Responses

| Status | Message                                  |
| ------ | ---------------------------------------- |
| 400    | Parameter "monitor" wajib diisi          |
| 404    | Data monitor atau lokasi tidak ditemukan |
| 500    | HT_API_KEY belum dikonfigurasi           |
| 502    | HetrixTools API error                    |

#### Example Usage

**cURL:**

```bash
curl "https://your-worker.workers.dev/api/get-status?monitor=YOUR_MONITOR_ID"
```

**JavaScript (Fetch):**

```javascript
const res = await fetch('/api/get-status?monitor=YOUR_MONITOR_ID');
const data = await res.json();

console.log('Uptime:', data.uptime);
console.log('Response Time:', data.average_response_time, 'ms');
console.log('Location:', data.location);
```

#### Cache Behavior

Responses include an `X-Cache` header:

| Value  | Description                           |
| ------ | ------------------------------------- |
| `HIT`  | Served from cache                     |
| `MISS` | Fresh response, cached for 60 seconds |

---

## 🛠️ Tech Stack

### Frontend

| Technology             | Version | Purpose                     |
| ---------------------- | ------- | --------------------------- |
| **HTML5**              | -       | Structure                   |
| **Tailwind CSS**       | 4.2     | Utility-first CSS framework |
| **Vanilla JavaScript** | -       | Client-side logic           |

### Backend

| Technology             | Version | Purpose                   |
| ---------------------- | ------- | ------------------------- |
| **Cloudflare Workers** | -       | Edge serverless runtime   |
| **Wrangler**           | 4.67+   | Cloudflare dev/deploy CLI |

### Development Tools

| Technology           | Version | Purpose        |
| -------------------- | ------- | -------------- |
| **@tailwindcss/cli** | 4.2     | CSS build tool |
| **Prettier**         | 3.8+    | Code formatter |

---

## 🎨 Design Features

- **Glassmorphism**: Modern blur effect with `backdrop-blur-xl`
- **Gradient Backgrounds**: Purple and indigo color scheme
- **Animated Elements**: Ping animation for status indicator
- **Grid Pattern**: Subtle CSS background pattern for depth
- **Responsive Layout**: Mobile-first with `md:grid-cols-2`
- **SVG Icons**: Heroicons for clean vector graphics

---

## 🔒 Security Notes

- ✅ API keys stored as Cloudflare secrets (never exposed to frontend)
- ✅ Worker acts as a proxy to hide third-party API credentials
- ✅ CORS configurable with wildcard subdomain support
- ✅ Response caching reduces upstream API exposure
- ✅ Dashboard has `noindex, nofollow` meta tags
- ✅ `robots.txt` disallows all crawlers

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact & Support

- **GitHub**: [Akselerasi Prima Digital](https://github.com/Akselerasi-Prima-Digital)
- **Repository**: [Landing-Page-Node-Hosting](https://github.com/Akselerasi-Prima-Digital/Landing-Page-Node-Hosting)

---

<div align="center">

**Built with ❤️ using Cloudflare Workers and modern web technologies**

If this project helped you, consider giving it a ⭐!

</div>
