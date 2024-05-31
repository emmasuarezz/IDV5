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

  const date = profile ? null : post.timestamp.toDate();
  const day = profile ? null : date!.getDate();
  const unformattedMonth = profile ? null : date!.toLocaleString("default", { month: "short" });
  const month = profile ? null : unformattedMonth!.charAt(0).toUpperCase() + unformattedMonth!.slice(1);

  return (
    <div
      onMouseEnter={() => {
        handleHoverEnter();
        handlePlay();
      }}
      onMouseLeave={() => {
        handleHoverLeave();
        handlePause();
      }}
      className={`${styles.postCard} ${
        hover ? (profile ? styles.profile_postCardHovered : styles.postCardHovered) : null
      }`}
    >
      <img src={post.selected.cover} alt="" />

      <div className={`${styles.topText} ${hover ? styles.isVisible : null}`}>
        <p className={styles.user}>{post.displayName}</p>
        {profile ? null : (
          <p className={styles.date}>
            On {month} {day}
          </p>
        )}
      </div>

      <audio ref={audioRef} src={post.selected.preview} style={{ display: "hidden" }}></audio>
    </div>
  );
}

export default PostCard;
