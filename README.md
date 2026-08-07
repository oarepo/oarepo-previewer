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

| Entry point | Extensions | Notes |
|-------------|------------|-------|
| `mvs` | `.mvsj`, `.mvsx` (MolViewSpec) | Skeleton: extracts the MolViewSpec description (`.mvsj`; `.mvsx` container unpack is a TODO) and passes it to the template as `mvs_data`, which renders the raw content. Plugging in an actual MolViewSpec-aware JavaScript viewer is left to the deployment — see the integration point in `oarepo_previewer/templates/semantic-ui/oarepo_previewer/mvs.html`. |

## Configuration

```python
# invenio.cfg
OAREPO_PREVIEWER_ENABLED = ["mvs"]  # default
OAREPO_PREVIEWER_MVS_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
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
   mvs = "oarepo_previewer.previewers.mvs"
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
