#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Tests for the Molstar previewer skeleton."""

from __future__ import annotations

from pathlib import Path

import pytest
from jinja2 import ChoiceLoader, DictLoader, FileSystemLoader

from oarepo_previewer.previewers import mol

from .conftest import MockPreviewFile

MVSJ = b"""{
  "kind": "single",
  "root": {
    "kind": "download",
    "url": "https://example.org/files/1crn.bcif"
  },
  "metadata": {"version": "1.5.0", "timestamp": "2026-01-01T00:00:00Z"}
}
"""


@pytest.fixture
def render_app(previewer_app):
    """App able to render our package templates with a stubbed abstract one."""
    previewer_app.config["PREVIEWER_ABSTRACT_TEMPLATE"] = "invenio_previewer/abstract_previewer.html"
    templates_dir = Path(mol.__file__).parent.parent / "templates" / "semantic-ui"
    previewer_app.jinja_loader = ChoiceLoader(
        [
            DictLoader({"invenio_previewer/abstract_previewer.html": ("{% block panel %}{% endblock %}")}),
            FileSystemLoader(str(templates_dir)),
        ]
    )
    return previewer_app


@pytest.mark.parametrize("filename", ["scene.mvsj", "scene.mvsx", "SCENE.MVSJ"])
def test_can_preview(app, filename):
    assert mol.can_preview(MockPreviewFile(filename, MVSJ))


def test_cannot_preview_other_extensions(app):
    assert not mol.can_preview(MockPreviewFile("scene.json", MVSJ))
    assert not mol.can_preview(MockPreviewFile("mvsj", MVSJ))


def test_cannot_preview_non_local(app):
    assert not mol.can_preview(MockPreviewFile("scene.mvsj", MVSJ, local=False))


def test_preview_renders_mvsj_data(render_app):
    html = mol.preview(MockPreviewFile("scene.mvsj", MVSJ))

    assert 'id="molstar-viewer"' in html
