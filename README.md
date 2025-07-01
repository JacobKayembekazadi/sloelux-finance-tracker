# 📊 Small Business Financial Tracker

> **Cloud-native financial management platform for small retail businesses with Google Sheets integration**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff.svg)](https://vitejs.dev/)
[![Google Sheets API](https://img.shields.io/badge/Google%20Sheets-API%20v4-34a853.svg)](https://developers.google.com/sheets/api)

A modern, responsive financial tracking application designed specifically for small business owners. Track sales, expenses, inventory, and get real-time analytics with automatic Google Sheets synchronization.

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🚀 Quick Start](#-quick-start)
- [📖 User Guide](#-user-guide)
- [📋 Data Structure](#-data-structure)
- [🔒 Security & Best Practices](#-security--best-practices)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [👩‍💻 Development](#-development)
- [📚 Additional Resources](#-additional-resources)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## ✨ Key Features

### 💼 **Business Management**

- **📈 Real-time Analytics** - ROI, profit margins, inventory turnover metrics
- **📊 Interactive Dashboard** - Visual charts and performance insights  
- **📋 Transaction Management** - Quick sales and expense recording
- **📦 Inventory Tracking** - Automatic stock level updates and overselling prevention

### ☁️ **Cloud Integration**

- **🔄 Google Sheets Sync** - Automatic bidirectional data synchronization
- **🌐 Multi-device Access** - Use on desktop, tablet, or mobile
- **📤 Easy Data Sharing** - Share with accountants and stakeholders
- **💾 Automatic Backup** - Never lose your financial data

### 🎨 **User Experience**

- **⚡ Fast Performance** - Optimized for speed and responsiveness
- **📱 Mobile-first Design** - Works perfectly on all screen sizes
- **🔒 Secure** - API key protection and encrypted data transmission
- **🚀 Zero Setup** - Guided configuration wizard

## 🚀 Quick Start

> **⏱️ Total setup time: ~10 minutes**

### Prerequisites

- Node.js 18+ installed
- Google account access
- Modern web browser

### 🎯 One-Time Setup

#### 1️⃣ Clone and Install

```bash
git clone <repository-url>
cd sloelux-finance-tracker
npm install
```

#### 2️⃣ Configure Google Sheets API

<details>
<summary><strong>📋 Detailed Google Cloud Setup (Click to expand)</strong></summary>

1. **Create Google Cloud Project**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Click "Select a project" → "New Project"
   - Name your project (e.g., "Finance Tracker")
   - Click "Create"

2. **Enable Google Sheets API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

3. **Create API Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key ✅

4. **🔒 Secure Your API Key**
   - Click on your new API key to edit it
   - Under "API restrictions" → select "Restrict key"
   - Choose "Google Sheets API" from the list
   - Click "Save"

</details>

#### 3️⃣ Setup Google Spreadsheet

1. **Create New Spreadsheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Click "Blank" to create new spreadsheet
   - Rename to "Finance Tracker Database" (or your preference)

2. **Configure Sharing**
   - Click "Share" button (top-right)
   - Click "Change to anyone with the link"
   - Set to "Viewer" permissions
   - Click "Done"

3. **Get Spreadsheet ID**
   - Copy the long ID from your spreadsheet URL
   - Example: `docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMd...`**`/edit`

#### 4️⃣ Environment Configuration

1. **Create Environment File**
   ```bash
   cp .env.example .env.local
   ```

2. **Add Your Credentials**

   
   ```bash
   cp .env.example .env.local
   ```

2. **Add Your Credentials**
   
   ```env
   VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
   VITE_GOOGLE_SHEETS_ID=your_spreadsheet_id_here
   ```

#### 5️⃣ Launch Application

```bash
npm run dev
```

🎉 **That's it!** The app will automatically:

- Set up the Google Sheet with proper headers
- Show a guided setup if configuration is missing
- Sync all transactions bidirectionally
- Launch at `http://localhost:5173`

---

## 📖 User Guide

### 💰 Recording Transactions

| Action | How To | Result |
|--------|--------|--------|
| **Record Sale** | Click "Record a Sale" → Fill form → Submit | ✅ Revenue tracked, inventory updated |
| **Add Expense** | Click "Add Expense" → Enter details → Save | ✅ Expense logged, profit recalculated |
| **Edit Transaction** | Click pencil icon → Modify → Save changes | ✅ All metrics automatically updated |
| **Delete Transaction** | Click trash icon → Confirm deletion | ✅ Transaction removed, data recalculated |

### 📊 Dashboard Features

- **📈 Key Metrics**: Revenue, profit margin, ROI, inventory levels
- **📉 Interactive Charts**: Sales trends, expense breakdown, performance over time  
- **📋 Transaction History**: Complete log with search and filter capabilities
- **🔄 Real-time Sync**: All changes instantly saved to Google Sheets

### 🔄 Google Sheets Integration

- **📤 Automatic Sync**: Every action instantly updates your Google Sheet
- **👥 Collaboration**: Share sheet with accountants, advisors, stakeholders
- **📥 Manual Refresh**: Use refresh button to pull latest data
- **✏️ Direct Editing**: Edit data directly in Google Sheets (changes sync back)

---

## 📋 Data Structure

Your Google Sheet will automatically have these columns:

- **ID**: Unique identifier for each transaction
- **Date**: ISO timestamp of when the transaction occurred  
- **Amount**: Dollar amount of the transaction
- **Type**: Either "sale" or "expense"
- **Quantity**: Number of items sold (for sales only)
- **Description**: Text description of the transaction

---

## 🔒 Security & Best Practices

### 🛡️ API Key Security

| ⚠️ **DO** | ❌ **DON'T** |
|-----------|-------------|
| ✅ Store API keys in `.env.local` only | ❌ Commit `.env.local` to version control |
| ✅ Restrict API keys to Google Sheets API only | ❌ Use unrestricted API keys |
| ✅ Use separate keys for dev/production | ❌ Share API keys via email/chat |
| ✅ Regularly rotate API keys | ❌ Leave API keys in public repositories |

### 🔐 Data Protection

- **🌐 HTTPS Only**: All communications encrypted in transit
- **🔑 Access Control**: Google Sheets permissions via sharing settings  
- **👀 Public Read Access**: Sheet accessible via link but not discoverable
- **📝 Audit Trail**: All changes tracked with timestamps
- **🚫 No PII Storage**: Financial data only, no personal information

### 🏢 Production Recommendations

- Consider **OAuth2** instead of API keys for production deployments
- Implement **rate limiting** for high-volume usage
- Set up **monitoring** for API usage and errors
- Regular **security audits** of Google Cloud permissions

---

## 🛠️ Troubleshooting

### ❌ Common Issues

#### **"Configuration Error"**

**Symptoms**: App shows setup screen or configuration warning

**Solutions**:

- ✅ Verify `.env.local` file exists in project root
- ✅ Check API key is valid in Google Cloud Console
- ✅ Confirm spreadsheet ID is correct format  
- ✅ Restart development server after config changes

#### **"Failed to fetch transactions"**

**Symptoms**: Empty dashboard, sync errors, loading failures

**Solutions**:

- ✅ Verify Google Sheet is publicly accessible ("Anyone with link can view")
- ✅ Check Google Sheets API is enabled in Google Cloud project
- ✅ Confirm API key has correct permissions
- ✅ Test spreadsheet URL works in browser

#### **"Permission denied"**

**Symptoms**: 403 errors, access denied messages

**Solutions**:

- ✅ Ensure Google Sheet sharing is set to "Anyone with the link can view"
- ✅ Verify API key restrictions match your setup
- ✅ Check Google Cloud project has billing enabled (if required)
- ✅ Confirm API quotas aren't exceeded

### 🔧 Advanced Debugging

**Browser Console Errors**:

1. Open browser Developer Tools (F12)
2. Check Console tab for error messages
3. Look for network errors in Network tab
4. Copy error messages for support

**API Testing**:

```bash
# Test Google Sheets API access
curl "https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID?key=YOUR_API_KEY"
```

**Environment Verification**:

```bash
# Check if environment variables are loaded
npm run dev
# Look for "Configuration loaded" or similar messages
```

---

## 👩‍💻 Development

### 🏗️ Project Architecture

```plaintext
src/
├── components/
│   └── GoogleSheetsManager.tsx    # 🔌 Google Sheets integration wrapper
├── config/
│   └── googleSheets.ts            # ⚙️ Configuration and validation
├── hooks/
│   └── useGoogleSheets.ts         # 🪝 React hook for Google Sheets operations
├── services/
│   └── googleSheetsService.ts     # 🌐 Core Google Sheets API service
└── App.tsx                        # 🏠 Main application component
```

### 🚀 Available Scripts

| Command | Purpose | Usage |
|---------|---------|-------|
| `npm run dev` | 🏃‍♂️ Start development server | Local development with hot reload |
| `npm run build` | 🏗️ Build for production | Generates optimized static files |
| `npm run preview` | 👀 Preview production build | Test production build locally |

### 🔧 Tech Stack

- **Frontend**: React 19.1.0 + TypeScript 5.7.2
- **Build Tool**: Vite 6.2.0 (Lightning fast ⚡)
- **Charts**: Recharts 3.0.2 for interactive visualizations  
- **Icons**: Lucide React 0.525.0 for consistent iconography
- **API Integration**: Google APIs 150.0.1 + Google Auth Library 10.1.0

### 🧪 Testing

```bash
# Install development dependencies
npm install

# Run type checking
npx tsc --noEmit

# Check for linting issues  
npm run lint # (if configured)
```

---

## 📚 Additional Resources

### 📖 Documentation

- 📋 [Product Requirements Document](./product_requirements_document.md) - Detailed feature specifications
- 🏗️ [Architecture Document](./architectural_document.md) - Technical design and system overview
- 🔗 [Google Sheets API Documentation](https://developers.google.com/sheets/api)

### 🎓 Learning Resources

- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Google Cloud Console Basics](https://cloud.google.com/docs/overview)

### 🤝 Support & Community

- **🐛 Issues**: Report bugs or request features via GitHub Issues
- **💬 Discussions**: Join community discussions for help and ideas
- **📧 Email Support**: Contact the development team for urgent issues
- **📚 Wiki**: Check the project wiki for extended documentation

---

## 🚀 Deployment

### 🌐 Hosting Options

| Platform | Pros | Best For |
|----------|------|----------|
| **Vercel** | ✅ Zero-config, GitHub integration | Recommended for most users |
| **Netlify** | ✅ Easy setup, great performance | Alternative to Vercel |
| **AWS S3 + CloudFront** | ✅ Enterprise scale, full control | Large organizations |
| **GitHub Pages** | ✅ Free, simple setup | Open source projects |

### 🔄 CI/CD Pipeline

```yaml
# Example GitHub Actions workflow
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💾 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔀 Open** a Pull Request

### 📋 Code of Conduct

- Be respectful and inclusive
- Follow existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Sheets API** for providing robust cloud storage
- **React Team** for the amazing framework
- **Vite Team** for the lightning-fast build tool
- **Open Source Community** for inspiration and support

---

### Made with ❤️ for small business owners

Empower your business with data-driven insights

⭐ **Star this project** if it helps your business grow!
