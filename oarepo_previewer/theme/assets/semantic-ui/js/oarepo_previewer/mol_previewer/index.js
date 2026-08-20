import React from "react";
import ReactDOM from "react-dom";
import MolPreviewer from  "./MolPreviewer";

const domContainer = document.getElementById("mvs-viewer");
const paramsContainer = document.getElementById("mvs-viewer-params");

if (domContainer) {
  ReactDOM.render(
    <MolPreviewer uri={paramsContainer.getAttribute("data-uri")}/>,
    domContainer
  );
}