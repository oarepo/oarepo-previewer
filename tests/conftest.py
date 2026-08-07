#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Pytest fixtures."""

from __future__ import annotations

import io
from pathlib import Path
from types import SimpleNamespace
from typing import BinaryIO

import pytest
from flask import Flask


@pytest.fixture
def app():
    """Bare Flask application with the extension initialized."""
    from oarepo_previewer.ext import OARepoPreviewerExt

    app = Flask(__name__)
    OARepoPreviewerExt(app)
    with app.app_context():
        yield app


class MockPreviewFile:
    """Duck-typed stand-in for invenio_previewer.api.PreviewFile."""

    def __init__(
        self,
        filename: str,
        content: bytes,
        size: int | None = None,
        local: bool = True,
    ) -> None:
        """Initialize mock with filename, content, size and locality flag."""
        self._filename = filename
        self._content = content
        self.size = size if size is not None else len(content)
        self._local = local

    @property
    def filename(self) -> str:
        """Get filename."""
        return self._filename

    def is_local(self) -> bool:
        """Check if file is local."""
        return self._local

    def has_extensions(self, *exts: str) -> bool:
        """Check if file has one of the extensions."""
        return Path(self._filename).suffix.lower() in exts

    def open(self) -> BinaryIO:
        """Open the file for reading."""
        return io.BytesIO(self._content)


@pytest.fixture
def previewer_app(app):
    """App with a stubbed invenio-previewer state on the extensions registry."""
    app.extensions["invenio-previewer"] = SimpleNamespace(js_bundles=[], css_bundles=[])
    return app
