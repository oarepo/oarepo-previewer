import React from "react";
import ReactDOM from "react-dom";
import MolstarPreviewer from "./components/MolstarPreviewer";
import PreviewerErrorBoundary from "./components/PreviewerErrorBoundary";

const domContainer = document.getElementById("molstar-viewer");

if (domContainer) {
  ReactDOM.render(
    <PreviewerErrorBoundary>
      <MolstarPreviewer uri={domContainer.getAttribute("data-uri")} />
    </PreviewerErrorBoundary>,
    domContainer,
  );
}
