import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import "./icons";

import App from "./App";
import { FeedbackProvider } from "./context";
import FeedbackCard from "./FeedbackCard";
import FeedbackTab from "./FeedbackTab";
import StarRating from "./components/StarRating";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <FeedbackProvider>
    <App />
  </FeedbackProvider>,
  rootElement,
);
