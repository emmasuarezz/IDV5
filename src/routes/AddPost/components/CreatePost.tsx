import { useState } from "react";
import { auth } from "../../../firebase";
import { useUserContext } from "../../../contexts/UserContext";
import { MappedAlbum, MappedTrack } from "../../../hooks/UseSearch";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/addPost.module.scss";
import { TrackSelectedPreview } from ".";

export default function CreatePost({
  selected,
  setSelected,
  setIsTrackSelected,
  isTrackSelected,
}: {
  selected: MappedTrack | MappedAlbum | undefined;
  setSelected: (selected: MappedTrack | MappedAlbum | undefined) => void;
  setIsTrackSelected: (isTrackSelected: boolean) => void;
  isTrackSelected: boolean;
}) {
  const [isPosting, setIsPosting] = useState(false);
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

  return (
    <>
      {selected && (
        <TrackSelectedPreview
          selected={selected}
          setIsTrackSelected={setIsTrackSelected}
          isTrackSelected={isTrackSelected}
        />
      )}
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
}
