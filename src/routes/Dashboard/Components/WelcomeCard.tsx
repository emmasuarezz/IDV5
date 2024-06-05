import React from "react";
import styles from "../../../styles/Components/welcomeCard.module.scss";
import utils from "../../../styles/utils.module.scss";
function WelcomeCard({ setShowWelcome }: { setShowWelcome: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <section className={styles.welcomeCard}>
      <h2>Welcome to tenzo.ID</h2>
      <p>
        Thanks for checking it out! I really appreciate your support.
        <br />
        Try to create a post and share that song you have been listening all day long
      </p>
      <button onClick={() => setShowWelcome(false)} className={utils.cta}>
        Got it!
      </button>
    </section>
  );
}

export default WelcomeCard;
