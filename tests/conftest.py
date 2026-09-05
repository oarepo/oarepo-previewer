#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

from __future__ import annotations

import pytest
from invenio_app.factory import create_app as invenio_create_app

pytest_plugins = [
    "pytest_oarepo.fixtures",
    "pytest_oarepo.ui.fixtures",
]


@pytest.fixture(scope="module")
def create_app(instance_path, entry_points):
    """Spins up a combined UI/API app instead of just API.

    This ensures flask-webpackext context processors are loaded for Jinja.
    """
    return invenio_create_app


@pytest.fixture(scope="module")
def app_config(app_config):
    app_config["OAREPO_PREVIEWER_ENABLED"] = ["mol"]
    app_config["OAREPO_PREVIEWER_MOL_MAX_FILE_SIZE_BYTES"] = 200 * 1024 * 1024
    return app_config


@pytest.fixture(scope="module")
def base_app(base_app):
    """Ensure previewer extensions are loaded."""
    from invenio_previewer.ext import InvenioPreviewer

    from oarepo_previewer.ext import OARepoPreviewerExt

    if "invenio-previewer" not in base_app.extensions:
        InvenioPreviewer(base_app)
    if "oarepo-previewer" not in base_app.extensions:
        OARepoPreviewerExt(base_app)

    return base_app
