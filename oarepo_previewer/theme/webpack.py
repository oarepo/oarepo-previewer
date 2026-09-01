#
# Copyright (c) 2026 CESNET z.s.p.o.
#
# This file is a part of oarepo-previewer (see https://github.com/oarepo/oarepo-previewer).
#
# oarepo-previewer is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.
#
"""JS/CSS bundles for oarepo-previewer.

You include one of the bundles in a page like the example below (using
``base`` bundle as an example):

 .. code-block:: html

    {{ webpack['base.js']}}

"""

from __future__ import annotations

from invenio_assets.webpack import WebpackThemeBundle

theme = WebpackThemeBundle(
    __name__,
    "assets",
    default="semantic-ui",
    themes={
        "semantic-ui": {
            "entry": {
                "molstar_previewer": "./js/oarepo_previewer/molstar_previewer/index.js",
            },
            "dependencies": {
                "molstar": "^5.11.0",
            },
            "devDependencies": {},
            "aliases": {
                "@translations/oarepo_previewer/i18next": "./translations/oarepo_previewer/i18next.js",
            },
        }
    },
)
