import React from "react";
import ReactDOM from "react-dom";
import MolstarPreviewer from "./components/MolstarPreviewer";
import PreviewerErrorBoundary from "./components/PreviewerErrorBoundary";

const domContainer = document.getElementById("molstar-viewer");
const paramsContainer = document.getElementById("molstar-viewer-params");

if (domContainer) {
  ReactDOM.render(
    <PreviewerErrorBoundary>
      <MolstarPreviewer uri={paramsContainer.getAttribute("data-uri")} />
    </PreviewerErrorBoundary>,
    domContainer,
  );
}
