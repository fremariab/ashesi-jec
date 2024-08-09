import Link from "next/link";
import styles from "../styles/Header.module.css";
import jeclogo from "../assets/jeclogo2.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
const Header = () => (
  <nav className={styles.nav}>
    <div className={styles.logoContainer}>
      <Link href="/home" legacyBehavior>
        <a className={styles.navLink}>
          <Image src={jeclogo} alt="JEC Logo" width={100} height={80} />
        </a>
      </Link>{" "}
    </div>
    <h1 style={{ color: "white" }}>Ashesi JEC Management System</h1>
    <ul className={styles.navList}>
      <li className={styles.navItem}>
        <Link href="/admin/view-portals" legacyBehavior>
          <a className={styles.navLink}>Information Portal</a>
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link href="/admin/manage-attendance" legacyBehavior>
          <a className={styles.navLink}>Attendance</a>
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link href="/admin/manage-scheduling" legacyBehavior>
          <a className={styles.navLink}>Scheduler</a>
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
