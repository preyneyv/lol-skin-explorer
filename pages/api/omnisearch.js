import { store } from "../../data/store";

export default async function handler(req, res) {
  await store.fetch();
  const query = req.query.query ? req.query.query.trim() : "";

  let results;
  if (query.length) {
    results = store.fuse.search(query, { limit: 10 }).map((i) => i.item);
  } else {
    results = [];
  }

  res.status(200).send(results);
}
