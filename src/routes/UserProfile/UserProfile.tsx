import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/profile.module.scss";
import utils from "../../styles/utils.module.scss";
import { PostCard } from "../Dashboard/Components";
import { Post } from "../Dashboard/Dashboard";
import { auth } from "../../firebase";
import { UserContextType } from "../../contexts/UserContext";

type Relationship = "friends" | "requestSent" | "notFriends" | undefined;

function UserProfile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const { userUID } = useParams();
  const [user, setUser] = useState<UserContextType>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFriend, setIsFriend] = useState<Relationship>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        const userResponse = await fetch(`${import.meta.env.VITE_SERVER}/fb/getUser/${userUID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const relationResponse = await fetch(
          `${import.meta.env.VITE_SERVER}/fb/getRelation/${auth.currentUser?.uid}/${userUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = await userResponse.json();
        const relationData = await relationResponse.text();
        setIsFriend(relationData as Relationship);
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPosts = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_SERVER}/fb/getPosts/${userUID}`, {
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

    fetchUser();
    fetchPosts();
  }, [userUID]);

  if (isLoading) {
    return (
      <section className={utils.loadingState}>
        <h1>Loading profile...</h1>
        <h2>It won't take long</h2>
      </section>
    );
  }

  async function handleAddFriend() {
    setIsFriend("requestSent");
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`${import.meta.env.VITE_SERVER}/fb/addFriend/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userAdding: auth.currentUser?.uid, userRecieving: userUID }),
      });
    } catch (error) {
      setIsFriend(undefined);
      console.error(error);
    }
  }

  return (
    <>
      <section className={styles.profile_container} style={{ backgroundImage: `url(${user?.banner})` }}>
        <section className={`${utils.flex} ${utils.g2}`}>
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
        {isFriend && (
          <button className={`${utils.cta}`} onClick={() => handleAddFriend()} disabled={isFriend !== "notFriends"}>
            {isFriend === "notFriends" ? "add friend" : isFriend === "requestSent" ? "request sent" : "friends"}
          </button>
        )}
      </section>
      <section className={`${utils.flex_wrap} ${utils.g2} ${utils.w_full} ${utils.p1} ${utils.jcenter}`}>
        {activeTab === "posts" && userPosts.map((post) => <PostCard key={post.uid} post={post} profile={true} />)}
      </section>
    </>
  );
}

export default UserProfile;
