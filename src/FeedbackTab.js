import React from "react";
import styled from "@emotion/styled";
import { useFeedbackState } from "./context";

const Container = styled.div`
  position: fixed;
  top: 256px;
  right: 35px;
  transform: rotate(-90deg);
  transform-origin: top right;
  user-select: none;

  padding: 8px;
  border: 1px solid black;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;
export default function FeedbackTab(props) {
  const { feedback, initializeFeedback } = useFeedbackState();
  return (
    !feedback && (
      <Container onClick={() => initializeFeedback()}>Give Feedback</Container>
    )
  );
}
