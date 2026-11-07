#!/usr/bin/env python3
"""Extrait les blocs YAML de REPRISE.md vers les fichiers du dépôt.

Usage : python3 scripts/extract_reprise.py [REPRISE.md] [racine du dépôt]
"""
import pathlib
import re
import sys

src = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "REPRISE.md")
root = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ".")
text = src.read_text(encoding="utf-8")
blocks = re.findall(r"^```yaml\n(# fichier: (\S+)\n.*?)^```$", text, flags=re.S | re.M)
if not blocks:
    sys.exit("Aucun bloc YAML avec « # fichier: » trouvé.")
for body, path in blocks:
    out = root / path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(body, encoding="utf-8")
    print(f"{path} : {body.count(chr(10))} lignes")
