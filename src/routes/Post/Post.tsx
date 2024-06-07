import { DeleteModal } from "./components";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post as PostType } from "../Dashboard/Dashboard";
import { auth } from "../../firebase";
import styles from "../../styles/post.module.scss";
import utils from "../../styles/utils.module.scss";

function Post() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { postID } = useParams();
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_SERVER}/fb/getPost/${postID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setCurrentPost(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    };

    fetchPost();
  }, [postID]);

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
  const handleNameClick = () => {
    if (currentPost?.uid == auth.currentUser?.uid) {
      navigate("/profile");
    } else {
      navigate(`/userProfile/${currentPost?.uid}`);
    }
  };

  if (isLoading) {
    return (
      <section className={utils.loadingState}>
        <h1>Loading post...</h1>
        <h2>It won't take long</h2>
      </section>
    );
  }

  return (
    <>
      {deleteModal && <DeleteModal id={postID || ""} setDeleteModal={setDeleteModal} />}
      <section className={styles.postContainer}>
        <section className={styles.postInfo}>
          <img
            onMouseEnter={() => {
              handlePlay();
            }}
            onMouseLeave={() => {
              handlePause();
            }}
            src={currentPost?.selected.cover}
            alt=""
          />
          <audio ref={audioRef} src={currentPost?.selected.preview} style={{ display: "hidden" }}></audio>
          <div>
            <h1>
              {currentPost?.selected ? currentPost?.selected.name : ""} // {currentPost?.selected.album}
            </h1>
            <h2>by {currentPost?.selected.artist}</h2>
          </div>
        </section>
        <section className={styles.postContent}>
          <h2 className={styles.displayName}>
            posted by <span onClick={() => handleNameClick()}>{currentPost?.displayName}</span>
          </h2>
          <h2>{currentPost?.title}</h2>
          <p>{currentPost?.message}</p>
          {auth.currentUser?.uid == currentPost?.uid && (
            <button
              className={`${styles.deletePost} ${utils.cta} ${utils.danger}`}
              onClick={() => setDeleteModal(true)}
            >
              delete post
            </button>
          )}
          <div></div>
        </section>
      </section>
    </>
  );
}

export default Post;
