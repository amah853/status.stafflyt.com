# Stafflyt Status Page

A modern, responsive status page for monitoring Stafflyt's services and infrastructure, built with Next.js and matching the Stafflyt brand design.

## Overview

This repository contains both the status monitoring system (using Upptime for checks) and a custom Next.js frontend that displays service status in a beautiful, user-friendly interface that matches Stafflyt's brand design.

## Features

- 🎨 **Modern Design** - Matches Stafflyt's brand and design language perfectly
- 📊 **Real-time Monitoring** - Up-to-date service status information  
- 📱 **Responsive** - Works seamlessly on all devices (mobile, tablet, desktop)
- ⚡ **Fast** - Built with Next.js for optimal performance
- 🎯 **Accessible** - WCAG compliant design with semantic HTML
- 🔄 **Auto-Refresh** - Status updates every 60 seconds
- 📈 **Incident History** - Track service incidents and resolutions

## Technologies

### Frontend
- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful SVG icons

### Monitoring
- **Upptime** - GitHub Actions-powered uptime monitoring
- **GitHub Pages** - Free hosting for generated data

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with navigation
│   │   ├── page.tsx                # Main status dashboard
│   │   ├── incidents/
│   │   │   └── page.tsx            # Incident history page
│   │   ├── globals.css             # Global styles and animations
│   │   └── not-found.tsx           # 404 page
├── api/                            # Generated status data (from Upptime)
├── history/                        # Historical monitoring data
├── .upptimerc.yml                  # Upptime configuration
├── package.json                    # Dependencies
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── next.config.ts                  # Next.js configuration
```

## How It Works

1. **Monitoring**: Upptime runs scheduled checks every 5 minutes to ping the services and verify they're online
2. **Data Generation**: Response times are recorded and committed to git as JSON files
3. **Frontend**: The Next.js app fetches this data from GitHub and displays it beautifully
4. **Auto-Refresh**: The status page automatically refreshes data every 60 seconds

## Configuration

### Services

Edit `.upptimerc.yml` to configure which services to monitor:

```yaml
sites:
  - name: Stafflyt Web
    url: https://stafflyt.com
  - name: Stafflyt Backend
    url: https://stafflyt.com/api/health
  - name: Stafflyt Email Service
    url: https://stafflyt.com/api/health/email
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Other Platforms

- **Netlify**: Connect your GitHub repository
- **Railway**: Use the Next.js starter template
- **Self-hosted**: Build and run with Node.js

## Styling

The status page uses Tailwind CSS with colors that match Stafflyt:

```css
--primary: #0ea5e9       /* Sky blue */
--accent: #06b6d4        /* Cyan */
--success: #22c55e       /* Green */
--error: #ef4444         /* Red */
--warning: #f59e0b       /* Amber */
--dark: #0f172a          /* Dark slate */
--light: #fafbfc         /* Off white */
```

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, visit [Stafflyt](https://stafflyt.com) or check out our [GitHub](https://github.com/amah853/stafflyt)

---

**Status Page**: [status.stafflyt.com](https://status.stafflyt.com)
