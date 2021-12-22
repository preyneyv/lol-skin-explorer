import Fuse from "fuse.js";
import axios from "axios";
import { CDRAGON, REVALIDATE_INTERVAL } from "./constants";
import { parsePatch, comparePatches, Patch } from "./patch";
// import { fetchSkinChanges } from "./skin-changes";
import { splitId } from "./helpers";

const PATCH_REGEX = /^\d+\.\d+$/;
const FUSE_OPTIONS = { keys: ["name", "searchString"], threshold: 0.3 };
const NON_ALPHANUMERIC_REGEX = /[^A-Za-z0-9]/g;

/**
 * Handle the logic behind cache invalidation and triggering all the datasets
 * to fetch new copies.
 */
export class Store {
  patch = new Patch();
  // patches = [];
  _skinChanges = {};

  fuse = new Fuse([], FUSE_OPTIONS);

  lastUpdate = 0;
  fetching = false;

  async fetch() {
    if (this.fetching) return;
    const now = Date.now();
    if (now - this.lastUpdate < REVALIDATE_INTERVAL * 1000) return;

    this.lastUpdate = now;
    this.fetching = true;

    await Promise.all([
      (async () => {
        // Get listing of patches from CD
        // this.patches = (await axios.get(`${CDRAGON}/json`)).data
        //   .filter(
        //     (entry) =>
        //       entry.type === "directory" && entry.name.match(PATCH_REGEX)
        //   )
        //   .map((e) => parsePatch(e.name))
        //   .sort((a, b) => -comparePatches(a, b));
      })(),
      (async () => {
        // Update the stored patch.
        const changed = await this.patch.fetch();

        if (changed) {
          // Create a new Fuse index
          const [champions, skinlines, skins, universes] = await Promise.all([
            this.patch.champions,
            this.patch.skinlines,
            this.patch.skins,
            this.patch.universes,
          ]);
          this.fuse = new Fuse(
            champions
              .map((c) => ({
                key: c.key,
                name: c.name,
                image: c.squarePortraitPath,
                type: "champion",
              }))
              .concat(
                universes.map((u) => ({
                  id: u.id,
                  name: u.name,
                  type: "universe",
                }))
              )
              .concat(
                skinlines.map((l) => ({
                  id: l.id,
                  name: l.name,
                  type: "skinline",
                }))
              )
              .concat(
                Object.values(skins).map((s) => {
                  const cId = splitId(s.id)[0];
                  const champ = champions.find((c) => c.id === cId);
                  return {
                    id: s.id,
                    key: champ.key,
                    name: s.name,
                    image: s.tilePath,
                    type: "skin",
                  };
                })
              )
              .map((obj) => ({
                ...obj,
                searchString: obj.name.replace(NON_ALPHANUMERIC_REGEX, ""),
              })),
            FUSE_OPTIONS
          );
        }
      })(),
    ]);

    // this.skinChanges =
    //   (await fetchSkinChanges(this.patch, this.patches)) || this.skinChanges;

    this.fetching = false;
  }
}

export const store = new Store();
