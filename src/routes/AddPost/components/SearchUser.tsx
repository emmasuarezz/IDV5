import styles from "../../../styles/addPost.module.scss";
import { Searchbar } from ".";
import { useSearchUser } from "../../../hooks/useSearchUser";
export default function SearchUser({ isUser, setIsUser }: { isUser: boolean; setIsUser: (isUser: boolean) => void }) {
  const { setSearch } = useSearchUser();
  return (
    <section className={styles.selectPost}>
      <h1 className={styles.title}>Who are we looking for?</h1>
      <ul>
        <li style={{ fontSize: "1.2rem" }} className={styles.notActive} onClick={() => setIsUser(false)}>
          go back to track/album search
        </li>
      </ul>

      <Searchbar setSearch={setSearch} isUser={isUser} />
    </section>
  );
}
