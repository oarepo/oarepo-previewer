import React from "react";
import PropTypes from "prop-types";
import { i18next } from "@translations/invenio_app_rdm/i18next"; // TODO: change to invenio_previewer when it will be available for FE.

/**
 * Default is a React component mirroring the `default.html` template in `invenio_previewer`.
 * It displays a message indicating that the file cannot be previewed, along with any additional child components passed to it.
 */
export class Default extends React.Component {
  render() {
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
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Default.propTypes = {
  children: PropTypes.node, // The child components to be rendered within the Default component.
};

export default Default;
