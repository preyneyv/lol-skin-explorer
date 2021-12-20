import Fuse from "fuse.js";
import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import pLimit from "p-limit";

const limit = pLimit(10);

const aliases = {
  "Nunu Bot": "Nunu & Willump Bot",
};

const ignoreMissing = [
  // Unmasked Kayle => Transcended Kayle, 9.5
  "Unmasked Kayle",
  // Crimson Akali => Infernal Akali, 8.15
  "Crimson Akali",
];

let champions, skins;

function splitId(id) {
  return [Math.floor(id / 1000), id % 1000];
}

let i = 1;

function parsePatch(str) {
  return str.split(".").map((s) => parseInt(s, 10));
}

async function getSkinArtChanges(champId) {
  const changes = {};
  const champion = champions.find((c) => c.id === champId);
  const champSkins = new Fuse(
    Object.values(skins).filter((skin) => splitId(skin.id)[0] === champId),
    {
      keys: ["name"],
      threshold: 0.05,
    }
  );

  console.log("Fetching", champion.name, `${i++}/${champions.length}`);
  const $ = cheerio.load(
    (
      await axios.get(
        `https://leagueoflegends.fandom.com/wiki/${champion.name}/LoL/Patch_history?action=render`
      )
    ).data,
    false
  );

  // const firstPatch = $("dl dt a").last().attr("title");

  const changePatches = $("dl dt a")
    .toArray()
    .filter((el) => {
      const t = $(el).attr("title");
      if (!t.startsWith("V")) return false;
      const split = t.slice(1).split(".");
      if (!split.length === 2) return false;

      const mapped = split.map((e) => parseInt(e, 10));
      if (mapped[0] > 7 || (mapped[0] === 7 && mapped[1] >= 21)) return true;

      return false;
    })
    .map((a) => a);

  $(changePatches).each(function () {
    const t = $(this).parents("dl");
    const c = t.next();
    const subset = c.find(':contains(" art")');
    if (!subset.length) return;

    const p = t.find("a").attr("title").slice(1);

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
            if (aliases[name]) {
              matches = champSkins.search(aliases[name], { limit: 1 });
            }

            if (!matches.length) {
              if (!ignoreMissing.includes(name)) {
                console.error(
                  `Couldn't find a match for ${name} (${champion.name}, ${p})`
                );
              }
              return;
            }
          }
          const skin = matches[0].item;
          changes[skin.id] = new Set([...(changes[skin.id] ?? []), p]);
        });
    });
  });
  return Object.keys(changes).reduce(
    (obj, key) => ({ ...obj, [key]: [...changes[key]] }),
    {}
  );
}

(async function () {
  champions = (
    await axios.get(
      "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json"
    )
  ).data.filter((i) => i.id !== -1);
  skins = (
    await axios.get(
      "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/skins.json"
    )
  ).data;

  const changes = {};

  await Promise.all(
    champions
      // .slice(0, 50)
      .map((c) =>
        limit(async () => Object.assign(changes, await getSkinArtChanges(c.id)))
      )
  );
  fs.writeFileSync("changes.json", JSON.stringify(changes, null, 2));
})();
