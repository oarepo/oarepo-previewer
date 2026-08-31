#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Previewer for molecular (such as `.pdb`, `.cif`) and MolViewSpec (`.mvsj`/`.mvsx`) files.

A ``.mvsj`` file is a JSON description of a molecular visualization;
a ``.mvsx`` file is a ZIP container bundling that description together
with its data files.

Only file URL is passed to the template.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from flask import current_app, render_template
from invenio_previewer.proxies import current_previewer

if TYPE_CHECKING:
    from invenio_previewer.api import PreviewFile

previewable_extensions = [
    "mvsj",
    "mvsx",
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
]
"""File extensions that can be previewed by this previewer."""


def can_preview(file: PreviewFile) -> bool:
    """Determine if the given file can be previewed."""
    extensions_with_dots = [f".{ext}" for ext in previewable_extensions]
    max_file_size = current_app.config.get("OAREPO_PREVIEWER_MOL_MAX_FILE_SIZE_BYTES", 200 * 1024 * 1024)

    return bool(file.is_local() and file.has_extensions(*extensions_with_dots)) and file.size <= max_file_size


def preview(file: PreviewFile) -> str:
    """Render the preview template."""
    return str(
        render_template(
            "oarepo_previewer/molstar_previewer.html",
            file_uri=file.uri,
            js_bundles=current_previewer.js_bundles,
            css_bundles=current_previewer.css_bundles,
        )
    )
