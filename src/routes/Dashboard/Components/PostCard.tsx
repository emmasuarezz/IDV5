import { useRef } from "react";
import styles from "../../../styles/Components/postcard.module.scss";
import { Post } from "../../../routes/Dashboard/Dashboard";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";

function PostCard({ post, profile }: { post: Post; profile?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();
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
          handlePlay();
        }}
        onMouseLeave={() => {
          handlePause();
        }}
        onClick={() => navigate(`/post/${post.id}`)}
        src={post.selected.cover}
        alt=""
      />
      {profile ? null : (
        <img
          onClick={() => {
            if (auth.currentUser?.uid === post.uid) {
              navigate("/profile");
            } else {
              navigate(`/userProfile/${post.uid}`);
            }
          }}
          className={styles.avatarUser}
          src={post.userAvatar ? post.userAvatar : ""}
          alt=""
        />
      )}

      <audio ref={audioRef} src={post.selected.preview} style={{ display: "hidden" }}></audio>
    </div>
  );
}

export default PostCard;
