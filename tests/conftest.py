#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Pytest fixtures."""

from __future__ import annotations

import pytest
from flask import Flask


@pytest.fixture
def app():
    """Bare Flask application with the extension initialized."""
    from oarepo_previewer.ext import OARepoPreviewerExt

    app = Flask(__name__)
    OARepoPreviewerExt(app)
    return app
