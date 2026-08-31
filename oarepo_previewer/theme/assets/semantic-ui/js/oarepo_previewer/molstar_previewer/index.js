import React from "react";
import ReactDOM from "react-dom";
import MolstarPreviewer from "./components/MolstarPreviewer";
import PreviewerErrorBoundary from "./components/PreviewerErrorBoundary";

const viewerContainer = document.getElementById("molstar-viewer");

if (viewerContainer) {
  ReactDOM.render(
    <PreviewerErrorBoundary>
      <MolstarPreviewer uri={viewerContainer.getAttribute("data-file-uri")} />
    </PreviewerErrorBoundary>,
    viewerContainer,
  );
}
