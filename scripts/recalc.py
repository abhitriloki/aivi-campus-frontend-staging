"""Recalculate and sanity-check an XLSX workbook.

This helper prefers LibreOffice if it is available. If no spreadsheet engine is
installed, it still marks the workbook for automatic recalculation on open and
checks for literal formula-error strings in cells.
"""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from openpyxl import load_workbook


ERROR_TOKENS = ("#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#N/A", "#NUM!", "#NULL!")


def scan_errors(path: Path) -> list[tuple[str, str, str]]:
    wb = load_workbook(path, data_only=False)
    findings: list[tuple[str, str, str]] = []
    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for cell in row:
                value = cell.value
                if isinstance(value, str) and any(token in value for token in ERROR_TOKENS):
                    findings.append((ws.title, cell.coordinate, value))
    return findings


def mark_for_recalc(path: Path) -> None:
    wb = load_workbook(path)
    wb.calculation.fullCalcOnLoad = True
    wb.calculation.forceFullCalc = True
    wb.calculation.calcMode = "auto"
    wb.save(path)


def recalc_with_libreoffice(path: Path) -> bool:
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice:
        return False

    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        work = tmpdir / path.name
        work.write_bytes(path.read_bytes())
        cmd = [
            soffice,
            "--headless",
            "--convert-to",
            "xlsx",
            "--outdir",
            str(tmpdir),
            str(work),
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if work.exists():
            path.write_bytes(work.read_bytes())
            return True
    return False


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python scripts/recalc.py <workbook.xlsx>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1]).resolve()
    if not path.exists():
        print(f"Workbook not found: {path}", file=sys.stderr)
        return 2

    mark_for_recalc(path)
    engine_used = recalc_with_libreoffice(path)
    errors = scan_errors(path)
    if errors:
        print("Formula error check failed:")
        for sheet, coord, value in errors:
            print(f"- {sheet}!{coord}: {value}")
        return 1

    engine_note = "LibreOffice recalculation completed" if engine_used else "No spreadsheet engine found; workbook marked for recalculation on open"
    print(f"{engine_note}. Formula error check: 0 errors.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
