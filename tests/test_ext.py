#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Tests for the Flask extension."""

from __future__ import annotations

from flask import Flask

from oarepo_previewer.ext import OARepoPreviewerExt


def test_extension_registered(app):
    """Extension registers itself on the app."""
    assert "oarepo-previewer" in app.extensions


def test_default_config(app):
    """Default config is initialized with the OAREPO_PREVIEWER_ prefix."""
    assert app.config["OAREPO_PREVIEWER_ENABLED"] == []


def test_enabled_previewers_prepended():
    """Enabled previewers get prepended to PREVIEWER_PREFERENCE."""
    app = Flask(__name__)
    app.config["OAREPO_PREVIEWER_ENABLED"] = ["yaml_prismjs"]
    app.config["PREVIEWER_PREFERENCE"] = ["pdfjs"]
    OARepoPreviewerExt(app)

    assert app.config["PREVIEWER_PREFERENCE"] == ["yaml_prismjs", "pdfjs"]


def test_existing_preference_list_not_mutated():
    """A pre-existing PREVIEWER_PREFERENCE list object is not mutated."""
    app = Flask(__name__)
    app.config["OAREPO_PREVIEWER_ENABLED"] = ["yaml_prismjs"]
    original = ["pdfjs"]
    app.config["PREVIEWER_PREFERENCE"] = original
    OARepoPreviewerExt(app)

    assert original == ["pdfjs"]
