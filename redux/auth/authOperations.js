import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import app from "../../firebase/config";
import { authSlice } from "../../redux/auth/authReducer";

export const authSingUpUser =
  ({ name, email, password }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: name,
        // photoURL: "https://example.com/jane-q-user/profile.jpg",
      });

      const { uid, displayName } = await getAuth(app).currentUser;
      dispatch(
        authSlice.actions.updateUserProfile({
          userId: uid,
          name: displayName,
        })
      );
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
    }
  };

export const authSingInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("user", user);
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
    }
  };

export const authSingOutUser = () => async (dispatch, getState) => {
  const auth = getAuth();
  dispatch(
    authSlice.actions.authStateChange({
      stateChange: false,
    })
  );
  await signOut(auth);
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  const auth = getAuth();
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        authSlice.actions.authStateChange({
          stateChange: true,
        })
      );
      dispatch(
        authSlice.actions.updateUserProfile({
          userId: user.uid,
          name: user.displayName,
        })
      );
    } else {
      // User is signed out
      // ...
    }
  });
};
