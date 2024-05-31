import styles from "../../styles/auth.module.scss";
import { useState, useEffect } from "react";
import { SignInForm, SignUpForm } from "./components/";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useUserContext, UserContextType } from "../../contexts/UserContext";

function Auth() {
  const [signIn, setSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const LoadingModal = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "64px",
        }}
      >
        <h2>Signing in...</h2>
        <div className={styles.spinner}></div>
      </div>
    );
  };

  useEffect(() => {
    const fetchUser = async (uid: string) => {
      const token = await auth.currentUser?.getIdToken();
      const userResponse = await fetch(import.meta.env.VITE_SERVER + "/fb/getUser/" + uid, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await userResponse.json();
      return userData as UserContextType;
    };
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = user.uid;
        const loggedInUser = await fetchUser(uid);
        setUser(loggedInUser);
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className={styles.authContainer}>
      <h1 className={styles.title}>
        {signIn ? (
          <>
            Sign in to your account, <span onClick={() => setSignIn(false)}>or sign up...</span>
          </>
        ) : (
          <>
            Create an account, <span onClick={() => setSignIn(true)}>or sign in...</span>
          </>
        )}
      </h1>
      <section className={styles.authForm}>
        {loading ? (
          <LoadingModal />
        ) : signIn ? (
          <SignInForm
            setLoading={setLoading}
            setInvalidCredentials={setInvalidCredentials}
            invalidCredentials={invalidCredentials}
          />
        ) : (
          <SignUpForm setLoading={setLoading} />
        )}
      </section>
    </main>
  );
}

export default Auth;
