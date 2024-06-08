import styles from "../../../styles/addPost.module.scss";
import utils from "../../../styles/utils.module.scss";
import { Searchbar } from ".";
import { useSearchUser } from "../../../hooks/useSearchUser";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
export default function SearchUser({ isUser, setIsUser }: { isUser: boolean; setIsUser: (isUser: boolean) => void }) {
  const { setSearch, searchResults, isLoading } = useSearchUser();
  const navigate = useNavigate();
  return (
    <>
      <section className={styles.selectPost}>
        <h1 className={styles.title}>Who are we looking for?</h1>
        <ul>
          <li style={{ fontSize: "1.2rem" }} className={styles.notActive} onClick={() => setIsUser(false)}>
            go back to track/album search
          </li>
        </ul>

        <Searchbar setSearch={setSearch} isUser={isUser} />
      </section>
      {isLoading ? (
        <section className={utils.loadingState}>
          <h1>Searching for user...</h1>
          <h2>It won't take long</h2>
        </section>
      ) : searchResults.length > 0 ? (
        searchResults[0].id == "noUsers" ? (
          <section className={utils.loadingState}>
            <h1>couldn't find any user {":/"}</h1>
            <h2>try checking if you typed the username correctly, keep in mind it's case sensitive</h2>
          </section>
        ) : (
          <section className={`${styles.preview}`}>
            <h1 className={styles.title}>Results</h1>
            <section className={styles.results}>
              {searchResults.map((result) => (
                <section key={result.id} className={styles.userResult}>
                  <img src={result.avatar} alt={result.displayName} />
                  <div>
                    <h2>{result.displayName}</h2>
                    <h3>@{result.username}</h3>
                  </div>
                  <button
                    className={utils.cta}
                    onClick={() => {
                      if (auth.currentUser?.uid === result.id) {
                        navigate("/profile");
                      } else {
                        navigate(`/userProfile/${result.id}`);
                      }
                    }}
                  >
                    go to profile
                  </button>
                </section>
              ))}
            </section>
          </section>
        )
      ) : null}
    </>
  );
}
