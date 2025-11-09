# Techto.Earth

**Technology for Earthic & Ecologic Use Cases**

Techto.Earth is a mother company building intelligent tools and communities that bridge technology with sustainable living, personal transformation, and environmental stewardship.

## Our Products

### 🌱 EarthBridge
**Bridging Tech to Earth Careers**

A complete transition program helping tech professionals discover meaningful work in agriculture, farming, restaurants, and other fulfilling earth-based careers. Features include:
- Expert-led courses and training
- Networking events and farm tours  
- Community support groups

[Explore EarthBridge →](/career-path)

### 🌍 EcoLog
**Smart Environment Management**

Your intelligent companion for managing healthy, high-performance environments. From growing and production spaces to natural and living systems, EcoLog brings everything together in one smart dashboard. Features include:
- AI-powered environmental insights
- Real-time monitoring dashboard
- Automated alerts and recommendations
- Activity logging with photo and note integration
- Priority task management

[Explore EcoLog →](/ecolog)

## Database Schema Updates

### Adding the materials_url Field to Courses

To add the `materials_url` field to the courses table, run:

```bash
node scripts/add-materials-url-field.js
```

You will be prompted to enter your Supabase URL and service role key. This script will add a new column to store URLs for accessing online course materials.

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   # Create a .env.local file in the project root
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

## Google Authentication Setup

1. Run the Google Auth setup script to extract your credentials:
   ```bash
   node scripts/setup-google-auth.js
   ```

2. Follow the instructions provided by the script to configure Google Auth in Supabase.

3. Make sure your OAuth redirect URL is set correctly in both Google Cloud Console and Supabase:
   ```
   https://your-domain.com/api/auth/callback
   ```

## Deployment

Your project is live at:

**[https://vercel.com/hoomehrs-projects/v0-techto-earth-concept](https://vercel.com/hoomehrs-projects/v0-techto-earth-concept)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/5cl6CnRJ2T1](https://v0.dev/chat/projects/5cl6CnRJ2T1)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository