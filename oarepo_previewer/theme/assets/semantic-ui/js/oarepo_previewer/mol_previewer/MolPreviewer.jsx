import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export const MolPreviewer = ({ uri }) => {
  const viewerRef = useRef(null);
  const pluginRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      if (!viewerRef.current || !window.molstar) {
          return;
      }

      const Viewer = window.molstar.Viewer;

      pluginRef.current = await Viewer.create(viewerRef.current, {
        layoutIsExpanded: false,
        layoutShowControls: false,       
        layoutShowRemoteState: false,
        layoutShowSequence: false,      
        layoutShowLog: false,           
        layoutShowLeftPanel: false,
        viewportShowExpand: false,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,
      });

      if (uri) {
        const cleanUri = uri.split("?")[0].split("#")[0];
        const extension = cleanUri.split(".").pop().toLowerCase();
        
        if (["mvsj", "mvsx"].includes(extension)) {
          const format = extension === "mvsx" ? "mvsx" : "mvsj";
          await pluginRef.current.loadMvsFromUrl(uri, format);
        } else {
          const structFormat = ["mmcif", "cif"].includes(extension) ? "mmcif" : "pdb";
          await pluginRef.current.loadStructureFromUrl(uri, structFormat, false);
        }
      }
    };

    init();

    return () => {
      if (pluginRef.current) {
        pluginRef.current.plugin.dispose();
      }
    };
  }, [uri]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={viewerRef} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />
    </div>
  );
};

MolPreviewer.propTypes = { uri: PropTypes.string.isRequired };
export default MolPreviewer;