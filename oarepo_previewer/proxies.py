#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Helper proxies to access the extension state."""

from __future__ import annotations

from flask import current_app
from werkzeug.local import LocalProxy

current_oarepo_previewer = LocalProxy(lambda: current_app.extensions["oarepo-previewer"])
"""Proxy to the current :class:`oarepo_previewer.ext.OARepoPreviewerExt`."""
