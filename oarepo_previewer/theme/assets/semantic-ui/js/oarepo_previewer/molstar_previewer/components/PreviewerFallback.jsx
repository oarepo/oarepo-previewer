import React from "react";
import PropTypes from "prop-types";
import { Container, Grid, GridColumn, Icon } from "semantic-ui-react";
import { i18next } from "@translations/invenio_app_rdm/i18next"; // TODO: change to invenio_previewer when it will be available for FE.

/**
 * PreviewerFallback is a React component mirroring the `default.html` template in `invenio_previewer`.
 * It displays a message indicating that the file cannot be previewed, along with any additional child components passed to it.
 */
export class PreviewerFallback extends React.Component {
  render() {
    return (
      <Container>
        <Grid padded>
          <GridColumn>
            <h3>
              <Icon name="times" />
              {i18next.t("Cannot preview file")}
            </h3>
            <p>
              {i18next.t(
                "Sorry, we are unfortunately not able to preview this file.",
              )}
            </p>
            {this.props.children}
          </GridColumn>
        </Grid>
      </Container>
    );
  }
}

PreviewerFallback.propTypes = {
  children: PropTypes.node,
};

export default PreviewerFallback;
