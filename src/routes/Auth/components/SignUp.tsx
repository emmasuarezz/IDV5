import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import styles from "../../../styles/auth.module.scss";
import { useUserContext } from "../../../contexts/UserContext";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../../firebase";
import { UserContextType } from "../../../contexts/UserContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function SignUp({ setLoading }: { setLoading: (loading: boolean) => void }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const { setUser } = useUserContext();
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const passwordValue = watch("password");
  const navigate = useNavigate();

  //
  const provider = new GoogleAuthProvider();
  async function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const token = await auth.currentUser?.getIdToken();
        if (user) {
          const uid = user.uid;
          const userResponse = await fetch(import.meta.env.VITE_SERVER + "/fb/getUser/" + uid, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = await userResponse.text();
          if (userData === "User does not exist") {
            const newUser = {
              email: user.email,
              displayName: user.displayName,
              avatar: user.photoURL,
              username: "NEWUSER",
              uid: user.uid,
            };
            console.log(newUser);
            setUser(newUser as UserContextType);
            navigate("/dashboard");
          }
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  const signUpFn = async (data: Inputs): Promise<UserContextType> => {
    setLoading(true);
    const { email, password, name } = data;
    const reqBody = { userEmail: email, password, name };
    const response = await fetch(import.meta.env.VITE_SERVER + "/user/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    const { loginToken, uid, username } = await response.json();
    await signInWithCustomToken(auth, loginToken);
    const newUser = { email: email, displayName: name, avatar: "", thumbnail: "", username: username, uid: uid };
    setUser(newUser as UserContextType);
    return newUser as UserContextType;
  };

  const signUpMutation = useMutation(signUpFn, {
    onSettled: () => {
      setLoading(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <>
      <h2>Are you ready to share some tunes?</h2>
      <form className={styles.formGroup} onSubmit={handleSubmit((data) => signUpMutation.mutate(data))}>
        <input {...register("name", { required: `it can't be empty` })} type="text" placeholder="name" />
        {errors.name && <p className={styles.errorMessage}>{errors.name.message}</p>}
        <input
          {...register("email", {
            required: "email is required",
            pattern: { value: emailRegex, message: "invalid email" },
          })}
          type="text"
          placeholder="email"
        />
        {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
        <input
          {...register("password", {
            required: "password is required",
            minLength: { value: 8, message: "not long enough" },
            maxLength: { value: 16, message: "now it's too long" },
          })}
          type="password"
          placeholder="password"
        />
        {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
        <input
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === passwordValue || "The passwords do not match",
          })}
          type="password"
          placeholder="confirm password"
        />
        {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>}
        <button type="submit">sign up</button>
        <button type="button" onClick={signInWithGoogle}>
          sign up with google
        </button>
      </form>
    </>
  );
}

export default SignUp;
