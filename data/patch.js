import { CDRAGON } from "./constants";

export function parsePatch(s) {
  return s.split(".").map((s) => parseInt(s, 10));
}

export function comparePatches(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] > b[i]) return 1;
    else if (a[i] < b[i]) return -1;
  }
  return 0;
}

export class Patch {
  fullVersionString = require("./.cache/persistentVars.json").oldVersionString;

  champions = require("./.cache/champions.json");
  skinlines = require("./.cache/skinlines.json");
  skins = require("./.cache/skins.json");
  universes = require("./.cache/universes.json");
  added = require("./.cache/added.json");

  url(path) {
    return `${CDRAGON}/${this.name}${path}`;
  }

  data(path) {
    return this.url(`/plugins/rcp-be-lol-game-data/global/default${path}`);
  }

  asset(path) {
    return this.data(path.replace("/lol-game-data/assets", "").toLowerCase());
  }
}
