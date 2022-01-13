import Fuse from "fuse.js";
import { Patch } from "./patch";
import { splitId } from "./helpers";

const FUSE_OPTIONS = { keys: ["name", "searchString"], threshold: 0.3 };
const NON_ALPHANUMERIC_REGEX = /[^A-Za-z0-9]/g;

/**
 * Handle the logic behind cache invalidation and triggering all the datasets
 * to fetch new copies.
 */
export class Store {
  patch = new Patch();
  changes = require("./.cache/changes.json");

  constructor() {
    const { champions, skinlines, universes, skins } = this.patch;

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

  fuse = new Fuse([], FUSE_OPTIONS);
}

export const store = new Store();
