import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Extracts the file extension from a given URI.
 * @param uri uri of the file (e.g., "https://example.com/file.pdb?param=value#section")
 * @returns extension of the file (e.g., "pdb")
 */
const getExtension = (uri) => {
  const cleanUri = uri.split("?")[0].split("#")[0];
  return cleanUri.split(".").pop().toLowerCase();
}

/**
 * Retrieves the appropriate format for Mol* based on the file extension based on https://molstar.org/docs/plugin/file-formats/.
 * @param extension extension of the file (e.g., "pdb", "cif", "mvsj", etc.)
 * @returns format string for Mol* (e.g., "pdb", "mmcif", "mvsj", etc.)
 */
const getMolstarFormat = (extension) => {
  if (["mvsj", "mvsx"].includes(extension)) {
    return extension === "mvsx" ? "mvsx" : "mvsj";
  } else if (["pdb", "ent", "pdbqt"].includes(extension)) {
    return "pdb";
  } else if (["mol"].includes(extension)) {
    return "mol";
  } else if (["mol2"].includes(extension)) {
    return "mol2";
  } else if (["gro"].includes(extension)) {
    return "gro";
  } else if (["sdf", "sd"].includes(extension)) {
    return "sdf";
  } else if (["xyz"].includes(extension)) {
    return "xyz";
  } 

  return "mmcif"; // For extensions "cif", "bcif", "mcif", "mmcif". And default for unknown extensions.
}

/**
 * Decides whether the given file extension corresponds to a binary format.
 * @param extension extension of the file (e.g., "pdb", "cif", "mvsj", etc.)
 * @returns flag indicating whether the format is binary (true) or not (false)
 */
const isBinaryFormat = (extension) => {
  return ["mvsx", "bcif"].includes(extension);
}

/**
 * Decides whether the given file extension corresponds to a structure format based on https://molstar.org/docs/plugin/file-formats/.
 * @param extension extension of the file (e.g., "pdb", "cif", "mvsj", etc.)
 * @returns flag indicating whether the format is a structure format (true) or not (false)
 */
const isStructureFormat = (extension) => {
  return ["pdb", "ent", "pdbqt", "cif", "bcif", "mcif", "mmcif", "mol", "mol2", "gro", "sdf", "sd", "xyz"].includes(extension);
}

/**
 * Decides whether the given file extension corresponds to an MVS format based on https://molstar.org/viewer-docs/extensions/mvs/.
 * @param extension extension of the file (e.g., "mvsj", "mvsx")
 * @returns flag indicating whether the format is an MVS format (true) or not (false)
 */
const isMVSFormat = (extension) => {
  return ["mvsj", "mvsx"].includes(extension);
}

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

      if (!uri) {
        return;
      }

      const extension = getExtension(uri);

      // TODO: handle errors in loading the structure or MVS file and display an error message to the user.
      if (isStructureFormat(extension)) {
        const format = getMolstarFormat(extension);
        await pluginRef.current.loadStructureFromUrl(uri, format, isBinaryFormat(extension));
      } else if (isMVSFormat(extension)) {
        const format = getMolstarFormat(extension);
        await pluginRef.current.loadMvsFromUrl(uri, format);
      } else {
        console.error(`Unsupported file format: <${extension}>!`); // Not reachable in the current implementation because of `previewable_extensions` defined in `mvs.py`.
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