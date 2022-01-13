import { store } from "../data/store";

export async function getServerSideProps(ctx) {
  const query = ctx.query.query ? ctx.query.query.trim() : "";
  let results;
  if (query.length) {
    results = store.fuse.search(query, { limit: 1 }).map((i) => i.item);
  } else {
    results = [];
  }

  if (!results.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const entity = results[0];

  const { type } = entity;
  let route;
  if (type === "champion") {
    route = `/champions/${entity.key}`;
  }
  if (type === "skinline") {
    route = `/skinlines/${entity.id}`;
  }
  if (type === "universe") {
    route = `/universes/${entity.id}`;
  }
  if (type === "skin") {
    route = `/champions/${entity.key}/skins/${entity.id}`;
  }

  return {
    redirect: {
      destination: route,
      permanent: false,
    },
  };
}

export default function Page() {}
