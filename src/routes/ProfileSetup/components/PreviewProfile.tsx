import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPreviewType } from "../ProfileSetup";
import { auth } from "../../../firebase";
import { UserContextType, useUserContext } from "../../../contexts/UserContext";
import styles from "../../../styles/profileSetup.module.scss";
import utils from "../../../styles/utils.module.scss";
import Banners from "../../../assets/banners/Banners";

function PreviewProfile({ userPreview }: { userPreview: UserPreviewType }) {
  const [bannerUrl, setBannerUrl] = useState<string>(Banners[0]);
  const [username, setUsername] = useState<string>("@username");
  const [errorUsername, setErrorUsername] = useState("");
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  //logic to handle the upload of the banner and avatar

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValidUsername(false);
    if (value.charAt(0) !== "@") {
      setUsername("@" + value);
    } else {
      setUsername(value);
    }
    if (value.length <= 3) {
      setErrorUsername("Username must be at least 3 characters long");
      setValidUsername(false);
      return;
    } else {
      setErrorUsername("");
    }
  };
  const handleUsernameSubmit = async () => {
    const newUsername = username.charAt(0) === "@" ? username.slice(1) : username;
    try {
      const token = await auth.currentUser?.getIdToken();
      const exists = await fetch(import.meta.env.VITE_SERVER + "/fb/checkUsername/" + newUsername, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const existsJson = await exists.json();
      if (existsJson) {
        setErrorUsername("Username already exists");
        setValidUsername(false);
      } else {
        setErrorUsername("");
        setValidUsername(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFinishSetup = async () => {
    setCompleted(true);
    const avatarUrl = userPreview.avatar;
    const token = await auth.currentUser?.getIdToken();
    console.log(token, "this is the token");
    const finalUsername = username.charAt(0) === "@" ? username.slice(1) : username;
    const avatarFilename = avatarUrl.split("/").pop();
    const bannerFilename = bannerUrl.split("/").pop();
    const avatarId = avatarFilename?.split(".")[0].split("-")[0];
    const bannerId = bannerFilename?.split(".")[0].split("-")[0];
    const request = { user: userPreview, bannerId: bannerId, username: finalUsername, avatarId: avatarId };

    try {
      console.log(auth.currentUser?.uid, "this is the uid");
      const response = await fetch(import.meta.env.VITE_SERVER + "/fb/finishSetup/" + auth.currentUser?.uid, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(request),
      });
      const responseJson = await response.json();
      console.log(responseJson, "this is returning");

      if (responseJson) {
        setUser(responseJson as UserContextType);
        navigate("/dashboard");
      }
    } catch (error) {
      setCompleted(false);
      console.log(error);
    }
  };

  return (
    <>
      <section className={styles.previewProfile_container} style={{ backgroundImage: `url(${bannerUrl})` }}>
        {/* Avatar and name */}
        <section className={`${utils.flex} ${utils.g2}`}>
          <div className={styles.img_wrapper}>
            <img src={userPreview.avatar} alt="" />
          </div>
          <div className={styles.banner_info}>
            <div>
              <h2>{userPreview.name}</h2>
              <p>{userPreview.pronoun}</p>
            </div>
            <p>{username}</p>
          </div>
        </section>
      </section>
      <section className={styles.section_info}>
        <h2>Choose an usernme</h2>
        <div>
          <input value={username} onChange={(e) => handleUsernameChange(e)} type="text" placeholder="@username" />
          <button disabled={errorUsername !== ""} onClick={handleUsernameSubmit} className={styles.cta}>
            check
          </button>
        </div>
        {errorUsername && <p className={styles.error}>{errorUsername}</p>}
        {validUsername && <p className={styles.success}>Username available!</p>}
      </section>
      <section className={styles.previewProfile_banners}>
        <h2>Choose a banner!</h2>
        <section>
          {Banners.map((banner, index) => (
            <div key={index} className={styles.banner_preview} onClick={() => setBannerUrl(banner)}>
              <img src={banner} alt="banner" />
            </div>
          ))}
        </section>
      </section>
      <div className={`${utils.w_full} ${utils.flex} ${utils.jcenter}`}>
        <button onClick={handleFinishSetup} className={styles.cta} disabled={!validUsername}>
          {completed ? "finishing..." : "all done"}
        </button>
      </div>
    </>
  );
}

export default PreviewProfile;
