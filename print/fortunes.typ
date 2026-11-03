// Wrozby do ciasteczek: A4, 2 kolumny x 8 rzedow, ciac po liniach.
// kind: "dev" -> QR do /dev, "general" -> QR do wersji ogolnej.
#let fortunes = (
  (kind: "dev", text: [Zatrudnisz zdolnego młodego developera o imieniu Gerald, poznanego na Talent Days.]),
  (kind: "general", text: [Szczęśliwe liczby: *5 3 0 5 8 5 5 1 5*. Zadzwoń, nie sprawdzaj losowania.]),
  (kind: "dev", text: [Zadzwonisz dziś pod numer *530 585 515* w sprawie oferty pracy. To nie przypadek.]),
  (kind: "general", text: [Ciasteczko przewiduje, że ten rok zakończysz z nowym pracownikiem. Ma na imię Gerald.]),
)

#set page(paper: "a4", margin: (x: 0.8cm, y: 1.2cm))
#set text(font: ("Libertinus Serif", "New Computer Modern"), size: 9pt, lang: "pl")

#let slip(f) = block(
  width: 9.2cm, height: 2.7cm,
  stroke: (paint: luma(160), dash: "dashed", thickness: 0.5pt),
  inset: 0.25cm,
  grid(
    columns: (1fr, 2.1cm), column-gutter: 0.25cm,
    stack(
      spacing: 0.15cm,
      par(leading: 0.5em, text(size: 9.5pt, f.text)),
      v(1fr),
      text(size: 7pt, fill: luma(90))[Gerald Serafin · Talent Days · 530 585 515],
    ),
    align(horizon + center, image("../qr/" + f.kind + ".svg", width: 2.1cm)),
  ),
)

// 1 strona = 16 kartek, kazda wrozba 4x. 2 kopie strony = 32 ciasteczka.
#grid(
  columns: (9.2cm, 9.2cm), column-gutter: 0pt, row-gutter: 0pt,
  ..fortunes.map(f => range(4).map(_ => slip(f))).flatten(),
)
