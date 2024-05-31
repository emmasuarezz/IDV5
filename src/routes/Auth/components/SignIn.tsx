import styles from "../../../styles/auth.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "react-query";
import { auth } from "../../../firebase";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContextType } from "../../../contexts/UserContext";

import { useUserContext } from "../../../contexts/UserContext";

type Inputs = {
  email: string;
  password: string;
};
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

function SignInForm({
  setLoading,
  setInvalidCredentials,
  invalidCredentials,
}: {
  setLoading: (loading: boolean) => void;
  setInvalidCredentials: (invalidCredentials: boolean) => void;
  invalidCredentials: boolean;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  //////////////////////////////////////////
  const signInFn = async ({ auth, email, password }: { auth: Auth; email: string; password: string }) => {
    setLoading(true);
    console.log("signing in", invalidCredentials); //false, i hope
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    return { user };
  };
  const signInMutation = useMutation(signInFn, {
    onSuccess: async (data) => {
      setInvalidCredentials(false);
      const user = data.user;
      if (user) {
        const uid = user.uid;
        const userResponse = await fetch(import.meta.env.VITE_SERVER + "/fb/getUser/" + uid);
        const userData = await userResponse.json();
        setUser(userData as UserContextType);
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        const message = error.message;
        if (message === "Firebase: Error (auth/invalid-credential).") {
          setInvalidCredentials(true);
        }
        if (message === "Firebase: Error (auth/network-request-failed).") {
          //should be handled differently
          setInvalidCredentials(true);
        }
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    signInMutation.mutate({
      auth,
      email: data.email,
      password: data.password,
    });
  };
  //////////////////////////////////////////
  return (
    <>
      <h2>
        Welcome back, we missed you <span>{"<3"}</span>
      </h2>

      <form className={styles.formGroup} onSubmit={handleSubmit(onSubmit)}>
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
        {invalidCredentials && (
          <p className={styles.errorMessage}>
            Hmm, we are having trouble finding that account. Check what you typed please!
          </p>
        )}
        <button style={{ margin: "0" }} type="submit">
          sign in
        </button>
      </form>
      <p className={styles.forgotPW}>forgot your password?</p>
    </>
  );
}

export default SignInForm;
