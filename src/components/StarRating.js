import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { useFeedbackState } from "../context";

const FILLED_STAR_COLOR = uiColors.yellow.base;
const UNFILLED_STAR_COLOR = uiColors.gray.light2;

const RATING_TOOLTIPS = {
  1: "Unusable",
  2: "Poor",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};

const filledStarIcon = findIconDefinition({ prefix: "fas", iconName: "star" });

export default function StarRating({ size = "3x" }) {
  const [hoveredRating, setHoveredRating] = React.useState(null);
  const { feedback } = useFeedbackState();
  const selectedRating = feedback && feedback.rating;
  return (
    <Layout>
      <Star
        ratingValue={1}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        selectedRating={selectedRating}
        size={size}
      />
      <Star
        ratingValue={2}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        selectedRating={selectedRating}
        size={size}
      />
      <Star
        ratingValue={3}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        selectedRating={selectedRating}
        size={size}
      />
      <Star
        ratingValue={4}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        selectedRating={selectedRating}
        size={size}
      />
      <Star
        ratingValue={5}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        selectedRating={selectedRating}
        size={size}
      />
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin: 20px 0 20px 0;
`;

export function Star({
  ratingValue,
  hoveredRating,
  setHoveredRating,
  selectedRating,
  size,
}) {
  const isHighlighted = selectedRating
    ? selectedRating >= ratingValue
    : hoveredRating >= ratingValue;
  const isHovered = hoveredRating === ratingValue;
  const onMouseEnter = () => setHoveredRating(ratingValue);
  const { setRating } = useFeedbackState();
  const onClick = () => setRating(ratingValue);
  return (
    <StarContainer onClick={onClick}>
      <Tooltip
        align="bottom"
        justify="middle"
        triggerEvent="hover"
        variant="dark"
        open={isHovered}
        setOpen={onMouseEnter}
        trigger={
          <div>
            <StyledIcon
              size={size}
              icon={filledStarIcon}
              isHighlighted={isHighlighted}
            />
          </div>
        }
      >
        {RATING_TOOLTIPS[ratingValue]}
      </Tooltip>
    </StarContainer>
  );
}
const StarContainer = styled.div`
  padding-right: auto;
  padding-left: auto;
`;
const StyledIcon = styled(FontAwesomeIcon)(
  props => `
    color: ${props.isHighlighted ? FILLED_STAR_COLOR : UNFILLED_STAR_COLOR};
  `,
);
