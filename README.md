# 🎵 Kabloo - A Modern TikTok Clone

Kabloo is a full-stack video sharing platform inspired by TikTok, built with modern web technologies. Share moments, discover content, and connect with creators in a seamless, engaging experience.

## ✨ Features

### Core Features
- 📱 Responsive, mobile-first design
- 🎥 Vertical video feed with smooth scrolling
- 👤 User profiles and authentication
- ❤️ Like and comment on videos
- 🔄 Follow/unfollow creators
- 🎬 Video upload with captions

### Technical Highlights
- 🚀 Next.js 14 with App Router
- 🎨 Tailwind CSS for styling
- 🔐 Clerk for authentication
- 🗄️ Prisma with PostgreSQL
- ☁️ AWS S3 for video storage (UploadThing)
- 🔄 Real-time updates for likes and comments

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Storage**: AWS S3
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- AWS Account
- Clerk Account

### Installation

1. Clone the repository:

```bash

git clone https://github.com/yourusername/kabloo-tiktok-clone.git
cd kabloo-tiktok-clone

```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
DATABASE_URL="your-postgresql-url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
UPLOADTHING_SECRET="your-uploadthing-secret-key"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
UPLOADTHING_TOKEN="your-uploadthing-token"
CLERK_WEBHOOK_SECRET="your-clerk-webhook-secret"

```

5. Run database migrations:

```bash

npx prisma migrate dev

```

6. Start the development server:

```bash
npm run dev
```


## 📱 Core Functionality

### Video Feed
- Infinite scroll video feed
- Auto-play when in view
- Like and comment interactions
- Share functionality

### User Profiles
- Customizable avatars
- Video grid layout
- Follow/unfollow mechanism
- Stats tracking (followers, following, likes)

### Video Upload
- Drag and drop interface
- Caption support
- Progress tracking
- AWS S3 integration

## 🎯 Future Enhancements

- [ ] Video effects and filters
- [ ] Direct messaging
- [ ] Hashtag system
- [ ] Trending page
- [ ] Music library integration
- [ ] Enhanced video editing tools

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Inspired by TikTok's user experience
- Built with modern web technologies
- Community feedback and contributions

---

Built with ❤️ by [Pranav Chhabra]

