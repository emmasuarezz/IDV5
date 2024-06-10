import { useUserContext } from "../../contexts/UserContext";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Components/signOutModal.module.scss";
import utils from "../../styles/utils.module.scss";
function SignOutModal({ setSignOutModal }: { setSignOutModal: (value: boolean) => void }) {
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(undefined);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={utils.modalBg}>
      <section className={styles.modal}>
        <h2>Are you sure you want to sign out?</h2>
        <button className={`${utils.cta} ${utils.danger}`} onClick={handleSignOut}>
          Yes, let's sign out
        </button>
        <button className={utils.cta} onClick={() => setSignOutModal(false)}>
          No, go back
        </button>
      </section>
    </div>
  );
}

export default SignOutModal;
