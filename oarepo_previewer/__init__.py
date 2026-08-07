#
# Copyright (C) 2026 CESNET z.s.p.o.
#
# oarepo-previewer is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.
#
"""OARepo contrib previewers for invenio-previewer."""

from __future__ import annotations

from importlib.metadata import PackageNotFoundError, version

from .ext import OARepoPreviewerExt

try:
    __version__ = version("oarepo-previewer")
except PackageNotFoundError:
    __version__ = "0.0.0dev0+unknown"

"""Version of the library."""

__all__ = ("OARepoPreviewerExt", "__version__")
