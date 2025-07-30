import styles from "@/styles/Home.module.css";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const apps = [
    {
      id: "travel",
      title: "🌍 TravelList",
      description: "Plan your adventures, organize your trips, and never forget a destination again!",
      features: ["Add & edit destinations", "Mark as visited/wishlist", "Filter & organize", "Dark mode support"],
      link: "/travel",
      gradient: "linear-gradient(135deg, #5568AA, #6D55AA, #5592AA)",
      icon: "🗺️"
    },
    {
      id: "todo",
      title: "✅ TodoApp",
      description: "Stay organized and productive with a simple yet powerful todo list application!",
      features: ["Add & edit tasks", "Mark as complete", "Priority levels", "Categories & filters"],
      link: "/todo",
      gradient: "linear-gradient(135deg, #6D55AA, #5592AA, #5568AA)",
      icon: "📋"
    },
    {
      id: "teamwork",
      title: "👥 TeamFlow",
      description: "Professional team collaboration and project management platform for modern teams!",
      features: ["Kanban boards", "Team collaboration", "Project management", "Real-time updates"],
      link: "/teamwork",
      gradient: "linear-gradient(135deg, #5592AA, #5568AA, #6D55AA)",
      icon: "🚀"
    }
  ];

  return (
    <>
      <Head>
        <title>TaskFlow Hub - Productivity Suite</title>
        <meta name="description" content="A comprehensive productivity suite including TravelList, TodoApp, and TeamFlow for modern professionals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.homePage} ${geistSans.variable} ${geistMono.variable} ${darkMode ? styles.dark : ''}`}>
        <header className={styles.homeHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.homeTitle}>
              🚀 TaskFlow Hub
            </h1>
            <p className={styles.homeSubtitle}>
              Professional productivity suite for modern teams and individuals
            </p>
            <button
              className={styles.darkModeToggle}
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <main className={styles.homeMain}>
          <div className={styles.appsGrid}>
            {apps.map((app) => (
              <Link key={app.id} href={app.link} className={styles.appCard}>
                <div className={styles.appCardInner}>
                  <div className={styles.appIcon} style={{ background: app.gradient }}>
                    {app.icon}
                  </div>
                  <div className={styles.appContent}>
                    <h2 className={styles.appTitle}>{app.title}</h2>
                    <p className={styles.appDescription}>{app.description}</p>
                    <ul className={styles.appFeatures}>
                      {app.features.map((feature, index) => (
                        <li key={index}>✨ {feature}</li>
                      ))}
                    </ul>
                    <div className={styles.appLaunch}>
                      <span>Launch App →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>


      </div>
    </>
  );
}
