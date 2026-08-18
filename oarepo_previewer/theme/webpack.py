#
# This file is part of Invenio.
# Copyright (C) 2015-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""JS/CSS bundles for oarepo-ui.

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
                "mol_previewer": "./js/oarepo_previewer/mol_previewer/index.js",
            },
            "dependencies": {
            },
            "devDependencies": {"eslint-plugin-i18next": "^6.0.3"},
            "aliases": {
                # search and edit
                "@js/oarepo_previewer/mol_previewer": "js/oarepo_previewer/mol_previewer",
            },
        }
    },
)