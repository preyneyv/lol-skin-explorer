import { splitId, teemoGGUrl } from "../../data/helpers";
import { store } from "../../data/store";

export async function prepareCollection(collection, idx) {
  const skin = collection[idx];
  const meta = (skin.$skinExplorer = {});

  const [champions, skinlines, universes, changes] = await Promise.all([
    store.patch.champions,
    store.patch.skinlines,
    store.patch.universes,
    store.skinChanges,
  ]);

  meta.changes = changes[skin.id] ?? false;
  const [cId] = splitId(skin.id);
  meta.champion = champions.find((c) => c.id === cId);
  meta.skinlines = (skin.skinLines ?? []).map(({ id }) =>
    skinlines.find((l) => l.id === id)
  );
  meta.skinlines = [
    ...new Map(meta.skinlines.map((item) => [item.id, item])).values(),
  ];
  meta.universes = meta.skinlines
    .map(({ id }) => universes.find((u) => u.skinSets.includes(id)))
    .filter((u) => u);
  meta.universes = [
    ...new Map(meta.universes.map((item) => [item.id, item])).values(),
  ];

  meta.universes;

  meta.teemoGGUrl = teemoGGUrl(skin, meta.champion);

  let prev = null,
    next = null;
  if (collection.length > 1) {
    prev = collection[(idx === 0 ? collection.length : idx) - 1];
    next = collection[(idx + 1) % collection.length];
  }

  return { skin, prev, next };
}
