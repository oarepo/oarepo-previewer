#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Tests for the Molstar previewer."""

import pytest
from unittest.mock import Mock
from oarepo_previewer.previewers import mol


@pytest.mark.parametrize(
    "ext",
    [
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
    ],
)
def test_extension_can_preview(app, ext):
    mock_file = Mock()

    mock_file.filename = f"1cbs.{ext}"
    mock_file.size = 1024
    mock_file.is_local = lambda: True
    mock_file.has_extensions = lambda *exts: any(
        mock_file.filename.endswith(e) for e in exts
    )

    with app.app_context():
        assert mol.can_preview(mock_file)


def test_cannot_preview_nonlocal_file(app):
    mock_file = Mock()
    mock_file.filename = "1cbs.mvsj"
    mock_file.size = 1024
    mock_file.is_local = lambda: False
    mock_file.has_extensions = lambda *exts: any(
        mock_file.filename.endswith(e) for e in exts
    )

    with app.app_context():
        assert not mol.can_preview(mock_file)


def test_cannot_preview_oversize_file(app):
    mock_file = Mock()
    mock_file.filename = "1cbs.mvsj"
    mock_file.size = (200 * 1024 * 1024) + 1
    mock_file.is_local = lambda: True
    mock_file.has_extensions = lambda *exts: any(
        mock_file.filename.endswith(e) for e in exts
    )

    with app.app_context():
        assert not mol.can_preview(mock_file)


def test_can_preview_maxsize_file(app):
    mock_file = Mock()
    mock_file.filename = "1cbs.mvsj"
    mock_file.size = 200 * 1024 * 1024
    mock_file.is_local = lambda: True
    mock_file.has_extensions = lambda *exts: any(
        mock_file.filename.endswith(e) for e in exts
    )

    with app.app_context():
        assert mol.can_preview(mock_file)


def test_cannot_preview_other_extensions(app):
    mock_file = Mock()
    mock_file.filename = "document.pdf"
    mock_file.size = 1024
    mock_file.is_local = lambda: True
    mock_file.has_extensions = lambda *exts: any(
        mock_file.filename.endswith(e) for e in exts
    )

    with app.app_context():
        assert not mol.can_preview(mock_file)


def test_cannot_preview_other_extensions(app):
    mock_file = Mock()
    mock_file.filename = "document.jpg"
    mock_file.size = 1024
    mock_file.is_local = lambda: True
    mock_file.has_extensions = lambda *exts: any(
        mock_file.filename.endswith(e) for e in exts
    )

    with app.app_context():
        assert not mol.can_preview(mock_file)


def test_mvsj_preview_render(app):
    mock_file = Mock()
    mock_file.filename = "1cbs.mvsj"
    mock_file.size = 1024

    mock_file.file = Mock()
    mock_file.file.uri = "records/48egnewg5q/1cbs.mvsj"

    with app.test_request_context():
        html = mol.preview(mock_file)

        assert "molstar_previewer.js" in html
        assert "Preview" in html
