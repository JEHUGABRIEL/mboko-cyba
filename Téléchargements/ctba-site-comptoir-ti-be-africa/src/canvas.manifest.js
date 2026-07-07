export const manifest = {
  screens: {
    scr_by17u4: { name: "Accueil", route: "/", position: { "x": 160, "y": 220 } },
    scr_xikz7q: { name: "Nos Services", route: "/services", position: { "x": 1560, "y": 220 } },
    scr_a4gw5r: { name: "Réalisations", route: "/realisations", position: { "x": 5760, "y": 220 } },
    scr_cmg3fg: { name: "Boutique", route: "/boutique", position: { "x": 2960, "y": 220 } },
    scr_utk5dh: { name: "Contact", route: "/contact", position: { "x": 4360, "y": 220 } },
    scr_n64azk: { name: "Dashboard Admin", route: "/admin", position: { "x": 160, "y": 2200 } }
  },
  sections: {
    sec_1bxq2n: { name: "Main Navigation", x: 0, y: 0, width: 7120, height: 1180 },
    sec_oudgbe: { name: "Admin Interface", x: 0, y: 1980, width: 1520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_1bxq2n", children: [
    { kind: "screen", id: "scr_by17u4" },
    { kind: "screen", id: "scr_xikz7q" },
    { kind: "screen", id: "scr_cmg3fg" },
    { kind: "screen", id: "scr_utk5dh" },
    { kind: "screen", id: "scr_a4gw5r" }]
  },
  { kind: "section", id: "sec_oudgbe", children: [
    { kind: "screen", id: "scr_n64azk" }]
  }]

};