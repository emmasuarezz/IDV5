import { useState, useRef } from "react";
import styles from "../../../styles/Components/postcard.module.scss";
import { Post } from "../../../routes/Dashboard/Dashboard";

function PostCard({ post, profile }: { post: Post; profile: boolean }) {
  const [hover, setHover] = useState(false);
  const handleHoverEnter = () => {
    setHover(true);
  };
  const handleHoverLeave = () => {
    setHover(false);
  };

  const audioRef = useRef<HTMLAudioElement>(null);
  const handlePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play();
    }
  };
  const handlePause = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  };

  return (
    <div className={`${styles.postCard}`}>
      <img
        onMouseEnter={() => {
          handleHoverEnter();
          handlePlay();
        }}
        onMouseLeave={() => {
          handleHoverLeave();
          handlePause();
        }}
        src={post.selected.cover}
        alt=""
      />
      <img className={styles.avatarUser} src={post.userAvatar ? post.userAvatar : ""} alt="" />

      <audio ref={audioRef} src={post.selected.preview} style={{ display: "hidden" }}></audio>
    </div>
  );
}

export default PostCard;
