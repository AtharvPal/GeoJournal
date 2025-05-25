import React from "react";
import ReactDOM from "react-dom";

import "./Backdrop.css";

// this backhdrop is used as a background for the side drawer, so that we can click on it to close the side drawer
const Backdrop = (props) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById("backdrop-hook")
  );
};

export default Backdrop;
