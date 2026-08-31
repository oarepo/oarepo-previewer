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

| Extension | Format |
|-----------|--------|
| `.mvsj` | MolViewSpec JSON description |
| `.mvsx` | MolViewSpec ZIP container |
| `.pdb` | Protein Data Bank |
| `.ent` | PDB legacy format |
| `.cif` | Crystallographic Information File |
| `.bcif` | Binary CIF (compressed) |
| `.mcif` | Magnetic CIF |
| `.mmcif` | Macro-molecular CIF |
| `.mol` / `.sdf` / `.sd` | MDL Molfile |
| `.mol2` | Tripos Mol2 |
| `.gro` | GROMACS structure |
| `.xyz` | XYZ coordinate format |
| `.pdbqt` | PDBQT (AutoDock) |

The previewer leverages Molstar's native support for these formats, providing 3D visualization directly in the browser. Configuration is handled via the template which loads Molstar and initializes the viewer with the file URI.

## Configuration

```python
# invenio.cfg
OAREPO_PREVIEWER_ENABLED = ["mol"]  # default
OAREPO_PREVIEWER_MOL_MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024
```

Set `OAREPO_PREVIEWER_ENABLED = []` to manage `PREVIEWER_PREFERENCE`
manually.

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
