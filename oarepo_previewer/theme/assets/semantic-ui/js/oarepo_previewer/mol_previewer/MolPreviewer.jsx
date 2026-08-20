import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Viewer } from "molstar/build/viewer/molstar";
import "molstar/build/viewer/molstar.css"; 

export const MolPreviewer = ({ uri }) => {
  const viewerRef = useRef(null);
  const pluginRef = useRef(null);

  useEffect(() => {
    const initMolstar = async () => {
      if (!viewerRef.current) return;

      pluginRef.current = await Viewer.create(viewerRef.current, {
        layoutIsExpanded: false,
        layoutShowControls: false,       
        layoutShowRemoteState: false,
        layoutShowSequence: false,      
        layoutShowLog: false,           
        layoutShowLeftPanel: false,     
      });

      if (uri) {
        const extension = uri.split('.').pop().toLowerCase();

        if (['mvsj', 'mvsx'].includes(extension)) {
          const mvsFormat = extension === 'mvsx' ? 'mvsx' : 'mvsj';
          await pluginRef.current.loadMvsFromUrl(uri, mvsFormat);
        } 
        else {
          const structFormat = ['mmcif', 'cif'].includes(extension) ? 'mmcif' : 'pdb';
          await pluginRef.current.loadStructureFromUrl(uri, structFormat, false);
        }
      }
    };

    initMolstar();

    return () => {
      if (pluginRef.current) {
        pluginRef.current.plugin.dispose();
      }
    };
  }, [uri]);

  return (
    <div style={{ position: "relative", width: "100%", height: "400px", border: "1px solid #ccc", borderRadius: "4px" }}>
      <div 
        ref={viewerRef} 
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} 
      />
    </div>
  );
};

MolPreviewer.propTypes = {
  uri: PropTypes.string.isRequired,
};

export default MolPreviewer;