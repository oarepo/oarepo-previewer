# oarepo-previewer

OARepo module delivering contrib previewers to
[invenio-previewer](https://github.com/inveniosoftware/invenio-previewer)
for custom file extensions.

## Installation

```bash
pip install oarepo-previewer
```

The Flask app extension (registered via the `invenio_base.apps` entry point)
inserts the previewers listed in `OAREPO_PREVIEWER_ENABLED` at the front of
invenio-previewer's `PREVIEWER_PREFERENCE`.

## Shipped previewers

### Molecular Viewer (`mol`)

A unified molecular structure previewer powered by **Molstar**, supporting a wide range of molecular and crystallographic file formats:

| Extension               | Format                            |
| ----------------------- | --------------------------------- |
| `.mvsj`                 | MolViewSpec JSON description      |
| `.mvsx`                 | MolViewSpec ZIP container         |
| `.pdb`                  | Protein Data Bank                 |
| `.ent`                  | PDB legacy format                 |
| `.cif`                  | Crystallographic Information File |
| `.bcif`                 | Binary CIF (compressed)           |
| `.mcif`                 | Magnetic CIF                      |
| `.mmcif`                | Macro-molecular CIF               |
| `.mol` / `.sdf` / `.sd` | MDL Molfile                       |
| `.mol2`                 | Tripos Mol2                       |
| `.gro`                  | GROMACS structure                 |
| `.xyz`                  | XYZ coordinate format             |
| `.pdbqt`                | PDBQT (AutoDock)                  |

The previewer leverages Molstar's native support for these formats, providing 3D visualization directly in the browser. Configuration is handled via the template which loads Molstar and initializes the viewer with the file URI.

## Configuration

```python
# invenio.cfg
OAREPO_PREVIEWER_ENABLED = ["mol"]  # default
OAREPO_PREVIEWER_MOL_MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024
```

Set `OAREPO_PREVIEWER_ENABLED = []` to manage `PREVIEWER_PREFERENCE`
manually.

### Content Security Policy (Molstar)

Molstar may issue `fetch` calls to external databases when a previewed file (e.g. an `.mvsj`/`.mvsx` MolViewSpec description) contains URLs pointing to remote resources. If your app sets `APP_DEFAULT_SECURE_HEADERS`, the default Content Security Policy will block these requests, so the policy needs to be relaxed for the molecular viewer to work.

`invenio.cfg` settings could be for instance:

```python
# invenio.cfg
APP_DEFAULT_SECURE_HEADERS = {
    "content_security_policy": {
        "default-src": [
            "'self'",
            "fonts.googleapis.com",
            "*.gstatic.com",
            "data:",
            "'unsafe-inline'",
            "blob:",
            "http://127.0.0.1:9000/",  # Development S3 server
            "https://licensebuttons.net/",
        ],
        "script-src": [
            "'self'",
            "blob:",
            "'wasm-unsafe-eval'",
        ],
        "connect-src": [
            "'self'",
            "http://127.0.0.1:9000",  # Development S3 server
            "https://*.rcsb.org",  # RCSB PDB (Protein Data Bank)
            "https://*.ebi.ac.uk",  # EBI (European Bioinformatics Institute)
            "https://*.pdbj.org",  # PDBj (Protein Data Bank Japan)
            "https://modelarchive.org",  # ModelArchive
            "https://*.expasy.org",  # ExPASy
            "https://pubchem.ncbi.nlm.nih.gov",  # PubChem
        ],
    }
}
```

The `connect-src` database entries are actually only needed if previewed files
reference remote resources — Molstar fetches them from the databases above.
If your records never contain such references, you can omit them (or add more if needed). Keep the
development S3 entries (`127.0.0.1:9000`) out of production deployments
and replace them with your actual file storage origin.

## Adding a contrib previewer

1. Create a module in `oarepo_previewer/previewers/` exposing
   `previewable_extensions` (list of extensions without a dot) and the
   `can_preview(file)` / `preview(file)` functions — see
   ([`invenio_previewer/extensions/json_prismjs.py`](https://github.com/inveniosoftware/invenio-previewer/blob/master/invenio_previewer/extensions/json_prismjs.py))
   for the contract. Templates go to `oarepo_previewer/templates/semantic-ui/oarepo_previewer/`.
2. Register it in `pyproject.toml`:

   ```toml
   [project.entry-points."invenio_previewer.previewers"]
   mol = "oarepo_previewer.previewers.mol "
   ```

3. Add its name to the default `OAREPO_PREVIEWER_ENABLED` in
   `oarepo_previewer/config.py`.

## Development

```bash
./run.sh --help   # oarepo library runner (tests, linting, ...)
./run.sh tests
```

## License

MIT — Copyright (C) 2026 CESNET z.s.p.o. See the [LICENSE](LICENSE) file.
