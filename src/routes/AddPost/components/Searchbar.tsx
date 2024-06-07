import { useState } from "react";
import styles from "../../../styles/addPost.module.scss";

function Searchbar({
  setSearch,
  isTrack,
  isUser,
}: {
  setSearch: (search: string) => void;
  isTrack?: boolean;
  isUser?: boolean;
}) {
  const [inputValue, setInputValue] = useState<string>("");
  return (
    <div className={styles.inputWrapper}>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSearch(inputValue);
          }
        }}
        type="text"
        placeholder={`Search ${isUser ? "user" : isTrack ? "track" : "album"}`}
      />
      <button
        onClick={() => {
          setSearch(inputValue);
        }}
      >
        search
      </button>
    </div>
  );
}

export default Searchbar;
