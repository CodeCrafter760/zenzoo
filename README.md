# 🐼 ZenZoo

The live web application is available at:

**https://zenzoo.vercel.app**

**ZenZoo is a wellness and mindfulness app designed to help users build healthy habits, practice mindfulness, and take a moment to slow down.**

ZenZoo combines calming experiences, affirmations, stories, sounds, and wellness activities into one simple, kid-friendly experience.

## 🌿 Features

* 🧘 **Mindfulness & Wellness** — Activities designed to encourage mindfulness and relaxation
* 💭 **Daily Affirmations** — Positive affirmations users can listen to and revisit
* 📖 **Mindful Stories** — Calming audio stories designed for relaxation and reflection
* 🎵 **Relaxing Sounds** — Nature and lo-fi sounds for creating a peaceful environment
* 🐾 **ZenZoo Animals** — Explore and interact with different animal species
* 👤 **User Accounts** — Create an account and personalize your ZenZoo experience
* 🔐 **Authentication** — Email/password and Google Sign-In
* ☁️ **Supabase Integration** — Secure authentication and cloud data storage
* 📱 **Cross-Platform** — Built with Expo and React Native for web and mobile

## 🛠️ Built With

* **React Native**
* **Expo**
* **TypeScript**
* **Supabase**
* **React Navigation**
* **Vercel**
* **AsyncStorage**

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Expo CLI

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate into the project:

```bash
cd my-zenzoo-app
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your Supabase project credentials.

### Run the App

Start the Expo development server:

```bash
npm start
```

Run the web version:

```bash
npm run web
```

Run on iOS:

```bash
npm run ios
```

Run on Android:

```bash
npm run android
```

## 🌐 Web Deployment

ZenZoo's web version is deployed using Vercel.

Build the web version:

```bash
npm run build:web
```

This creates the production build in the `dist` directory.

To deploy to Vercel:

```bash
vercel --prod --archive=tgz
``

## 🔐 Authentication

ZenZoo uses **Supabase Auth** for user authentication.

Supported authentication methods include:

* Email & password
* Google Sign-In

Google authentication uses OAuth with PKCE for secure authentication.

## 📁 Project Structure

```text
my-zenzoo-app/
├── assets/
│   ├── Affirmation_audio/
│   ├── Species/
│   ├── Stories_audio/
│   └── sounds/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── screens/
│   ├── theme/
│   └── utils/
│
├── App.tsx
├── index.js
├── package.json
├── .env
└── README.md
```

## 🎯 Project Goals

ZenZoo aims to make mindfulness and wellness activities approachable, engaging, and enjoyable.

The project focuses on creating a calming digital environment where users can:

* Take a break
* Practice mindfulness
* Listen to calming audio
* Explore positive affirmations
* Develop healthy wellness habits

## 📌 Status

**Active Development**

ZenZoo is currently being developed and improved with new features, activities, content, and experiences.

## 👨‍💻 Author

**Kiaan Daxini**

Built with ❤️ using React Native, Expo, TypeScript, Supabase, and Vercel.

---

🐼 **Welcome to ZenZoo — take a breath, slow down, and explore.**
