import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../lib/context/userContext";
import { ThemeContext } from "../../lib/context/themeContext";
import { ImSun } from "react-icons/im";
import { BiMoon } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import s from "./Navbar.module.css";
import Search from "../Search/Search"; // Import the search component

export default function Navbar() {
  const { user, username } = useContext(UserContext);
  const { theme, changeTheme } = useContext(ThemeContext);
  const [showSearch, setShowSearch] = useState(false);

  const handleThemeChange = () => {
    changeTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className={s.navbar}>
      <ul>
        <li className={s.brand}>
          <Link href="/" passHref>
            <img src="/devlog-logo.svg" height="56px" />
          </Link>
        </li>

        <li>
          <div onClick={() => setShowSearch(!showSearch)} className={s.searchIcon}>
            <FaSearch />
          </div>
        </li>

        {showSearch && <Search />} {/* Show Search when clicked */}

        <li className="push-left">
          <div onClick={handleThemeChange} className={s.switch}>
            {theme === "light" ? <BiMoon /> : <ImSun />}
          </div>
        </li>

        {username && (
          <>
            <li>
              <Link href="/admin">
                <button className="btn-accent">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img
                  className="rounded"
                  src={user?.photoURL || "/user.svg"}
                  height="48px"
                  width="48px"
                />
              </Link>
            </li>
          </>
        )}

        {!username && (
          <li>
            <Link href="/signin">
              <button className="btn-accent">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
