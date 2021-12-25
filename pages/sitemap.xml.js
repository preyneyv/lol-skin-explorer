import { getServerSideSitemap } from "next-sitemap";
import { ROOT } from "../data/constants";
import { championSkins, skinlineSkins } from "../data/helpers";
import { store } from "../data/store";

const abs = (u) => ROOT + u;

const viewer = (url) => ({
  loc: abs(url),
  changefreq: "weekly",
  priority: 1,
});

const collection = (url) => ({
  loc: abs(url),
  changefreq: "weekly",
  priority: 0.7,
});

const index = (url) => ({
  loc: abs(url),
  changefreq: "weekly",
  priority: 0.5,
});

const fixed = (url) => ({
  loc: abs(url),
  changefreq: "weekly",
  lastmod: new Date().toISOString(),
  priority: 0.5,
});

export async function getServerSideProps(ctx) {
  await store.fetch();
  const fields = [
    index("/"),
    index("/skinlines"),
    index("/universes"),
    fixed("/about"),
    fixed("/changelog"),
  ];

  const [champions, skinlines, universes, skins] = await Promise.all([
    store.patch.champions,
    store.patch.skinlines,
    store.patch.universes,
    store.patch.skins,
  ]);

  champions.map((c) => {
    const s = championSkins(c.id, skins);
    fields.push(collection(`/champions/${c.key}`));
    fields.push(...s.map((s) => viewer(`/champions/${c.key}/skins/${s.id}`)));
  });

  const lineSkins = {};
  skinlines.map((l) => {
    const s = (lineSkins[l.id] = skinlineSkins(l.id, skins, champions));
    fields.push(collection(`/skinlines/${l.id}`));
    fields.push(...s.map((s) => viewer(`/skinlines/${l.id}/skins/${s.id}`)));
  });

  universes.map((u) => {
    const s = u.skinSets.map((l) => lineSkins[l]).flat();
    fields.push(collection(`/universes/${u.id}`));
    fields.push(...s.map((s) => viewer(`/universes/${u.id}/skins/${s.id}`)));
  });

  return getServerSideSitemap(ctx, fields);
}

export default function Page() {}
