import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/UseAuth";
import styles from "../../styles/profile.module.scss";
import utils from "../../styles/utils.module.scss";
import { PostCard } from "../Dashboard/Components";
import { Post } from "../Dashboard/Dashboard";
import { auth } from "../../firebase";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_SERVER}/fb/getPosts/${user?.uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserPosts(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [user]);

  if (isLoading) {
    return (
      <section className={utils.loadingState}>
        <h1>Loading profile...</h1>
        <h2>It won't take long</h2>
      </section>
    );
  }

  return (
    <>
      <section className={styles.profile_container} style={{ backgroundImage: `url(${user?.banner})` }}>
        <section className={`${utils.flex} ${utils.g2} ${utils.icenter}`}>
          <div className={styles.img_wrapper}>
            <img src={user?.avatar} alt="" />
          </div>
          <div className={styles.banner_info}>
            <div>
              <h2>{user?.displayName}</h2>
              <p>{user?.pronouns}</p>
            </div>
            <p>@{user?.username}</p>
          </div>
        </section>
        {/* <button className={styles.editProfile}>edit profile</button> */}
      </section>
      {/* Posts and friends tabs */}
      <section className={`${utils.flex} ${utils.g2} ${utils.w_full}`}>
        <button
          onClick={() => setActiveTab("posts")}
          className={`${utils.cta} ${activeTab == "posts" ? utils.cta_active : ""}`}
        >
          posts
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`${utils.cta} ${activeTab == "friends" ? utils.cta_active : ""}`}
        >
          friends
        </button>
      </section>
      <section className={`${utils.flex_wrap} ${utils.g2} ${utils.w_full} ${utils.p1} ${utils.jcenter}`}>
        {activeTab === "posts" && userPosts.map((post) => <PostCard key={post.id} post={post} />)}
      </section>
    </>
  );
}

export default Profile;
