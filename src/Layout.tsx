import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "./hooks/UseAuth";
import { useUserContext } from "./contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import styles from "./styles/layout.module.scss";
import utils from "./styles/utils.module.scss";
import github from "./assets/githubIcon.png";
import linkedin from "./assets/linkedinIcon.png";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const [menuClicked, setMenuClicked] = useState(false);

  //change the active link in the sidebar
  const changeActiveLink = (e: React.MouseEvent<HTMLLIElement>, where: string) => {
    const links = document.querySelectorAll("nav ul li");
    links.forEach((link) => {
      const htmlLink = link as HTMLElement;
      const linkName = htmlLink.dataset.name;
      if (linkName !== where) {
        if (htmlLink.classList.contains(styles.active)) {
          htmlLink.classList.remove(styles.active);
          htmlLink.classList.add(styles.inactive);
        }
      }
    });
    (e.target as HTMLElement).classList.remove(styles.inactive);
    (e.target as HTMLElement).classList.add(styles.active);
  };
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(undefined);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.username === undefined || user?.username === "NEWUSER") {
      navigate("/profileSetup");
    }
  }, [user]);

  return (
    <>
      <div className={`${utils.flexCol}  ${utils.p1} ${utils.hScreen}`}>
        <section className={styles.sidebar}>
          <div onClick={() => setMenuClicked(!menuClicked)} className={styles.hamburger}>
            {menuClicked ? "X" : "|||"}
          </div>
          {menuClicked && (
            <div className={styles.hamburger_menu}>
              <p onClick={() => handleSignOut()}>Sign out?</p>
              <p>Notifications</p>
            </div>
          )}
          <nav>
            <ul>
              <Link to="/dashboard">
                <li className={styles.active} data-name="dash" onClick={(e) => changeActiveLink(e, "dash")}>
                  Dashboard
                </li>
              </Link>
              <Link to={"/addPost"}>
                <li className={styles.inactive} data-name="post" onClick={(e) => changeActiveLink(e, "post")}>
                  Search
                </li>
              </Link>
            </ul>
          </nav>

          <div className={styles.avatarWrapper}>
            <div className={styles.imgWrapper}>
              <Link to={"/profile"}>
                <img src={user?.avatar} alt="" />
              </Link>
            </div>
          </div>
        </section>
        <div className={styles.main}>{children}</div>
        <footer className={utils.mt_auto}>
          <h3>
            Made with love by{" "}
            <a href="https://tenzo.tech" target="_blank">
              Tenzo
            </a>{" "}
          </h3>
          <div className={styles.socials}>
            <img onClick={() => window.open("https://github.com/emmasuarezz", "_blank")} src={github} alt="" />{" "}
            <img
              onClick={() => window.open("https://www.linkedin.com/in/emmanuelsuarezt/", "_blank")}
              src={linkedin}
              alt=""
            />
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
