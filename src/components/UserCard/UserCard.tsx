import styles from "../../styles/Components/userCard.module.scss";
import utils from "../../styles/utils.module.scss";
import { Friend } from "../../hooks/useGetFriends";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function UserCard({ result }: { result: Friend }) {
  const navigate = useNavigate();
  return (
    <section className={styles.userResult}>
      <img src={result.thumbnail} alt={result.displayName} />
      <div>
        <h2>{result.displayName}</h2>
        <h3>@{result.username}</h3>
      </div>
      <button
        className={utils.cta}
        onClick={() => {
          if (auth.currentUser?.uid === result.uid) {
            navigate("/profile");
          } else {
            navigate(`/userProfile/${result.uid}`);
          }
        }}
      >
        go to profile
      </button>
    </section>
  );
}
