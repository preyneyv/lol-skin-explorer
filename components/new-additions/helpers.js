import { store } from "../../data/store";
import { splitId } from "../../data/helpers";

export async function prepareAdditions() {
  const { added, skins, champions } = store.patch;

  return added.skins
    .map((id) => skins[id])
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map((skin) => {
      const cId = splitId(skin.id)[0];
      const champ = champions.find((c) => c.id === cId);
      return { ...skin, $$key: champ.key };
    });
}
