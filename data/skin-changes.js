import pLimit from "p-limit";
import Fuse from "fuse.js";
import cheerio from "cheerio";
import axios from "axios";
import { splitId } from "./helpers";
import {
  ALIASES,
  IGNORED_WARNINGS,
  MIN_SUPPORTED_VERSION,
  SKIN_SCRAPE_INTERVAL,
} from "./constants";
import { parsePatch, comparePatches } from "./patch";

const limit = pLimit(10);

let lastUpdate = 0;

export async function fetchSkinChanges(patch, patches) {
  const now = Date.now();
  if (now - lastUpdate < SKIN_SCRAPE_INTERVAL * 1000) return false;
  lastUpdate = now;

  console.log("[Skin Changes] Updating...");
  const [champions, skins] = await Promise.all([patch.champions, patch.skins]);
  const changes = {};
  await Promise.all(
    champions
      .slice(0, 5)
      .map((c) =>
        limit(async () =>
          Object.assign(changes, await getSkinArtChanges(c, skins, patches))
        )
      )
  );
  console.log("[Skin Changes] Update complete.");
  return changes;
}

/**
 * Parse a champion's Patch History page from Fandom to find which patches had
 * changed skins.
 *
 * https://leagueoflegends.fandom.com/wiki/Aatrox/LoL/Patch_history
 */
async function getSkinArtChanges(champion, skins, patches) {
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

  $("dl dt a")
    .toArray()
    .filter((el) => {
      const t = $(el).attr("title");
      if (!t.startsWith("V")) return false;

      const split = t.slice(1).split(".");
      if (!split.length === 2) return false;

      const patch = split.map((e) => parseInt(e, 10));
      // Ignore 7.1, since we can't do anything with that information.
      if (comparePatches(patch, MIN_SUPPORTED_VERSION) <= 0) return false;

      return true;
    })
    .map((x) => {
      const t = $(x).parents("dl"),
        c = t.next(),
        subset = c.find(':contains(" art")');
      if (!subset.length) return;

      const patch = parsePatch(t.find("a").attr("title").slice(1));
      console.log(patches);
      const prevPatch =
        patches[
          patches.findIndex((p) => comparePatches(p, patch) === 0) + 1
        ].join(".");
      subset.each((_, el) => {
        $(el)
          .find("a[href]")
          .each((_, link) => {
            const name = $(link).text().trim();
            if (!name) return;

            let matches = champSkins.search(name, { limit: 1 });
            if (!matches.length) {
              if (name.startsWith("Original ")) {
                matches = champSkins.search(name.slice(9), { limit: 1 });
              }
              if (ALIASES[name]) {
                matches = champSkins.search(ALIASES[name], { limit: 1 });
              }

              if (!matches.length) {
                if (!IGNORED_WARNINGS.includes(name)) {
                  console.error(
                    `Couldn't find a match for ${name} (${champion.name}, ${p})`
                  );
                }
                return;
              }
            }
            const skin = matches[0].item;
            changes[skin.id] = new Set([
              ...(changes[skin.id] ?? []),
              prevPatch,
            ]);
          });
      });
    });

  return Object.keys(changes).reduce(
    (obj, key) => ({ ...obj, [key]: [...changes[key]] }),
    {}
  );
}
