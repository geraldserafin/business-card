{ pkgs, ... }:

{
  languages.typst.enable = true;
  packages = [ pkgs.qrencode pkgs.python3 ];

  # podglad lokalny: `serve` -> http://localhost:8000
  scripts.serve.exec = ''python3 -m http.server 8000 --directory "$DEVENV_ROOT"'';

  # kody QR: `qr <adres bazowy>` -> qr/main.svg, qr/general.svg
  scripts.qr.exec = ''
    base="''${1:?podaj adres bazowy, np. https://geraldserafin.github.io/business-card}"
    base="''${base%/}"
    mkdir -p "$DEVENV_ROOT/qr"
    qrencode -t SVG -m 1 -l M -o "$DEVENV_ROOT/qr/main.svg" "$base/"
    qrencode -t SVG -m 1 -l M -o "$DEVENV_ROOT/qr/general.svg" "$base/general/"
  '';

  # arkusz z wrozbami do druku: `print` -> print/fortunes.pdf
  scripts.print.exec = ''typst compile --root "$DEVENV_ROOT" "$DEVENV_ROOT/print/fortunes.typ" "$DEVENV_ROOT/print/fortunes.pdf"'';
}
