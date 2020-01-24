import React from "react";
import ReactDOM from "react-dom";

import "./icons";

import App from "./App";
import { FeedbackProvider } from "./context";
import FeedbackCard from "./FeedbackCard";
import FeedbackTab from "./FeedbackTab";
import StarRating from "./components/StarRating";

exports = {
  FeedbackProvider,
  FeedbackCard,
  FeedbackTab,
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
