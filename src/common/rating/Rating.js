import React, { useState, useEffect } from "react";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import "./Rating.css";

const Rating = ({ max = 5, value = 0, onChange }) => {
  const [starValues, setStarValues] = useState([]);

  //Set initial value for star tiles
  useEffect(() => {
    updateStarValues(value);
  }, [max, value]);

  const handleIconClick = (index) => {
    const newValue = index + 1;
    updateStarValues(newValue);
    if (typeof onChange === "function") {
      onChange(newValue);
    }
  };

  const updateStarValues = (newValue) => {
    let intialValues = [];
    if (newValue <= max) {
      for (let i = 0; i < max; i++) {
        if (newValue > i) intialValues.push(true);
        else intialValues.push(false);
      }
    }

    setStarValues(intialValues);
  };

  return (
    <div>
      {starValues.map((val, index) => (
        <StarBorderIcon
          key={index}
          fontSize="inherit"
          onClick={() => handleIconClick(index)}
          className={`rating-icon ${val && "highlight"}`}
        />
      ))}
    </div>
  );
};

export default Rating;
