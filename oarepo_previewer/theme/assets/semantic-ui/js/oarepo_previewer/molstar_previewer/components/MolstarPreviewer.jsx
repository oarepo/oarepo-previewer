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
 * Utility class for mapping file extensions to Mol* formats and determining their properties.
 * Based on https://molstar.org/docs/plugin/file-formats/ and https://molstar.org/viewer-docs/extensions/mvs/.
 */
class MolstarFormats {
  static FormatMap = {
    pdb: { formatGroup: "structure", format: "pdb", isBinary: false },
    ent: { formatGroup: "structure", format: "pdb", isBinary: false },
    pdbqt: { formatGroup: "structure", format: "pdb", isBinary: false },
    cif: { formatGroup: "structure", format: "mmcif", isBinary: false },
    bcif: { formatGroup: "structure", format: "mmcif", isBinary: true },
    mcif: { formatGroup: "structure", format: "mmcif", isBinary: false },
    mmcif: { formatGroup: "structure", format: "mmcif", isBinary: false },
    mol: { formatGroup: "structure", format: "mol", isBinary: false },
    mol2: { formatGroup: "structure", format: "mol2", isBinary: false },
    gro: { formatGroup: "structure", format: "gro", isBinary: false },
    sdf: { formatGroup: "structure", format: "sdf", isBinary: false },
    sd: { formatGroup: "structure", format: "sdf", isBinary: false },
    xyz: { formatGroup: "structure", format: "xyz", isBinary: false },
    mvsj: { formatGroup: "mvs", format: "mvsj", isBinary: false },
    mvsx: { formatGroup: "mvs", format: "mvsx", isBinary: true },
  };

  /**
   * Retrieves the appropriate format for Molstar based on the file extension.
   * @param extension lower case extension of the file (e.g., "pdb", "cif", "mvsj")
   * @returns the corresponding Molstar format or "mmcif" as a default
   */
  static getMolstarFormat(extension) {
    return MolstarFormats.FormatMap[extension]?.format || "mmcif";
  }

  /**
   * Decides whether the given file extension corresponds to a binary format.
   * @param extension lower case extension of the file (e.g., "pdb", "cif", "mvsj")
   * @returns true if the format is binary, false otherwise (defaults to false if the extension is not recognized)
   */
  static isBinaryFormat(extension) {
    return MolstarFormats.FormatMap[extension]?.isBinary ?? false;
  }

  /**
   * Decides whether the given file extension corresponds to a structure format.
   * @param extension lower case extension of the file (e.g., "pdb", "cif", "mvsj")
   * @returns true if the format is a structure format, false otherwise (defaults to false if the extension is not recognized)
   */
  static isStructureFormat(extension) {
    return MolstarFormats.FormatMap[extension]?.formatGroup === "structure";
  }

  /**
   * Decides whether the given file extension corresponds to an MVS format.
   * @param extension lower case extension of the file (e.g., "pdb", "cif", "mvsj")
   * @returns true if the format is an MVS format, false otherwise (defaults to false if the extension is not recognized)
   */
  static isMVSFormat(extension) {
    return MolstarFormats.FormatMap[extension]?.formatGroup === "mvs";
  }
}

/**
 * Extracts the file extension from a given URI.
 * @param uri uri of the file (e.g., "/records/file.pdb?param=value#section")
 * @returns extension of the file (e.g., "pdb") or null is no extension is found or the URI is not valid
 */
const getExtension = (uri) => {
  try {
    const pathname = new URL(uri, "http://localhost").pathname; // Use a base URL to handle relative URIs.
    const substrings = pathname.split(".");
    if (substrings.length > 1) {
      return substrings[substrings.length - 1].toLowerCase();
    }
  } catch (error) {
    console.error("Error occurred while parsing URI:", error);
  }
  return null; // Non-valid URL or no extension.
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
          setError("Failed to init Mol* WebGL Context!");
          return;
        }

        pluginRef.current = plugin;

        if (!uri) return;

        const extension = getExtension(uri);
        if (!extension) {
          setError("Failed to determine file extension from URI!");
          return;
        }

        const format = MolstarFormats.getMolstarFormat(extension);
        const isBinary = MolstarFormats.isBinaryFormat(extension);

        if (MolstarFormats.isStructureFormat(extension)) {
          await loadStructureFromUrl(plugin, uri, format, isBinary);
        } else if (MolstarFormats.isMVSFormat(extension)) {
          await loadMVSFromUrl(plugin, uri, format);
        } else {
          setError(`Unsupported file format: <${extension}>!`);
        }
      } catch (err) {
        setError(`Error loading file: <${err}>!`);

        if (pluginRef.current) {
          try {
            pluginRef.current.dispose();
          } catch (disposeErr) {
            console.warn("Mol* dispose failed: <", disposeErr, ">!");
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

  // Handle async errors by rethrowing them in a sync manner.
  if (error) {
    throw new Error(error);
  }

  // Render the component.
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

MolstarPreviewer.propTypes = {
  uri: PropTypes.string.isRequired, // The URI of the molecular data file to be loaded and visualized by Mol*.
};

export default MolstarPreviewer;
