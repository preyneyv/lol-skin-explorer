import axios from "axios";
import { CDRAGON } from "./constants";
import { skinlineSkins } from "./helpers";

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

  get champions() {
    return new Promise(async (resolve) => {
      if (this._champions !== null) return resolve(this._champions);

      const { data } = await axios.get(this.data("/v1/champion-summary.json"));

      resolve(
        (this._champions = data
          .filter((d) => d.id !== -1)
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((a) => ({ ...a, key: a.alias.toLowerCase() })))
      );
      console.log(`[Patch ${this.name}] Loaded champions.`);
    });
  }

  get skinlines() {
    return new Promise(async (resolve) => {
      if (this._skinlines !== null) return resolve(this._skinlines);

      const { data } = await axios.get(this.data("/v1/skinlines.json"));

      resolve(
        (this._skinlines = data
          .filter((d) => d.id !== 0)
          .sort((a, b) => (a.name > b.name ? 1 : -1)))
      );

      console.log(`[Patch ${this.name}] Loaded skinlines.`);
    });
  }

  get universes() {
    return new Promise(async (resolve) => {
      if (this._universes !== null) return resolve(this._universes);

      const { data } = await axios.get(this.data("/v1/universes.json"));

      resolve(
        (this._universes = data
          .filter((d) => d.id !== 0)
          .sort((a, b) => (a.name > b.name ? 1 : -1)))
      );

      console.log(`[Patch ${this.name}] Loaded universes.`);
    });
  }

  get skins() {
    return new Promise(async (resolve) => {
      if (this._skins !== null) return resolve(this._skins);
      const { data } = await axios.get(this.data("/v1/skins.json"));
      Object.keys(data).map((id) => {
        const skin = data[id];
        if (skin.isBase) {
          skin.name = "Original " + skin.name;
        }
        if (skin.questSkinInfo) {
          // At the time of writing (12.1), only K/DA ALL OUT Seraphine (147001)
          const base = { ...skin };
          delete base.questSkinInfo;

          skin.questSkinInfo.tiers.map((tier) => {
            const s = { ...base, ...tier };
            data[s.id.toString()] = s;
          });
        }
      });

      resolve((this._skins = data));
      console.log(`[Patch ${this.name}] Loaded skins.`);
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

    const metadata = (await axios.get(this.url("/content-metadata.json"))).data;
    if (metadata.version === this.fullVersionString) {
      // Patch has not changed! We can early-exit.
      return false;
    }
    if (this.fullVersionString) {
      console.log(
        `Patch ${this.name} has changed! (${this.fullVersionString} => ${metadata.version})`
      );
    }
    this.fullVersionString = metadata.version;

    // We can assume we need to fetch new data here. Delete all cached copies.
    this._champions = this._skinlines = this._skins = this._universes = null;
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
