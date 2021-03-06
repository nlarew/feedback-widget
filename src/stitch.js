import React from "react";
import { Stitch, AnonymousCredential } from "mongodb-stitch-browser-sdk";

const APP_ID = "feedback-ibcyy";
// const DATABASE = "deluge";
// const COLLECTION = "newWidgetVotes";

export const app = Stitch.hasAppClient(APP_ID)
  ? Stitch.getAppClient(APP_ID)
  : Stitch.initializeAppClient(APP_ID);

// User Authentication & Management
export async function loginAnonymous() {
  if (!app.auth.user) {
    const user = await app.auth.loginWithCredential(new AnonymousCredential());
    return user;
  } else {
    console.warn("Already authenticated.");
    return app.auth.user;
  }
}
export async function logout() {
  if (app.auth.isLoggedIn) {
    await app.auth.logoutUserWithId(app.auth.user.id);
  } else {
    console.warn("No logged in user.");
  }
}
export const useStitchUser = () => {
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    loginAnonymous().then(setUser);
    return () => logout();
  }, []);
  return user;
};

// Feedback Widget Functions
export async function createNewFeedback({
  page = {
    title: undefined,
    slug: undefined,
    url: undefined,
    docs_property: undefined,
    docs_version: undefined,
  },
  user = {
    segment_id: "",
  },
}) {
  const feedback = await app.callFunction("feedback_create", [{ page, user }]);
  return feedback;
}

export async function updateFeedback({
  feedback_id,
  rating = undefined,
  comment = undefined,
  qualifiers = [],
} = {}) {
  if (!feedback_id) {
    throw new Error("Must specify a feedback item _id to update");
  }
  const feedback = await app.callFunction("feedback_update", [
    { feedback_id, rating, comment, qualifiers },
  ]);
  return feedback;
}

export async function submitFeedback({ feedback_id }) {
  if (!feedback_id) {
    throw new Error("Must specify a feedback item _id to submit");
  }
  const feedback = await app.callFunction("feedback_submit", [{ feedback_id }]);
  return feedback;
}

export async function abandonFeedback({ feedback_id }) {
  if (!feedback_id) {
    throw new Error("Must specify a feedback item _id to abandon");
  }
  const result = await app.callFunction("feedback_abandon", [{ feedback_id }]);
  return result.modifiedCount === 1;
}
