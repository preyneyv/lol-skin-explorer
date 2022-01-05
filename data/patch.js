// import axios from "axios";
import { CDRAGON } from "./constants";
// import { skinlineSkins } from "./helpers";
import { cache } from "./cache";

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
  name = "pbe";
  fullVersionString = null;

  _champions = null;
  _skinlines = null;
  _skins = null;
  _universes = null;
  _added = null;

  get champions() {
    return new Promise(async (resolve) => {
      if (this._champions !== null) return resolve(this._champions);
      resolve((this._champions = await cache.get("champions")));
      console.log(`[Patch ${this.name}] Loaded champions.`);
    });
  }

  get skinlines() {
    return new Promise(async (resolve) => {
      if (this._skinlines !== null) return resolve(this._skinlines);
      resolve((this._skinlines = await cache.get("skinlines")));
      console.log(`[Patch ${this.name}] Loaded skinlines.`);
    });
  }

  get universes() {
    return new Promise(async (resolve) => {
      if (this._universes !== null) return resolve(this._universes);
      resolve((this._universes = await cache.get("universes")));
      console.log(`[Patch ${this.name}] Loaded universes.`);
    });
  }

  get skins() {
    return new Promise(async (resolve) => {
      if (this._skins !== null) return resolve(this._skins);
      resolve((this._skins = await cache.get("skins")));
      console.log(`[Patch ${this.name}] Loaded skins.`);
    });
  }

  get added() {
    return new Promise(async (resolve) => {
      if (this._added !== null) return resolve(this._added);
      resolve((this._added = await cache.get("added")));
      console.log(`[Patch ${this.name}] Loaded added.`);
    });
  }

  /**
   * Pull the latest data from remote sources (CommunityDragon, Fandom).
   * Returns whether there was a change in the version string.
   */
  async fetch() {
    if (this.fullVersionString) {
      console.log(`Checking for new changes on ${this.name}`);
    }

    const { oldVersionString: verString } = await cache.get("persistentVars");
    if (verString === this.fullVersionString) {
      // Patch has not changed! We can early-exit.
      return false;
    }

    if (this.fullVersionString) {
      console.log(
        `Patch ${this.name} has changed! (${this.fullVersionString} => ${verString})`
      );
    }
    this.fullVersionString = verString;

    // We can assume we need to fetch new data here. Delete all cached copies.
    this._champions =
      this._skinlines =
      this._skins =
      this._universes =
      this._added =
        null;
    return true;
  }

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
