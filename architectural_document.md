# Software Architecture Document
**Small Business Financial Tracker with Google Sheets Integration**

---

## Table of Contents
1. [High-Level Application Overview](#high-level-application-overview)
2. [System Architecture](#system-architecture)
3. [Component Architecture](#component-architecture)
4. [Data Models](#data-models)
5. [Core Workflows](#core-workflows)
6. [Technology Stack](#technology-stack)
7. [External Integrations](#external-integrations)
8. [Security Architecture](#security-architecture)
9. [Performance Considerations](#performance-considerations)
10. [Deployment Architecture](#deployment-architecture)

---

## High-Level Application Overview

### Purpose
The Small Business Financial Tracker is a cloud-native financial management platform designed specifically for small retail businesses, particularly watch resellers. It provides real-time financial analytics, inventory management, and transaction tracking with Google Sheets as the persistent data storage backend.

### Key Capabilities
- **Real-time Transaction Management**: Record sales and expenses with immediate Google Sheets synchronization
- **Financial Analytics Engine**: Calculate ROI, profit margins, inventory turnover, and business performance metrics
- **Inventory Management**: Track stock levels with automatic updates and overselling prevention
- **Cloud Data Persistence**: Leverage Google Sheets for data storage, backup, and cross-platform accessibility
- **Visual Analytics**: Interactive charts and dashboards for business insights
- **Multi-device Support**: Responsive design for desktop, tablet, and mobile usage

### Target Users
- **Primary**: Small business owners (watch resellers, retail entrepreneurs)
- **Secondary**: Business accountants, financial advisors, and stakeholders

---

## System Architecture

### High-Level System Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Frontend Application]
        PWA[Progressive Web App]
    end
    
    subgraph "Application Layer"
        APP[App.tsx - Main Application]
        GM[GoogleSheetsManager - Integration Wrapper]
        HOOKS[Custom React Hooks]
        COMP[UI Components]
    end
    
    subgraph "Service Layer"
        GS[GoogleSheetsService]
        CONFIG[Configuration Management]
        UTILS[Utility Functions]
    end
    
    subgraph "External Services"
        GAPI[Google Sheets API v4]
        GSHEETS[(Google Sheets Database)]
        GCP[Google Cloud Platform]
    end
    
    subgraph "Development & Build"
        VITE[Vite Build System]
        TS[TypeScript Compiler]
        NODE[Node.js Runtime]
    end
    
    UI --> APP
    APP --> GM
    GM --> HOOKS
    HOOKS --> GS
    GS --> GAPI
    GAPI --> GSHEETS
    GSHEETS --> GCP
    
    APP --> COMP
    GS --> CONFIG
    
    VITE --> TS
    VITE --> NODE
```

### Architecture Patterns
- **Component-Based Architecture**: React functional components with hooks for state management
- **Service-Oriented Design**: Separation of concerns with dedicated service classes
- **Render Props Pattern**: GoogleSheetsManager uses render props for flexible integration
- **Repository Pattern**: GoogleSheetsService abstracts data access operations
- **Observer Pattern**: React hooks for state synchronization across components

---

## Component Architecture

### Frontend Component Hierarchy

```mermaid
graph TD
    subgraph "Root Level"
        APP[App.tsx]
    end
    
    subgraph "Integration Layer"
        GM[GoogleSheetsManager]
        HOOK[useGoogleSheets Hook]
    end
    
    subgraph "Business Logic"
        AL[AppWithGoogleSheets]
        CONV[Data Converters]
    end
    
    subgraph "UI Components"
        MODAL[Modal Components]
        FORMS[Form Components]
        CHARTS[Chart Components]
        STATS[Stat Cards]
        TABLE[Transaction Table]
    end
    
    subgraph "Service Layer"
        GS[GoogleSheetsService]
        CONFIG[Configuration]
    end
    
    APP --> GM
    GM --> HOOK
    GM --> AL
    AL --> MODAL
    AL --> FORMS
    AL --> CHARTS
    AL --> STATS
    AL --> TABLE
    AL --> CONV
    HOOK --> GS
    GS --> CONFIG
```

### Core Components

#### 1. **App.tsx** (Main Application Container)
- **Purpose**: Root application component and main business logic
- **Responsibilities**:
  - State management for business settings
  - Financial calculations and analytics
  - Modal state management
  - Data transformation and aggregation
- **Key Features**:
  - React hooks for state management
  - Memoized calculations for performance
  - Event handling for CRUD operations

#### 2. **GoogleSheetsManager.tsx** (Integration Wrapper)
- **Purpose**: Manages Google Sheets integration and provides setup UI
- **Responsibilities**:
  - Configuration validation
  - Setup wizard for unconfigured instances
  - Error handling and user feedback
  - Loading states and sync indicators
- **Pattern**: Render Props for flexible child component integration

#### 3. **useGoogleSheets.ts** (Data Management Hook)
- **Purpose**: Custom React hook for Google Sheets operations
- **Responsibilities**:
  - CRUD operations (Create, Read, Update, Delete)
  - State synchronization between UI and Google Sheets
  - Error handling and loading states
  - Data validation and ID generation

#### 4. **GoogleSheetsService.ts** (Data Access Layer)
- **Purpose**: Service class for Google Sheets API interactions
- **Responsibilities**:
  - Google Sheets API communication
  - Data serialization/deserialization
  - Batch operations and performance optimization
  - Error handling and retry logic

---

## Data Models

### Core Data Entities

```mermaid
erDiagram
    TransactionRow {
        string id PK
        string date
        number amount
        string type
        number quantity
        string description
    }
    
    Transaction {
        string id PK
        string date
        number amount
        string type
        number quantity
        string description
    }
    
    Expense {
        string id PK
        string date
        number amount
        string type
        string description
    }
    
    SettingsType {
        number initialInvestment
        number watchCost
        number watchPrice
    }
    
    FinancialData {
        number totalSales
        number totalExpenses
        number cogs
        number grossProfit
        number netProfit
        number roi
        number profitMargin
    }
    
    InventoryData {
        number initialWatches
        number watchesSold
        number inventory
    }
    
    TransactionRow ||--|| Transaction : "type=sale"
    TransactionRow ||--|| Expense : "type=expense"
    Transaction }|--|| SettingsType : "uses for pricing"
    Expense }|--|| SettingsType : "impacts calculations"
```

### Data Model Specifications

#### **TransactionRow Interface**
```typescript
interface TransactionRow {
  id: string;           // Unique identifier (timestamp + random)
  date: string;         // ISO timestamp
  amount: number;       // Dollar amount (positive)
  type: 'sale' | 'expense'; // Transaction type
  quantity?: number;    // Items sold (sales only)
  description: string;  // Transaction description
}
```

#### **Business Settings Interface**
```typescript
interface SettingsType {
  initialInvestment: number; // Initial capital investment
  watchCost: number;        // Cost per unit (COGS)
  watchPrice: number;       // Selling price per unit
}
```

#### **Financial Analytics Interface**
```typescript
interface FinancialData {
  totalSales: number;     // Sum of all sales revenue
  totalExpenses: number;  // Sum of all expenses
  cogs: number;          // Cost of goods sold
  grossProfit: number;   // Revenue - COGS
  netProfit: number;     // Gross profit - expenses - initial investment
  roi: number;           // Return on investment percentage
  profitMargin: number;  // Gross profit margin percentage
}
```

### Data Flow Architecture

```mermaid
sequenceDiagram
    participant UI as User Interface
    participant Hook as useGoogleSheets
    participant Service as GoogleSheetsService
    participant API as Google Sheets API
    participant Sheet as Google Sheets
    
    UI->>Hook: Add Transaction
    Hook->>Hook: Generate ID
    Hook->>Service: addTransaction()
    Service->>API: sheets.spreadsheets.values.append()
    API->>Sheet: Insert Row
    Sheet-->>API: Success Response
    API-->>Service: API Response
    Service-->>Hook: Success
    Hook->>Hook: Refresh Data
    Hook->>Service: getAllTransactions()
    Service->>API: sheets.spreadsheets.values.get()
    API->>Sheet: Fetch Data
    Sheet-->>API: Raw Data
    API-->>Service: Raw Response
    Service->>Service: Transform Data
    Service-->>Hook: Typed Transactions
    Hook-->>UI: Updated State
```

---

## Core Workflows

### 1. Transaction Recording Workflow

```mermaid
flowchart TD
    START([User Clicks Record Sale/Expense]) --> MODAL[Open Modal Form]
    MODAL --> VALIDATE{Validate Input}
    VALIDATE -->|Invalid| ERROR[Show Error Message]
    VALIDATE -->|Valid| INVENTORY{Check Inventory}
    ERROR --> MODAL
    INVENTORY -->|Insufficient| INVMSG[Show Inventory Error]
    INVENTORY -->|Sufficient| SUBMIT[Submit Transaction]
    INVMSG --> MODAL
    SUBMIT --> HOOK[useGoogleSheets Hook]
    HOOK --> GENID[Generate Unique ID]
    GENID --> SERVICE[GoogleSheetsService]
    SERVICE --> API[Google Sheets API]
    API --> SHEETS[(Google Sheets)]
    SHEETS --> REFRESH[Refresh Local Data]
    REFRESH --> UPDATE[Update UI State]
    UPDATE --> CLOSE[Close Modal]
    CLOSE --> END([Workflow Complete])
```

### 2. Financial Analytics Calculation Workflow

```mermaid
flowchart TD
    TRIGGER([Data Change Trigger]) --> MEMO[React useMemo Hook]
    MEMO --> SALES[Calculate Total Sales]
    SALES --> EXPENSES[Calculate Total Expenses]
    EXPENSES --> INVENTORY[Calculate Inventory Metrics]
    INVENTORY --> COGS[Calculate Cost of Goods Sold]
    COGS --> GROSS[Calculate Gross Profit]
    GROSS --> NET[Calculate Net Profit]
    NET --> ROI[Calculate ROI Percentage]
    ROI --> MARGIN[Calculate Profit Margin]
    MARGIN --> CHART[Generate Chart Data]
    CHART --> RENDER[Re-render UI Components]
    RENDER --> END([Analytics Updated])
```

### 3. Google Sheets Synchronization Workflow

```mermaid
flowchart TD
    INIT([Application Initialize]) --> CONFIG{Check Configuration}
    CONFIG -->|Missing| SETUP[Show Setup Screen]
    CONFIG -->|Valid| VALIDATE[Validate API Key]
    SETUP --> RELOAD[User Configures & Reloads]
    RELOAD --> CONFIG
    VALIDATE -->|Invalid| ERROR[Show Error Message]
    VALIDATE -->|Valid| CONNECT[Connect to Google Sheets]
    ERROR --> SETUP
    CONNECT --> HEADERS{Check Headers}
    HEADERS -->|Missing| INIT_SHEET[Initialize Spreadsheet]
    HEADERS -->|Present| FETCH[Fetch Existing Data]
    INIT_SHEET --> FETCH
    FETCH --> TRANSFORM[Transform Raw Data]
    TRANSFORM --> SYNC[Sync to Local State]
    SYNC --> READY[Application Ready]
    READY --> END([Sync Complete])
```

### 4. Data Persistence Workflow

```mermaid
sequenceDiagram
    participant User
    participant UI as React UI
    participant Hook as useGoogleSheets
    participant Service as GoogleSheetsService
    participant Sheets as Google Sheets
    
    User->>UI: Perform Action (Add/Edit/Delete)
    UI->>Hook: Call Hook Method
    Hook->>Hook: Set Loading State
    Hook->>Service: Call Service Method
    
    alt Add Transaction
        Service->>Sheets: Append Row
    else Update Transaction
        Service->>Sheets: Update Specific Row
    else Delete Transaction
        Service->>Sheets: Delete Row
    end
    
    Sheets-->>Service: Operation Result
    Service-->>Hook: Success/Error Response
    Hook->>Hook: Clear Loading State
    
    alt Success
        Hook->>Service: Refresh All Data
        Service->>Sheets: Get All Transactions
        Sheets-->>Service: Fresh Data
        Service-->>Hook: Updated Dataset
        Hook->>UI: Update State
        UI->>User: Show Success & Updated Data
    else Error
        Hook->>UI: Show Error Message
        UI->>User: Display Error
    end
```

---

## Technology Stack

### Frontend Technology Stack

```mermaid
graph LR
    subgraph "Core Framework"
        REACT[React 19.1.0]
        TS[TypeScript 5.7.2]
        JSX[JSX/TSX]
    end
    
    subgraph "Build & Development"
        VITE[Vite 6.2.0]
        NODE[Node.js]
        NPM[NPM Package Manager]
    end
    
    subgraph "UI & Visualization"
        LUCIDE[Lucide React Icons]
        RECHARTS[Recharts 3.0.2]
        CSS[Tailwind CSS]
    end
    
    subgraph "External APIs"
        GOOGLEAPIS[Google APIs 150.0.1]
        GOOGLEAUTH[Google Auth Library 10.1.0]
    end
    
    REACT --> TS
    TS --> JSX
    VITE --> REACT
    REACT --> LUCIDE
    REACT --> RECHARTS
    REACT --> GOOGLEAPIS
    GOOGLEAPIS --> GOOGLEAUTH
```

### Detailed Technology Specifications

#### **Frontend Framework**
- **React 19.1.0**: Modern functional components with hooks
- **TypeScript 5.7.2**: Static typing for enhanced developer experience
- **JSX/TSX**: Component-based UI development

#### **Build System**
- **Vite 6.2.0**: Fast development server and optimized production builds
- **ES Modules**: Modern JavaScript module system
- **Hot Module Replacement**: Development-time hot reloading

#### **UI Libraries**
- **Lucide React 0.525.0**: Consistent iconography system
- **Recharts 3.0.2**: Interactive chart components
- **Custom CSS**: Tailwind-style utility classes for responsive design

#### **State Management**
- **React Hooks**: useState, useEffect, useMemo, useCallback
- **Custom Hooks**: useGoogleSheets for data management
- **Context-free Architecture**: Simplified state management

#### **External Integrations**
- **Google APIs 150.0.1**: Official Google services integration
- **Google Auth Library 10.1.0**: Authentication and authorization
- **Google Sheets API v4**: Spreadsheet data operations

---

## External Integrations

### Google Sheets Integration Architecture

```mermaid
graph TB
    subgraph "Application Layer"
        APP[React Application]
        HOOK[useGoogleSheets Hook]
        SERVICE[GoogleSheetsService]
    end
    
    subgraph "Configuration Layer"
        ENV[Environment Variables]
        CONFIG[Configuration Validation]
        KEYS[API Key Management]
    end
    
    subgraph "Google Cloud Platform"
        GAPI[Google Sheets API v4]
        AUTH[API Key Authentication]
        QUOTA[Rate Limiting & Quotas]
    end
    
    subgraph "Google Sheets"
        SPREADSHEET[(User's Spreadsheet)]
        SCHEMA[Data Schema]
        PERMISSIONS[Sharing Permissions]
    end
    
    APP --> HOOK
    HOOK --> SERVICE
    SERVICE --> ENV
    ENV --> CONFIG
    CONFIG --> KEYS
    
    SERVICE --> GAPI
    GAPI --> AUTH
    AUTH --> QUOTA
    QUOTA --> SPREADSHEET
    SPREADSHEET --> SCHEMA
    SPREADSHEET --> PERMISSIONS
```

### Integration Specifications

#### **API Authentication**
- **Method**: API Key-based authentication
- **Security**: Restricted to Google Sheets API only
- **Environment**: Stored in environment variables
- **Validation**: Runtime configuration validation

#### **Data Operations**
- **Create**: `sheets.spreadsheets.values.append()`
- **Read**: `sheets.spreadsheets.values.get()`
- **Update**: `sheets.spreadsheets.values.update()`
- **Delete**: `sheets.spreadsheets.batchUpdate()` with row deletion

#### **Rate Limiting & Performance**
- **Google API Quotas**: 100 requests per 100 seconds per user
- **Batch Operations**: Minimize API calls through batch processing
- **Caching Strategy**: Local state management to reduce API calls
- **Error Handling**: Exponential backoff for rate limit errors

---

## Security Architecture

### Security Layers

```mermaid
graph TD
    subgraph "Application Security"
        INPUT[Input Validation]
        SANITIZE[Data Sanitization]
        VALIDATE[Type Validation]
    end
    
    subgraph "API Security"
        APIKEY[API Key Protection]
        ENV[Environment Variables]
        RESTRICT[API Restrictions]
    end
    
    subgraph "Data Security"
        HTTPS[HTTPS Communication]
        SHEETS[Google Sheets Permissions]
        AUDIT[Audit Trail]
    end
    
    subgraph "Client Security"
        CSP[Content Security Policy]
        XSS[XSS Prevention]
        CORS[CORS Configuration]
    end
    
    INPUT --> SANITIZE
    SANITIZE --> VALIDATE
    APIKEY --> ENV
    ENV --> RESTRICT
    HTTPS --> SHEETS
    SHEETS --> AUDIT
    CSP --> XSS
    XSS --> CORS
```

### Security Measures

#### **API Key Security**
- **Environment Storage**: Never exposed in client-side code
- **API Restrictions**: Limited to Google Sheets API only
- **Version Control**: Excluded from repository commits
- **Development**: Separate keys for development and production

#### **Data Protection**
- **HTTPS Only**: All communications encrypted in transit
- **Input Validation**: All user inputs validated and sanitized
- **Type Safety**: TypeScript prevents type-related vulnerabilities
- **SQL Injection Prevention**: N/A (using Google Sheets, not SQL)

#### **Access Control**
- **Google Sheets Permissions**: Controlled via Google's sharing settings
- **Public Read Access**: Sheets accessible via link but not discoverable
- **API-only Write**: Application writes through API, not direct sheet access
- **Audit Trail**: All changes tracked with timestamps and user context

---

## Performance Considerations

### Performance Optimization Strategies

```mermaid
graph LR
    subgraph "Frontend Optimization"
        MEMO[React.memo & useMemo]
        LAZY[Lazy Loading]
        BATCH[Batch State Updates]
    end
    
    subgraph "API Optimization"
        CACHE[Local Caching]
        DEBOUNCE[Debounced Requests]
        MINIMUM[Minimize API Calls]
    end
    
    subgraph "Build Optimization"
        TREESHAKE[Tree Shaking]
        MINIFY[Code Minification]
        COMPRESS[Asset Compression]
    end
    
    subgraph "Runtime Optimization"
        VDOM[Virtual DOM]
        CONCURRENT[Concurrent Features]
        SUSPENSE[React Suspense]
    end
    
    MEMO --> CACHE
    CACHE --> TREESHAKE
    TREESHAKE --> VDOM
```

### Performance Metrics

#### **Frontend Performance**
- **First Contentful Paint**: Target < 1.5 seconds
- **Time to Interactive**: Target < 3 seconds
- **Bundle Size**: Optimized through Vite tree shaking
- **Memory Usage**: Efficient React component lifecycle

#### **API Performance**
- **Response Time**: Google Sheets API typically < 500ms
- **Throughput**: Limited by Google API quotas
- **Caching**: Local state reduces redundant API calls
- **Batch Operations**: Multiple operations combined when possible

#### **Data Performance**
- **Large Datasets**: Pagination or virtualization for >1000 transactions
- **Real-time Updates**: Optimistic UI updates with error rollback
- **Memory Management**: Proper cleanup of event listeners and subscriptions

---

## Deployment Architecture

### Deployment Pipeline

```mermaid
graph LR
    subgraph "Development"
        DEV[Local Development]
        GIT[Git Repository]
        BUILD[Vite Build]
    end
    
    subgraph "Static Hosting"
        VERCEL[Vercel]
        NETLIFY[Netlify]
        AWS[AWS S3 + CloudFront]
        GH[GitHub Pages]
    end
    
    subgraph "Runtime"
        CDN[Content Delivery Network]
        HTTPS[HTTPS Certificate]
        GZIP[Gzip Compression]
    end
    
    DEV --> GIT
    GIT --> BUILD
    BUILD --> VERCEL
    BUILD --> NETLIFY
    BUILD --> AWS
    BUILD --> GH
    
    VERCEL --> CDN
    NETLIFY --> CDN
    AWS --> CDN
    GH --> CDN
    
    CDN --> HTTPS
    HTTPS --> GZIP
```

### Deployment Specifications

#### **Build Process**
- **Static Site Generation**: Vite generates optimized static assets
- **Environment Variables**: Injected at build time for client-side usage
- **Asset Optimization**: Automatic minification, compression, and optimization
- **TypeScript Compilation**: Type checking and transpilation to JavaScript

#### **Hosting Options**
- **Vercel** (Recommended): Zero-config deployment with GitHub integration
- **Netlify**: Alternative with similar features and performance
- **AWS S3 + CloudFront**: Enterprise-grade scalability and custom domains
- **GitHub Pages**: Free hosting for open-source projects

#### **Environment Management**
- **Development**: Local `.env.local` file with development API keys
- **Production**: Platform-specific environment variable configuration
- **Security**: Separate API keys for each environment
- **Configuration**: Runtime environment detection

#### **Monitoring & Analytics**
- **Error Tracking**: Browser console monitoring for production issues
- **Performance Monitoring**: Web Vitals and user experience metrics
- **Usage Analytics**: User interaction patterns and feature adoption
- **API Monitoring**: Google Sheets API usage and error rates

---

## Conclusion

This architecture document provides a comprehensive overview of the Small Business Financial Tracker's technical design and implementation. The system follows modern web development best practices with a focus on:

- **Separation of Concerns**: Clear boundaries between UI, business logic, and data access
- **Type Safety**: TypeScript throughout the application for enhanced reliability
- **Performance**: Optimized rendering and minimal API calls
- **Security**: Proper API key management and data protection
- **Scalability**: Architecture supports growth and feature expansion
- **Maintainability**: Clean code structure and comprehensive documentation

The system successfully combines React's component-based architecture with Google Sheets' cloud storage capabilities to deliver a robust, accessible, and user-friendly financial management solution for small businesses.

---

**Document Version**: 1.0  
**Last Updated**: July 1, 2025  
**Next Review**: July 15, 2025  
**Author**: Senior Software Architect  
**Reviewers**: Product Team, Development Team
