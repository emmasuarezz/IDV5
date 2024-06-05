import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/UseAuth";
import styles from "../../styles/profileSetup.module.scss";
import utils from "../../styles/utils.module.scss";
import { Avatars } from "../../assets/avatars/Avatars";
import { PreviewProfile, ProfileSection } from "./components";

export type UserPreviewType = {
  name: string;
  email: string;
  pronoun: string;
  dateOfBirth: string;
  avatar: string;
};
const userPreviewInitial = {
  name: "",
  email: "",
  pronoun: "",
  dateOfBirth: "",
  avatar: "",
};

function ProfileSetup() {
  const { user } = useAuth();
  // State for the user info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pronoun, setPronoun] = useState("they/them");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  // State for showing the different portions of the setup
  const [step, setStep] = useState(0);
  const [userPreview, setUserPreview] = useState(userPreviewInitial);

  useEffect(() => {
    if (user) {
      setName(user.displayName);
      setEmail(user.email);
    }
  }, [user]);

  const handleFinish = () => {
    const profileData: Partial<UserPreviewType> = {};
    if (name) profileData.name = name;
    if (email) profileData.email = email;
    if (pronoun) profileData.pronoun = pronoun;
    if (dateOfBirth) profileData.dateOfBirth = dateOfBirth;
    if (avatar) profileData.avatar = avatar;
    setUserPreview(profileData as UserPreviewType);
  };

  return (
    <main className={styles.container}>
      <div>
        <h1>Profile Setup</h1>
        <p>We are happy that you are here!</p>
      </div>
      <hr />
      {/* If the user has not completed their profile we let them do so.
      If they click on "Finish" then userPreview gets loaded with the data and a preview
      of their profile is displayed */}
      {userPreview.name == "" ? (
        <>
          <ProfileSection title="This is what we know so far:">
            <div>
              <input value={name} onChange={(e) => setName(e.target.value)} id="name" name="name" type="text" />
              <label htmlFor="name">is your name</label>
            </div>
            <div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} id="email" name="email" type="text" />
              <label htmlFor="email">is your email</label>
            </div>
          </ProfileSection>
          {/* Middle text with the continue call to action */}
          <div className={`${utils.flexCol} ${utils.icenter} ${utils.w_full} ${utils.m_block_1}`}>
            {step < 1 ? (
              <>
                <h2>
                  Does everything look alright? Cool let's <span onClick={() => setStep(1)}>continue!</span>
                </h2>
                <h2>If not take your time to add the correct info :p</h2>
              </>
            ) : (
              <h2>Great! Some more details and off you go.</h2>
            )}
          </div>
          {step > 0 && (
            <>
              <ProfileSection title="What are your pronouns?">
                <div>
                  <select id="pronoun" name="pronoun" value={pronoun} onChange={(e) => setPronoun(e.target.value)}>
                    <option value="they/them">they/them</option>
                    <option value="she/her">she/her</option>
                    <option value="he/him">he/him</option>
                  </select>
                </div>
              </ProfileSection>
              <ProfileSection title="When were you born?">
                <div className={`${utils.flex}`}>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                  <button className={styles.cta} onClick={() => setStep(2)}>
                    done!
                  </button>
                </div>
              </ProfileSection>
            </>
          )}
          {/* Avatar selection and completion of the profile */}
          {step > 1 && (
            <>
              <ProfileSection title="Time to choose your avatar!">
                <h2>
                  You can select one of these or <span>upload your own</span>
                </h2>
              </ProfileSection>
              <section className={styles.avatarSection}>
                {Avatars.map((avatar, index) => (
                  <div onClick={() => setAvatar(Avatars[index])} key={index} className={styles.avatarCard} tabIndex={0}>
                    <img src={avatar} alt="" />
                  </div>
                ))}
              </section>
              {/* CHANGE THIS TO BE DISPLAYED IN THE MIDDLE TEXT SECTION*/}
              {avatar && (
                <div className={`${utils.w_full} ${utils.flex} ${utils.jcenter} ${utils.m_block_1}`}>
                  <button onClick={handleFinish} className={styles.cta}>
                    finish my profile
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <PreviewProfile userPreview={userPreview} />
      )}
    </main>
  );
}

export default ProfileSetup;
