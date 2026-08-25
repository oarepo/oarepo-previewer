import React from "react";
import ReactDOM from "react-dom";
import MolstarPreviewer from  "./MolstarPreviewer";

const domContainer = document.getElementById("molstar-viewer");
const paramsContainer = document.getElementById("molstar-viewer-params");

if (domContainer) {
  ReactDOM.render(
    <MolstarPreviewer uri={paramsContainer.getAttribute("data-uri")}/>,
    domContainer
  );
}