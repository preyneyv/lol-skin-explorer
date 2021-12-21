import Link from "next/link";
import { useRouter } from "next/router";

function _SkinViewer({ backTo, linkTo, collectionName, prev, next, skin }) {
  return (
    <div>
      <div>{collectionName}</div>
      {prev && (
        <Link href={linkTo(prev.id)}>
          <a>{prev.name}</a>
        </Link>
      )}
      <div>{skin.name}</div>
      {next && (
        <Link href={linkTo(next.id)}>
          <a>{next.name}</a>
        </Link>
      )}
    </div>
  );
}

export function SkinViewer(props) {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <>
        <div>Loading</div>
      </>
    );
  }

  return <_SkinViewer {...props} />;
}

export function prepareCollection(collection, idx) {
  const skin = collection[idx];
  let prev = null,
    next = null;
  if (collection.length > 1) {
    const prevSkin = collection[(idx === 0 ? collection.length : idx) - 1],
      nextSkin = collection[(idx + 1) % collection.length];

    prev = { name: prevSkin.name, id: prevSkin.id };
    next = { name: nextSkin.name, id: nextSkin.id };
  }

  return { skin, prev, next };
}
