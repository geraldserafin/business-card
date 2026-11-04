// Naklejki na folie: 52,5 x 27 mm, 4 x 11 = 44 na A4 od krawedzi do krawedzi.
// Siatka zaczyna sie w rogu kartki, wiec zewnetrzne krawedzie to krawedzie papieru.
// Ciac po szarych liniach (obwod + miedzy naklejkami).
#let (w, h, cols, rows) = (52.5mm, 27mm, 4, 11)

#let cutlines = {
  let stroke = 0.3pt + luma(150)
  for i in range(cols + 1) {
    place(top + left, dx: i * w, dy: 0pt, line(start: (0pt, 0pt), end: (0pt, rows * h), stroke: stroke))
  }
  for j in range(rows + 1) {
    place(top + left, dx: 0pt, dy: j * h, line(start: (0pt, 0pt), end: (cols * w, 0pt), stroke: stroke))
  }
}

#set page(paper: "a4", margin: 0pt, foreground: cutlines)

#grid(
  columns: (w,) * cols, rows: (h,) * rows,
  ..range(cols * rows).map(_ => image("naklejka.svg", width: w, height: h)),
)
