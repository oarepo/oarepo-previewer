#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""Package configuration."""

OAREPO_PREVIEWER_ENABLED: list[str] = []
"""Contrib previewers to register into invenio-previewer's ``PREVIEWER_PREFERENCE``.

Names must match entry points in the ``invenio_previewer.previewers`` group,
e.g. ``["yaml_prismjs"]``. Empty list leaves ``PREVIEWER_PREFERENCE`` untouched.
"""
