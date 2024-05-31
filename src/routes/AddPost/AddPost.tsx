import styles from "../../styles/addPost.module.scss";
import { useState } from "react";
import useSearch from "../../hooks/UseSearch";
import { PreviewCard, Searchbar } from "./components";
import { MappedTrack, MappedAlbum } from "../../hooks/UseSearch";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

function AddPost() {
  const { setSearch, searchResults, setIsTrack, isTrack, isLoading } = useSearch();
  const [isPosting, setIsPosting] = useState(false);
  const [selected, setSelected] = useState<MappedTrack | MappedAlbum | undefined>(undefined);
  const [isTrackSelected, setIsTrackSelected] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useUserContext();
  const navigate = useNavigate();
  const submitPost = async () => {
    setIsPosting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const result = await fetch(`${import.meta.env.VITE_SERVER}/fb/createPost/${user?.uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          displayName: user?.displayName || "",
          title,
          message,
          selected,
        }),
      });
      const answer = await result.text();
      if (answer === "Success") {
        setTitle("");
        setMessage("");
        setSelected(undefined);
        setIsTrackSelected(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const trackSelectedPreview = (
    <section className={styles.selectionPreview}>
      <section className={styles.content}>
        <img src={selected ? selected.cover : ""} alt="" />
        <div>
          <h1>{selected ? selected.name : ""}</h1>
          <h2>{selected ? selected.album : ""}</h2>
          <p>{selected ? selected.artist : ""}</p>
        </div>
      </section>

      <button onClick={() => setIsTrackSelected(!isTrackSelected)}>{isTrackSelected ? "go back" : "continue"}</button>
    </section>
  );
  //if the track isn't selected, the route renders the search component
  const searchComponent = (
    <>
      <section className={styles.selectPost}>
        <h1 className={styles.title}>What are we sharing today?</h1>
        {/* Type of post selector */}
        <ul>
          <li className={isTrack ? styles.active : styles.notActive} onClick={() => setIsTrack(true)}>
            Track
          </li>
          <p>or</p>
          <li className={!isTrack ? styles.active : styles.notActive} onClick={() => setIsTrack(false)}>
            Album
          </li>
        </ul>
        <Searchbar setSearch={setSearch} isTrack={isTrack} />
      </section>

      {searchResults.length === 0 ? null : isLoading ? (
        <p className={styles.fetching}>searching!</p>
      ) : (
        <section className={styles.preview}>
          <h1 className={styles.title}>Results</h1>
          <section className={styles.results}>
            {searchResults.map((result) => (
              <PreviewCard key={result.uid} result={result} setSelected={setSelected} />
            ))}
          </section>
        </section>
      )}

      {selected && trackSelectedPreview}
    </>
  );
  //if it is selected, the route renders the create post component
  const createPostComponent = (
    <>
      {selected && trackSelectedPreview}
      <section className={styles.createPost}>
        <div>
          <h2>Add a title</h2>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" />
        </div>
        <div>
          <h2>Add a message</h2>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={192} />
        </div>
        <button onClick={() => submitPost()}>{isPosting ? "posting" : "add post"}</button>
      </section>
    </>
  );

  return <main>{!isTrackSelected ? searchComponent : createPostComponent}</main>;
}

export default AddPost;
