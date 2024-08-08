import Link from "next/link";
import styles from "../styles/Header.module.css";
import jecLogo from "../assets/jeclogo2.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
const Header = () => (
  <nav className={styles.nav}>
    <div className={styles.logoContainer}>
      <Image src={jecLogo} alt="JEC Logo" width={100} height={80} />
    </div>
    <h1 style={{ color: "white" }}>Ashesi JEC Management System</h1>
    <ul className={styles.navList}>
      <li className={styles.navItem}>
        <Link href="/portals" legacyBehavior>
          <a className={styles.navLink}>Information Portal</a>
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link href="/attendance" legacyBehavior>
          <a className={styles.navLink}>Attendance</a>
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link href="/scheduler" legacyBehavior>
          <a className={styles.navLink}>Scheduler</a>
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link href="/voting" legacyBehavior>
          <a className={styles.navLink}>Elections</a>
        </Link>
      </li>

      <li className={styles.navItem}>
        <Link href="/auth/logout" legacyBehavior>
          <a className={styles.navLink}>
            {" "}
            <div style={styles.navIcon}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
          </a>
        </Link>
      </li>
    </ul>
  </nav>
);

export default Header;
