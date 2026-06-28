export const manifest = {
  screens: {
    scr_z5j0hx: { name: "Accueil", route: "/#accueil", position: { "x": 160, "y": 220 } },
    scr_ulp25x: { name: "À Propos", route: "/#a-propos", position: { "x": 1560, "y": 220 } },
    scr_nhbps7: { name: "Nos Services", route: "/#services", position: { "x": 2960, "y": 220 } },
    scr_1xnyzq: { name: "Contact", route: "/#contact", position: { "x": 4360, "y": 220 } }
  },
  sections: {
    sec_zbovw6: { name: "Main Navigation", x: 0, y: 0, width: 5720, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_zbovw6", children: [
    { kind: "screen", id: "scr_z5j0hx" },
    { kind: "screen", id: "scr_ulp25x" },
    { kind: "screen", id: "scr_nhbps7" },
    { kind: "screen", id: "scr_1xnyzq" }]
  }]

};