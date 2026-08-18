import React from "react";
import ReactDOM from "react-dom";

import MolPreviewer from  "./MolPreviewer";

const paramsContainer = document.getElementById("mvs-viewer-params");
const domContainer = document.getElementById("mvs-viewer");
if (domContainer) {
  ReactDOM.render(
    <MolPreviewer uri={paramsContainer.getAttribute("data-uri")} />,
    domContainer
  );
}