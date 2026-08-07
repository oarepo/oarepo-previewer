#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Flask extension registering OARepo contrib previewers."""

from __future__ import annotations

from typing import TYPE_CHECKING

from . import config

if TYPE_CHECKING:
    from flask import Flask


class OARepoPreviewerExt:
    """Extension registering contrib previewers with invenio-previewer.

    The previewer entry points (``invenio_previewer.previewers`` group) are
    picked up by invenio-previewer itself. This extension only makes sure
    that the contrib previewers listed in ``OAREPO_PREVIEWER_ENABLED`` are
    present in invenio-previewer's ``PREVIEWER_PREFERENCE`` config, so that
    they are actually used for previewing.
    """

    def __init__(self, app: Flask | None = None) -> None:
        """Initialize the extension.

        Args:
            app (Optional[Flask]): The Flask application instance.

        """
        if app:
            self.init_app(app)

    def init_app(self, app: Flask) -> None:
        """Initialize the Flask application with the extension.

        Initializes default configuration and registers enabled contrib
        previewers into invenio-previewer's preference list.

        Args:
            app (Flask): The Flask application instance.

        """
        self.init_config(app)
        self.register_previewers(app)
        app.extensions["oarepo-previewer"] = self

    def init_config(self, app: Flask) -> None:
        """Initialize default configuration, prefixed ``OAREPO_PREVIEWER_``."""
        for k in dir(config):
            if k.startswith("OAREPO_PREVIEWER_"):
                app.config.setdefault(k, getattr(config, k))

    def register_previewers(self, app: Flask) -> None:
        """Add enabled contrib previewers to ``PREVIEWER_PREFERENCE``.

        Enabled previewers are inserted at the front of the preference list
        so that they win over invenio-previewer's built-ins. A new list is
        created so that invenio-previewer's module-level default is not
        mutated in place.
        """
        enabled = list(app.config["OAREPO_PREVIEWER_ENABLED"])
        preference = list(app.config.get("PREVIEWER_PREFERENCE") or [])
        for name in reversed(enabled):
            if name not in preference:
                preference.insert(0, name)
        app.config["PREVIEWER_PREFERENCE"] = preference
