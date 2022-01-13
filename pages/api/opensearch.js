import { store } from "../../data/store";

export default async function handler(req, res) {
  const query = req.query.query ? req.query.query.trim() : "";

  let results;
  if (query.length) {
    results = store.fuse.search(query, { limit: 10 }).map((i) => i.item);
  } else {
    results = [];
  }

  let unique = [];
  results.map((r) => !unique.includes(r.name) && unique.push(r.name));

  res.status(200).send([req.query.query ?? "", unique]);
}
