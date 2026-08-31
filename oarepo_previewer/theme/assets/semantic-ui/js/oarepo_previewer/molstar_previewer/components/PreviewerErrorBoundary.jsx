import React from "react";
import PropTypes from "prop-types";
import PreviewerFallback from "./PreviewerFallback";

/**
 * PreviewerErrorBoundary is a React component that acts as an error boundary for its child components.
 * It catches JavaScript errors anywhere in its child component tree, logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class PreviewerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
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
        <PreviewerFallback
          children={
            detailedErrorMessage && (
              <p className="ui red message">{detailedErrorMessage}</p>
            )
          }
        ></PreviewerFallback>
      );
    }

    return children;
  }
}

PreviewerErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PreviewerErrorBoundary;
