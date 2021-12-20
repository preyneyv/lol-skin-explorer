import axios from "axios";
import { CDRAGON } from "./constants";
import { comparePatches, compareVersions, Patch } from "./patch";

/**
 * Minimum interval in between store updates, in seconds.
 */
const REVALIDATE_INTERVAL = 60;

/**
 * The lowest patch number that will be displayed on the website.
 */
const MIN_SUPPORTED_PATCH = [7, 21];

const PATCH_REGEX = /^\d+\.\d+$/g;

export class Store {
  patches = {};
  live = null;
  pbe = new Patch("pbe", true);

  lastUpdate = 0;
  fetching = false;

  async fetch() {
    if (this.fetching) return;
    const now = Date.now();
    if (now - this.lastUpdate < REVALIDATE_INTERVAL * 1000) return;

    this.lastUpdate = now;
    this.fetching = true;

    const patchStrings = (await axios.get(`${CDRAGON}/json`)).data
      .filter(
        (entry) => entry.type === "directory" && entry.name.match(PATCH_REGEX)
      )
      .map((e) => e.name)
      .sort((a, b) => -comparePatches(a, b));

    // For all new patches, create new Patch objects
    patchStrings
      .filter((n) => !this.patches[n])
      .map((name) => new Patch(name))
      .filter((patch) => patch.cmp(MIN_SUPPORTED_PATCH) >= 0)
      .map((patch) => (this.patches[patch.name] = patch));

    const patches = Object.values(this.patches);

    // Mark the right patch as live.
    patches.map((p) => {
      p.isLive = p.name == patchStrings[0];
      if (p.isLive) this.live = p;
    });

    // Wait for all patches to fetch new data.
    await Promise.all([
      this.pbe.fetch(),
      ...Object.values(this.patches).map((p) => p.fetch()),
    ]);

    this.fetching = false;
  }
}

export const store = new Store();
