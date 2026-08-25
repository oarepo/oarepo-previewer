import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginSpec, DefaultPluginSpec } from "molstar/lib/mol-plugin/spec";
import { MolViewSpec } from "molstar/lib/extensions/mvs/behavior";
import {
  loadStructureFromUrl,
  loadMVSFromUrl,
} from "molstar/lib/extensions/plugin/loaders";

/**
 * Extracts the file extension from a given URI.
 * @param uri uri of the file (e.g., "https://example.com/file.pdb?param=value#section")
 * @returns extension of the file (e.g., "pdb")
 */
const getExtension = (uri) => {
  const cleanUri = uri.split("?")[0].split("#")[0];
  return cleanUri.split(".").pop().toLowerCase();
};

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
};

/**
 * Decides whether the given file extension corresponds to a binary format.
 * @param extension extension of the file (e.g., "pdb", "cif", "mvsj", etc.)
 * @returns flag indicating whether the format is binary (true) or not (false)
 */
const isBinaryFormat = (extension) => {
  return ["mvsx", "bcif"].includes(extension);
};

/**
 * Decides whether the given file extension corresponds to a structure format based on https://molstar.org/docs/plugin/file-formats/.
 * @param extension extension of the file (e.g., "pdb", "cif", "mvsj", etc.)
 * @returns flag indicating whether the format is a structure format (true) or not (false)
 */
const isStructureFormat = (extension) => {
  return [
    "pdb",
    "ent",
    "pdbqt",
    "cif",
    "bcif",
    "mcif",
    "mmcif",
    "mol",
    "mol2",
    "gro",
    "sdf",
    "sd",
    "xyz",
  ].includes(extension);
};

/**
 * Decides whether the given file extension corresponds to an MVS format based on https://molstar.org/viewer-docs/extensions/mvs/.
 * @param extension extension of the file (e.g., "mvsj", "mvsx")
 * @returns flag indicating whether the format is an MVS format (true) or not (false)
 */
const isMVSFormat = (extension) => {
  return ["mvsj", "mvsx"].includes(extension);
};

/**
 * Creates a React component that initializes and renders the Mol* viewer for molecular visualization.
 * Creates the Mol* plugin without React UI not to use any dependencies of React 18, see https://molstar.org/docs/plugin/instance/#plugincontext-without-built-in-react-ui.
 */
export const MolstarPreviewer = ({ uri }) => {
  const viewerRef = useRef(null);
  const canvasRef = useRef(null);
  const pluginRef = useRef(null);

  const [error, setError] = useState(null);

  // On mount or URI change, initialize the Mol* plugin (see `pluginRef`) and load the molecular data from the provided URI.
  useEffect(() => {
    const init = async () => {
      if (!viewerRef.current || !canvasRef.current) return;

      try {
        const plugin = new PluginContext({
          ...DefaultPluginSpec(),
          behaviors: [
            ...DefaultPluginSpec().behaviors,
            PluginSpec.Behavior(MolViewSpec),
          ],
        });

        await plugin.init();

        if (
          !(await plugin.initViewerAsync(canvasRef.current, viewerRef.current))
        ) {
          console.error("Failed to init Mol* WebGL Context!");
          setError("Failed to init Mol* WebGL Context!");
          return;
        }

        pluginRef.current = plugin;

        if (!uri) return;

        const extension = getExtension(uri);
        const format = getMolstarFormat(extension);
        const isBinary = isBinaryFormat(extension);

        if (isStructureFormat(extension)) {
          await loadStructureFromUrl(plugin, uri, format, isBinary);
        } else if (isMVSFormat(extension)) {
          await loadMVSFromUrl(plugin, uri, format);
        } else {
          console.error(`Unsupported file format: <${extension}>!`);
          setError(`Unsupported file format: <${extension}>!`);
        }
      } catch (err) {
        console.error(`Error loading file: <${err}>!`);
        setError(err.message || String(err));

        if (pluginRef.current) {
          try {
            pluginRef.current.dispose();
          } catch (disposeErr) {
            console.warn("Molstar dispose failed: <", disposeErr, ">!");
          }
          pluginRef.current = null;
        }
      }
    };

    init();

    return () => {
      if (pluginRef.current) {
        pluginRef.current.dispose();
      }
    };
  }, [uri]);

  // TODO: temporary, have to report error up from the iframe to the mvs.html template hidden div, and there have script which shows this Molstar div or default error component (invenio_previewer/default.html)
  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>
          <i className="fa fa-remove"></i> Cannot preview file
        </h3>
        <p>
          Sorry, we are unfortunately not able to preview this file as it
          contains errors.
        </p>
        <p>
          <small>Error: {error}</small>
        </p>
      </div>
    );
  }

  return (
    <div
      ref={viewerRef}
      style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </div>
  );
};

MolstarPreviewer.propTypes = { uri: PropTypes.string.isRequired };
export default MolstarPreviewer;
