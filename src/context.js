import React from "react";
import {
  createNewFeedback,
  updateFeedback,
  submitFeedback,
  abandonFeedback,
} from "./stitch";
import * as R from "ramda";

const FeedbackContext = React.createContext();

// function useViews(defaultViews = []) {
//   const [views, setViews] = React.useState(defaultViews);
//   const currentView = views[0] || null;

//   function nextView() {
//     if (views.length) {
//       setViews(views.slice(1, views.length));
//     }
//   }
//   function appendView(view) {
//     views.push(view);
//     return views;
//   }

//   return {
//     views,
//     currentView,
//     appendView,
//     nextView,
//   };
// }

export function FeedbackProvider(props) {
  const [feedback, setFeedback] = React.useState(null);
  const [isSupportRequest, setIsSupportRequest] = React.useState(false);
  console.log("feedback", feedback);
  const [view, setView] = React.useState("waiting");

  async function initializeFeedback(initialView = "rating") {
    const newFeedback = await createNewFeedback({
      page: {
        title: "Hello CodeSandbox",
        slug: "/",
        url: "https://hz9r6.csb.app",
        docs_property: "stootch",
        docs_version: null,
      },
      user: {
        segment_id: "123456",
      },
    });
    setFeedback(newFeedback);
    setView(initialView);
    return newFeedback;
  }

  async function setRating(ratingValue) {
    let feedback_id;
    if (!feedback) {
      feedback_id = (await initializeFeedback("waiting"))._id;
    }
    if (feedback && feedback.rating) return;
    // Must be in range [1-5]
    if (typeof ratingValue !== "number") {
      throw new Error("Rating value must be a number.");
    }
    if (ratingValue < 1 || ratingValue > 5) {
      throw new Error("Rating value must be between 1 and 5, inclusive.");
    }
    const updatedFeedback = await updateFeedback({
      feedback_id: feedback ? feedback._id : feedback_id,
      rating: ratingValue,
    });
    setFeedback(updatedFeedback);
    setView("qualifiers");
  }

  async function setQualifier(id, value) {
    if (!feedback) return;
    if (typeof id !== "string") {
      throw new Error("id must be a string Qualifier ID.");
    }
    if (typeof value !== "boolean") {
      throw new Error("value must be a boolean.");
    }
    const updatedQualifiers = R.adjust(
      feedback.qualifiers.findIndex(R.propEq("id", id)), // Find the qualifier by id
      q => ({ ...q, value }), // Update the value
      feedback.qualifiers, // Adjust this array of qualifiers
    );
    const updatedFeedback = await updateFeedback({
      feedback_id: feedback._id,
      qualifiers: updatedQualifiers,
    });
    const supportQualifier = feedback.qualifiers.find(q =>
      R.propEq("id", "support")(q),
    );
    console.log("supportQualifier", supportQualifier);
    setIsSupportRequest(supportQualifier && supportQualifier.value);
    setFeedback(updatedFeedback);
  }

  function submitQualifiers() {
    setView("comment");
  }

  async function submitComment() {
    if (!feedback) return;
    const submitted = await submitFeedback({ feedback_id: feedback._id });
    if (isSupportRequest) {
      setView("support");
    } else {
      setView("submitted");
      setFeedback(null);
    }
    return submitted;
  }

  async function submitSupport() {
    if (!feedback) return;
    setView("submitted");
    setFeedback(null);
  }

  async function abandon() {
    if (feedback) {
      await abandonFeedback({ feedback_id: feedback._id });
    }
    setView("waiting");
    setFeedback(null);
  }

  // function previousView() {
  //   switch (view) {
  //     case "waiting":
  //       return;
  //     case "rating":
  //       return setView("waiting");
  //     case "qualifiers":
  //       return setView("rating");
  //     case "comment":
  //       return setView("qualifiers");
  //     default:
  //       return;
  //   }
  // }

  const value = {
    feedback,
    view,
    isSupportRequest,
    initializeFeedback,
    setRating,
    setQualifier,
    submitQualifiers,
    submitComment,
    submitSupport,
    abandon,
  };
  return (
    <FeedbackContext.Provider value={value}>
      {props.children}
    </FeedbackContext.Provider>
  );
}

export function useFeedbackState() {
  const feedback = React.useContext(FeedbackContext);
  if (!feedback && feedback !== null) {
    throw new Error(
      "You must nest useFeedbackState() inside of a FeedbackProvider.",
    );
  }
  return feedback;
}
