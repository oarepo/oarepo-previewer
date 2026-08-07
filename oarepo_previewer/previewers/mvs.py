#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Previewer skeleton for MolViewSpec (.mvsj / .mvsx) files.

A ``.mvsj`` file is a JSON description of a molecular visualization;
a ``.mvsx`` file is a ZIP container bundling that description together
with its data files.

Intentionally viewer-library agnostic: it extracts the file content and
passes it to the template as ``mvs_data``. Which MolViewSpec-aware
JavaScript viewer renders it is left to the deployment - see the template
for the integration point.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from flask import current_app, render_template
from invenio_previewer.proxies import current_previewer

if TYPE_CHECKING:
    from invenio_previewer.api import PreviewFile

previewable_extensions = ["mvsj", "mvsx"]
"""File extensions that can be previewed by this previewer."""


def can_preview(file: PreviewFile) -> bool:
    """Determine if the given file can be previewed."""
    max_size = current_app.config.get("OAREPO_PREVIEWER_MVS_MAX_FILE_SIZE_BYTES", 10 * 1024 * 1024)
    return bool(file.is_local() and file.has_extensions(".mvsj", ".mvsx")) and file.size <= max_size


def preview(file: PreviewFile) -> str:
    """Render the preview template with the file content as ``mvs_data``."""
    max_bytes = current_app.config["OAREPO_PREVIEWER_MVS_MAX_FILE_SIZE_BYTES"]
    with file.open() as fp:
        data = fp.read(max_bytes)

    is_container = bool(file.has_extensions(".mvsx"))
    # TODO(skeleton): .mvsx is a ZIP container - unpack it and pass the
    # embedded .mvsj description (and its data files) instead of None.
    return str(
        render_template(
            "oarepo_previewer/mvs.html",
            file=file,
            mvs_data=None if is_container else data.decode("utf-8", errors="ignore"),
            is_container=is_container,
            js_bundles=current_previewer.js_bundles,
            css_bundles=current_previewer.css_bundles,
        )
    )
