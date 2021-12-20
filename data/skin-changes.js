import pLimit from "p-limit";
import Fuse from "fuse.js";

import { splitId } from "./helpers";
import cheerio from "cheerio";

const aliases = {
  "Nunu Bot": "Nunu & Willump Bot",
};

const ignoreMissing = [
  // Unmasked Kayle => Transcended Kayle, 9.5
  "Unmasked Kayle",
  // Crimson Akali => Infernal Akali, 8.15
  "Crimson Akali",
];

// -----

// Populated at runtime.
export const changes = {};

const limit = pLimit(10);

export async function updateSkinChanges(patch) {
  console.log("[Skin Changes] Updating...");
  const [champions, skins] = await Promise.all([patch.champions, patch.skins]);
  await Promise.all(
    champions.map((c) =>
      limit(async () => Object.assign(changes, await getSkinArtChanges(c)))
    )
  );
  console.log("[Skin Changes] Update complete.");
}

/**
 * Parse a champion's Patch History page from Fandom to find which patches had
 * changed skins.
 *
 * https://leagueoflegends.fandom.com/wiki/Aatrox/LoL/Patch_history
 */
async function getSkinArtChanges(champion) {
  const changes = {};
  const champSkins = new Fuse(
    Object.values(skins).filter((skin) => splitId(skin.id)[0] === champion.id),
    {
      keys: ["name"],
      threshold: 0.05,
    }
  );

  const $ = cheerio.load(
    (
      await axios.get(
        `https://leagueoflegends.fandom.com/wiki/${champion.name}/LoL/Patch_history?action=render`
      )
    ).data,
    false
  );
}
