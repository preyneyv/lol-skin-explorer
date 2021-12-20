import { CDRAGON } from "./constants";
import { useData } from "./contexts";

export function dataRoot(patch = "pbe") {
  return `${CDRAGON}/${patch}/plugins/rcp-be-lol-game-data/global/default`;
}

export function splitId(id) {
  return [Math.floor(id / 1000), id % 1000];
}

export function useChampionSkins(id) {
  const { skins } = useData();
  return Object.values(skins).filter((skin) => splitId(skin.id)[0] === id);
}

export function useSkinlineSkins(id) {
  const { skins, champions } = useData();
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

export function asset(path, patch = "pbe") {
  return path.replace("/lol-game-data/assets", dataRoot(patch)).toLowerCase();
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
