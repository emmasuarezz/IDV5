import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import styles from "../../../styles/auth.module.scss";
import { useUserContext } from "../../../contexts/UserContext";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../../firebase";
import { UserContextType } from "../../../contexts/UserContext";
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
    onSettled: (data) => {
      console.log(data);
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
      </form>
    </>
  );
}

export default SignUp;
