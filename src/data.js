export const champions = [];
export const skinlines = [];
export const skins = {};
export let v = "";

const root = `https://raw.communitydragon.org/pbe`,
  dataRoot = `${root}/plugins/rcp-be-lol-game-data/global/default`;

export const _ready = (async () => {
  const version = await fetch(`${root}/content-metadata.json`, {
    method: "GET",
    cache: "no-cache",
  }).then((r) => r.json());
  v = version.version;
  const cacheBreak = `?${encodeURIComponent(version.version)}`;

  await Promise.all([
    fetch(`${dataRoot}/v1/champion-summary.json${cacheBreak}`)
      .then((res) => res.json())
      .then((data) =>
        data
          .filter((d) => d.id !== -1)
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((a) => ({ ...a, key: a.alias.toLowerCase() }))
      )
      .then((data) => champions.push(...data)),
    fetch(`${dataRoot}/v1/skinlines.json${cacheBreak}`)
      .then((res) => res.json())
      .then((data) =>
        data
          .filter((d) => d.id !== 0)
          .sort((a, b) => (a.name > b.name ? 1 : -1))
      )
      .then((data) => skinlines.push(...data)),
    fetch(`${dataRoot}/v1/skins.json${cacheBreak}`)
      .then((res) => res.json())
      .then((data) => Object.assign(skins, data)),
  ]).then(() => true);
  return true;
})();

export function splitId(id) {
  return [Math.floor(id / 1000), id % 1000];
}

export function championSkins(id) {
  return Object.values(skins).filter((skin) => splitId(skin.id)[0] === id);
}

export function skinlineSkins(id) {
  return Object.values(skins)
    .filter((skin) => skin.skinLines?.some((line) => line.id === id))
    .sort((a, b) => {
      const aId = splitId(a.id)[0];
      const bId = splitId(b.id)[0];
      const aIndex = champions.findIndex((c) => c.id === aId);
      const bIndex = champions.findIndex((c) => c.id === bId);
      return aIndex - bIndex;
    });
}

export function asset(path) {
  return path.replace("/lol-game-data/assets", dataRoot).toLowerCase();
}

const rarities = {
  kUltimate: ["ultimate.png", "Ultimate"],
  kMythic: ["mythic.png", "Mythic"],
  kLegendary: ["legendary.png", "Legendary"],
  kEpic: ["epic.png", "Epic"],
};

export function rarity(skin) {
  if (!rarities[skin.rarity]) return null;
  const [imgName, name] = rarities[skin.rarity];
  const imgUrl = `${dataRoot}/v1/rarity-gem-icons/${imgName}`;
  return [imgUrl, name];
}

export function teemoGGUrl(skin) {
  const [champId, skinId] = splitId(skin.id);
  const champ = champions.find((c) => c.id === champId).key;
  return `https://teemo.gg/model-viewer?game=league-of-legends&type=champions&object=${champ}&skinid=${champ}-${skinId}`;
}
