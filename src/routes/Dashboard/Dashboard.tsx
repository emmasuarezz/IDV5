import { PostCard, SelectedCard, WelcomeCard } from "./Components";
import styles from "../../styles/dashboard.module.scss";
import utils from "../../styles/utils.module.scss";
import { useUserContext } from "../../contexts/UserContext";
import { useEffect, useState } from "react";
import { firestore } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import firebase from "firebase/compat/app";

export type Post = {
  id: string;
  uid: string;
  displayName: string;
  userAvatar: string;
  title: string;
  message: string;
  likes: {
    amount: number;
    users: string[];
  };
  selected: {
    uid: string;
    name: string;
    album: string;
    artist: string;
    cover: string;
    preview: string | undefined;
    spotify_url: string;
  };
  timestamp: firebase.firestore.Timestamp;
};

const bpitchLink = "https://www.bpitch.de/en/release/various-artists-we-are-not-alone-pt-7/";
const soundcloudiFrame =
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1828818687&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false";

function Dashboard() {
  const { selected, showWelcome, setShowWelcome } = useUserContext();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "posts"), (snapshot) => {
      const newPosts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Post)
      );
      newPosts.sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime());
      setPosts(newPosts);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <main className={styles.main}>
      {showWelcome && <WelcomeCard setShowWelcome={setShowWelcome} />}
      <section className={styles.postsSection}>
        <h1>latest</h1>
        <p>check out what people have been listening</p>
        <section className={styles.posts}>
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <section className={utils.loadingState}>
              <h2>Loading posts...</h2>
            </section>
          )}
        </section>
      </section>

      <section className={styles.selectionSection}>
        <h1>Tenzo's Selection</h1>
        <p>updated every weekend with the sickest tunes just for you!</p>
        <p>
          Happy release day for{" "}
          <a href={bpitchLink} target="_blank">
            BPitch Control
          </a>
          !
        </p>
        <p>We Are Not Alone Pt. 7 is out now!</p>
        <div className={styles.selectedPreview}>
          {selected && selected.map((track) => <SelectedCard key={track.uid} track={track} />)}
        </div>
      </section>

      <section className={styles.soundcloudSection}>
        <div>
          <h2>Do you like techno?</h2>
          <p>Check out my latest mix</p>
        </div>
        <iframe width="100%" height="200" allow="autoplay" src={soundcloudiFrame}></iframe>
      </section>
    </main>
  );
}

export default Dashboard;
