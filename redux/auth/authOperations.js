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

const { updateUserProfile, authStateChange, authSingOut } = authSlice.actions;

export const authSingUpUser =
  ({ name, email, password, photo }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });

      const { uid, displayName, photoURL } = await getAuth(app).currentUser;
      dispatch(
        updateUserProfile({
          userId: uid,
          name: displayName,
          photo: photoURL,
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
      const { uid, displayName, photoURL } = await getAuth(app).currentUser;
      dispatch(
        updateUserProfile({
          userId: uid,
          name: displayName,
          photo: photoURL,
        })
      );
    } catch (error) {
      console.log("error", error);
      console.log("error.message", error.message);
    }
  };

export const authSingOutUser = () => async (dispatch, getState) => {
  const auth = getAuth();
  await signOut(auth);
  dispatch(authSingOut());
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  const auth = getAuth();
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        authStateChange({
          stateChange: true,
        })
      );
      dispatch(
        updateUserProfile({
          userId: user.uid,
          name: user.displayName,
          photo: user.photoURL,
        })
      );
    } else {
      // User is signed out
      // ...
    }
  });
};

export const authUpdatePhotoUser =
  ({ photo }) =>
  async (dispatch, getState) => {
    const auth = getAuth();
    await updateProfile(auth.currentUser, {
      photoURL: photo,
    });
    dispatch(updateUserProfile({ photo }));
  };
