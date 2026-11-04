{ pkgs, ... }:

{
  languages.typst.enable = true;
  languages.javascript = {
    enable = true;
    pnpm.enable = true;
  };
  packages = [ pkgs.qrencode pkgs.python3 ];

  # podglad lokalny: `serve` -> http://localhost:4321/
  scripts.serve.exec = ''pnpm --dir "$DEVENV_ROOT" dev'';

  # kody QR: `qr <adres bazowy>` -> public/qr/main.svg, public/qr/general.svg
  scripts.qr.exec = ''
    base="''${1:?podaj adres bazowy, np. https://geraldserafin.com}"
    base="''${base%/}"
    mkdir -p "$DEVENV_ROOT/public/qr"
    qrencode -t SVG -m 1 -l M -o "$DEVENV_ROOT/public/qr/main.svg" "$base/"
    qrencode -t SVG -m 1 -l M -o "$DEVENV_ROOT/public/qr/general.svg" "$base/general/"
  '';

  # arkusz z wrozbami do druku: `print` -> print/fortunes.pdf
  scripts.print.exec = ''typst compile --root "$DEVENV_ROOT" "$DEVENV_ROOT/print/fortunes.typ" "$DEVENV_ROOT/print/fortunes.pdf"'';
}
