# 🚀 Chariot AI - Result-as-a-Service Marketing Platform

<div align="center">

![Chariot AI Logo](https://img.shields.io/badge/Chariot-AI-9B87F5?style=for-the-badge&logo=lightning&logoColor=white)

**AI-Powered Marketing Automation That Delivers Results, Not Tasks**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

## 🌟 What is Chariot AI?

Chariot is a **Result-as-a-Service** digital marketing platform that completely automates Facebook and Instagram advertising. Users simply describe their product, and Chariot handles everything else - from AI-generated creatives to campaign optimization and performance reporting.

### 🎯 **The Promise: Focus on Outcomes, Not Process**

- **Input**: Product description + budget
- **Output**: Live campaigns generating real results
- **Everything Else**: Fully automated by AI

---

## ✨ Key Features

### 🤖 **AI-Powered Content Generation**
- **Smart Ad Copy**: Kenny Nwokoye-style persuasive copywriting
- **3D Product Renders**: Professional product images using DALL-E 3
- **Creative Optimization**: Automatic A/B testing and performance enhancement

### 🚀 **Automated Campaign Management**
- **One-Click Launch**: From product to live campaign in minutes
- **Meta Ads Integration**: Direct Facebook/Instagram campaign deployment
- **Smart Targeting**: AI-optimized audience selection and bidding

### 📊 **Real-Time Analytics & Optimization**
- **Live Performance Tracking**: WebSocket-powered real-time updates
- **Automated Alerts**: Instant notifications for leads and conversions
- **ROI Optimization**: Continuous campaign performance improvements

### 🛠️ **Enterprise-Grade Platform**
- **Multi-Platform Support**: Facebook, Instagram (TikTok coming soon)
- **User Management**: Secure authentication and profile management
- **Report Generation**: Professional PDF reports and data exports

---

## 🏗️ Tech Stack

### **Frontend**
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development
- **Tailwind CSS** + **Shadcn/ui** for modern UI
- **TanStack React Query** for efficient data fetching
- **React Router DOM** for routing with protected routes

### **Backend & Infrastructure**
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL** with row-level security
- **Meta Ads API** for campaign management
- **OpenAI API** for AI content generation

### **Additional Technologies**
- **TypeScript** for full type safety
- **Zod** for schema validation
- **React Hook Form** for form management
- **Recharts** for data visualization
- **WebSocket** for real-time updates

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **OpenAI API Key** ([Get yours](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/chariot-ai-command-center.git
cd chariot-ai-command-center

# Install dependencies
npm install
# OR for faster installation
bun install

# Create environment file
cp .env.example .env
```

### Environment Configuration

Create a `.env` file in the project root:

```env
# Required: OpenAI API for AI features
VITE_OPENAI_API_KEY=sk-your_openai_api_key_here

# Optional: API Configuration (has defaults)
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:8080

# Optional: Facebook/Meta Ads (for live campaigns)
VITE_FACEBOOK_ACCESS_TOKEN=your_facebook_access_token
VITE_FACEBOOK_AD_ACCOUNT_ID=act_xxxxxxxxxxxxxx
```

### Start Development Server

```bash
npm run dev
# OR
bun dev
```

🎉 **Open [http://localhost:5173](http://localhost:5173)** to see Chariot AI in action!

---

## 📖 Usage Guide

### 1. **Account Setup**
- Sign up for a new account
- Complete your profile in Settings
- Add your OpenAI API key for AI features

### 2. **Product Management**
- Navigate to **Add Product**
- Describe your product (name, description, price)
- Let AI generate compelling ad copy and product images

### 3. **Campaign Creation**
- Click **Create Campaign** from any product
- Set budget and target audience
- Choose campaign objectives (awareness, traffic, conversions)
- Launch immediately or save as draft

### 4. **Performance Monitoring**
- View real-time metrics on the Dashboard
- Receive instant notifications for new leads
- Monitor ROI, ROAS, and campaign performance
- Export detailed PDF reports

### 5. **Platform Connections**
- Connect Facebook/Instagram accounts in **Platform Connections**
- Verify ad account permissions
- Enable live campaign deployment

---

## 🗂️ Project Structure

```
chariot-ai-command-center/
├── public/                  # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Shadcn/ui base components
│   │   ├── layout/        # Layout components (Sidebar, Header)
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── campaign/      # Campaign management components
│   │   └── ...
│   ├── pages/             # Route components
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   ├── CampaignCreation.tsx
│   │   ├── Reports.tsx
│   │   └── ...
│   ├── services/          # Business logic & API calls
│   │   ├── auth/         # Authentication services
│   │   ├── products/     # Product management
│   │   ├── campaigns/    # Campaign operations
│   │   └── platforms/    # Platform integrations
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── integrations/     # Third-party integrations
├── supabase/             # Database migrations and config
├── package.json
└── README.md
```

---

## 🔧 Configuration

### OpenAI API Setup

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create account and generate API key
3. Add to your `.env` file as `VITE_OPENAI_API_KEY`

### Facebook/Meta Ads Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app and get access token
3. Configure ad account permissions
4. Add credentials to `.env` file

### Supabase Configuration

The project includes a pre-configured Supabase instance. For your own setup:

1. Create project at [Supabase](https://supabase.com/)
2. Update `src/integrations/supabase/client.ts`
3. Run migrations: `npx supabase db push`

---

## 🎨 Features in Detail

### **AI Content Generation**
- **Persuasive Copywriting**: Based on proven Kenny Nwokoye methodology
- **Professional Imagery**: 3D product renders with studio lighting
- **Automatic Optimization**: Continuous improvement based on performance

### **Campaign Automation**
- **Smart Bidding**: AI-optimized bid strategies
- **Audience Targeting**: Demographic and interest-based targeting
- **Performance Monitoring**: Real-time metrics and alerts

### **Analytics & Reporting**
- **Live Dashboard**: Real-time campaign performance
- **Conversion Tracking**: Lead and sales attribution
- **ROI Analysis**: Detailed profitability insights
- **Export Capabilities**: PDF reports and data downloads

---

## 🚨 Troubleshooting

### Common Issues

**1. Development server won't start**
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**2. OpenAI API errors**
- Verify API key is correct in `.env`
- Check API usage limits and billing
- Restart development server after adding keys

**3. Supabase connection issues**
- Check internet connection
- Verify project URL and keys
- Check Supabase service status

**4. Facebook API errors**
- Verify access token permissions
- Check ad account access
- Ensure app is not in development mode

### Getting Help

- 📧 **Email**: support@chariot-ai.com
- 💬 **Discord**: [Join our community](https://discord.gg/chariot-ai)
- 📖 **Documentation**: [Full docs](https://docs.chariot-ai.com)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT and DALL-E APIs
- **Meta** for Ads API integration
- **Supabase** for backend infrastructure
- **Shadcn/ui** for beautiful components
- **Kenny Nwokoye** for copywriting methodology

---

<div align="center">

**Built with ❤️ by the Chariot AI Team**

[Website](https://chariot-ai.com) • [Documentation](https://docs.chariot-ai.com) • [Support](mailto:support@chariot-ai.com)

</div>

