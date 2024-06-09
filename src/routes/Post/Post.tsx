import { DeleteModal } from "./components";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post as PostType } from "../Dashboard/Dashboard";
import { auth } from "../../firebase";
import styles from "../../styles/post.module.scss";
import utils from "../../styles/utils.module.scss";
import heartFilled from "../../assets/heartFilled.png";
import heartEmpty from "../../assets/heartEmpty.png";

function Post() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { postID } = useParams();
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likeClicked, setLikeClicked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);
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
        const data = (await response.json()) as PostType;
        if (auth.currentUser?.uid) {
          if (data.likes.users.includes(auth.currentUser.uid)) {
            setLikeClicked(true);
          }
        }
        setCurrentPost(data);
        setLikes(data.likes.amount);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
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
  const handleLikeClick = async () => {
    const likesFallback = currentPost?.likes.amount || 0;
    if (likeClicked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLikeClicked(!likeClicked);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_SERVER}/fb/likePost/${auth.currentUser?.uid}/${postID}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.text();
      console.log(data);
    } catch (error) {
      console.error(error);
      setLikes(likesFallback);
      setLikeClicked(!likeClicked);
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
            <a href={currentPost?.selected.spotify_url} target="_blank">
              listen on spotify
            </a>
          </div>
        </section>
        <section className={styles.postContent}>
          <h2 className={styles.displayName}>
            posted by <span onClick={() => handleNameClick()}>{currentPost?.displayName}</span>
          </h2>
          <h2>{currentPost?.title}</h2>
          <p>{currentPost?.message}</p>

          <div className={styles.interactionSection}>
            <img
              className={styles.heartIcon}
              src={likeClicked ? heartFilled : heartEmpty}
              alt="like post"
              onClick={() => handleLikeClick()}
            />
            <h3 className={`${utils.ml_1}`}>{likes}</h3>
            {auth.currentUser?.uid == currentPost?.uid && (
              <button
                className={`${styles.deletePost} ${utils.cta} ${utils.danger}`}
                onClick={() => setDeleteModal(true)}
              >
                delete post
              </button>
            )}
          </div>
        </section>
      </section>
    </>
  );
}

export default Post;
