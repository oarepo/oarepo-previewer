import React from "react";
import PropTypes from "prop-types";
import { i18next } from "@translations/oarepo_ui/i18next";

export class PreviewerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.info(
      "PreviewerErrorBoundary caught following error:",
      error,
      errorInfo,
    );
  }

  render() {
    const { children } = this.props;
    const { hasError, error } = this.state;
    const detailedErrorMessage = error?.message || "";

    if (hasError) {
      return (
        <div className="ui container">
          <div className="ui padded grid column">
            <div className="column">
              <h3>
                <i className="times icon"></i> {i18next.t("Cannot preview file")}
              </h3>
              <p>
                {i18next.t(
                  "Sorry, we are unfortunately not able to preview this file.",
                )}
              </p>
              {detailedErrorMessage && (
                <p className="ui red message">
                  {detailedErrorMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

PreviewerErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired, // The child components to be rendered within the error boundary.
};

export default PreviewerErrorBoundary;
