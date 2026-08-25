#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Package configuration."""

from __future__ import annotations

OAREPO_PREVIEWER_ENABLED = [
    "mol",
]
"""Contrib previewers to register into invenio-previewer's ``PREVIEWER_PREFERENCE``.

Names must match entry points in the ``invenio_previewer.previewers`` group.
Set to an empty list to leave ``PREVIEWER_PREFERENCE`` untouched.
"""
