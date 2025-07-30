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
  const [destinations, setDestinations] = useState([]);
  const [newDestination, setNewDestination] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editCountry, setEditCountry] = useState("");

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedDestinations = localStorage.getItem("travelDestinations");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedDestinations) {
      setDestinations(JSON.parse(savedDestinations));
    }

    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save to localStorage whenever destinations or darkMode changes
  useEffect(() => {
    localStorage.setItem("travelDestinations", JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const addDestination = () => {
    if (newDestination.trim() && newCountry.trim()) {
      const destination = {
        id: Date.now(),
        name: newDestination.trim(),
        country: newCountry.trim(),
        visited: false,
        addedDate: new Date().toLocaleDateString()
      };
      setDestinations([...destinations, destination]);
      setNewDestination("");
      setNewCountry("");
    }
  };

  const deleteDestination = (id) => {
    setDestinations(destinations.filter(dest => dest.id !== id));
  };

  const toggleVisited = (id) => {
    setDestinations(destinations.map(dest =>
      dest.id === id ? { ...dest, visited: !dest.visited } : dest
    ));
  };

  const startEditing = (destination) => {
    setEditingId(destination.id);
    setEditText(destination.name);
    setEditCountry(destination.country);
  };

  const saveEdit = () => {
    if (editText.trim() && editCountry.trim()) {
      setDestinations(destinations.map(dest =>
        dest.id === editingId
          ? { ...dest, name: editText.trim(), country: editCountry.trim() }
          : dest
      ));
      setEditingId(null);
      setEditText("");
      setEditCountry("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditCountry("");
  };

  const filteredDestinations = destinations.filter(dest => {
    if (filter === "visited") return dest.visited;
    if (filter === "wishlist") return !dest.visited;
    return true;
  });

  const stats = {
    total: destinations.length,
    visited: destinations.filter(d => d.visited).length,
    wishlist: destinations.filter(d => !d.visited).length
  };

  return (
    <>
      <Head>
        <title>TravelList - Plan Your Adventures</title>
        <meta name="description" content="Plan your adventures, organize your trips, and never forget a destination again!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/globe.svg" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable} ${darkMode ? styles.dark : ''}`}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link href="/" className={styles.backButton}>← Back to Apps</Link>
            <h1 className={styles.title}>
              🌍 TravelList
            </h1>
            <p className={styles.subtitle}>
              Plan your adventures, organize your trips, and never forget a destination again!
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

        <main className={styles.main}>
          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.total}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.visited}</span>
              <span className={styles.statLabel}>Visited</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.wishlist}</span>
              <span className={styles.statLabel}>Wishlist</span>
            </div>
          </div>

          {/* Add new destination */}
          <div className={styles.addSection}>
            <h2>Add New Destination</h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Destination name (e.g., Paris, Tokyo)"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                className={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && addDestination()}
              />
              <input
                type="text"
                placeholder="Country"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                className={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && addDestination()}
              />
              <button
                onClick={addDestination}
                className={styles.addButton}
                disabled={!newDestination.trim() || !newCountry.trim()}
              >
                Add Destination
              </button>
            </div>
          </div>

          {/* Filter buttons */}
          <div className={styles.filterSection}>
            <button
              className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({stats.total})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'wishlist' ? styles.active : ''}`}
              onClick={() => setFilter('wishlist')}
            >
              Wishlist ({stats.wishlist})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'visited' ? styles.active : ''}`}
              onClick={() => setFilter('visited')}
            >
              Visited ({stats.visited})
            </button>
          </div>

          {/* Destinations list */}
          <div className={styles.destinationsSection}>
            {filteredDestinations.length === 0 ? (
              <div className={styles.emptyState}>
                <p>
                  {filter === 'all'
                    ? "No destinations yet. Start planning your next adventure!"
                    : filter === 'visited'
                    ? "No visited destinations yet. Time to start exploring!"
                    : "Your wishlist is empty. Add some dream destinations!"
                  }
                </p>
              </div>
            ) : (
              <div className={styles.destinationsList}>
                {filteredDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    className={`${styles.destinationCard} ${destination.visited ? styles.visited : ''}`}
                  >
                    {editingId === destination.id ? (
                      <div className={styles.editForm}>
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className={styles.editInput}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        />
                        <input
                          type="text"
                          value={editCountry}
                          onChange={(e) => setEditCountry(e.target.value)}
                          className={styles.editInput}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        />
                        <div className={styles.editActions}>
                          <button onClick={saveEdit} className={styles.saveButton}>
                            ✓
                          </button>
                          <button onClick={cancelEdit} className={styles.cancelButton}>
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.destinationInfo}>
                          <h3 className={styles.destinationName}>
                            {destination.visited ? '✅' : '📍'} {destination.name}
                          </h3>
                          <p className={styles.destinationCountry}>{destination.country}</p>
                          <p className={styles.destinationDate}>Added: {destination.addedDate}</p>
                        </div>
                        <div className={styles.destinationActions}>
                          <button
                            onClick={() => toggleVisited(destination.id)}
                            className={`${styles.actionButton} ${destination.visited ? styles.visitedButton : styles.wishlistButton}`}
                          >
                            {destination.visited ? 'Mark as Wishlist' : 'Mark as Visited'}
                          </button>
                          <button
                            onClick={() => startEditing(destination)}
                            className={styles.editButton}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteDestination(destination.id)}
                            className={styles.deleteButton}
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <footer className={styles.footer}>
          <p>Built with ❤️ for travelers and explorers</p>
        </footer>
      </div>
    </>
  );
}
