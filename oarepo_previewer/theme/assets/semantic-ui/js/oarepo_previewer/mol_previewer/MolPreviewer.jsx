import React from "react";
import PropTypes from "prop-types";

export const MolPreviewer = ({ uri }) => {
  
  return (
    <button>
      File URI: {uri}
    </button>
  );
};

MolPreviewer.propTypes = {
  uri: PropTypes.string.isRequired
};

export default MolPreviewer;