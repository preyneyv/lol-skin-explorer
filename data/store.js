import axios from "axios";
import { CDRAGON, REVALIDATE_INTERVAL } from "./constants";
import { parsePatch, comparePatches, Patch } from "./patch";
import { fetchSkinChanges } from "./skin-changes";

const PATCH_REGEX = /^\d+\.\d+$/;

/**
 * Handle the logic behind cache invalidation and triggering all the datasets
 * to fetch new copies.
 */
export class Store {
  patch = new Patch();
  patches = [];
  skinChanges = {};

  lastUpdate = 0;
  fetching = false;

  async fetch() {
    if (this.fetching) return;
    const now = Date.now();
    if (now - this.lastUpdate < REVALIDATE_INTERVAL * 1000) return;

    this.lastUpdate = now;
    this.fetching = true;

    // Get listing of patches from CD
    this.patches = (await axios.get(`${CDRAGON}/json`)).data
      .filter(
        (entry) => entry.type === "directory" && entry.name.match(PATCH_REGEX)
      )
      .map((e) => parsePatch(e.name))
      .sort((a, b) => -comparePatches(a, b));

    this.skinChanges =
      (await fetchSkinChanges(this.patch, this.patches)) || this.skinChanges;

    this.fetching = false;
  }
}

export const store = new Store();
