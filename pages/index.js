import React from "react";
import Image from "next/image"; // Assuming you're using Next.js
import Link from "next/link";
import styles from "../styles/HomePage.module.css";
import councilImage from "../assets/jeclogo.png"; // Replace with your actual image path

function HomePage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.textContainer}>
          <h1>Empowering Justice and Electoral Integrity</h1>
          <p>
            Ensuring fair and transparent elections with our state-of-the-art
            management system.
          </p>
          <Link href="/auth/login">
            <button className={styles.joinButton}>Log In</button>
          </Link>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src={councilImage}
            alt="Judicial and Electoral Council"
            width={400}
            height={400}
          />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
