import { useRouter } from "next/router";
import { useMemo, useRef, useState, useEffect } from "react";
import Fuse from "fuse.js";
import classNames from "classnames";
import { useData } from "../../data/contexts";
import styles from "./styles.module.scss";

export function Omnisearch() {
  const ref = useRef();
  const router = useRouter();
  const { champions, skinlines, skins } = useData();
  const fuse = useMemo(
    () =>
      new Fuse(
        champions
          .map((c) => ({ ...c, $$type: "champion" }))
          .concat(skinlines.map((l) => ({ ...l, $$type: "skinline" })))
          .concat(Object.values(skins).map((s) => ({ ...s, $$type: "skin" }))),
        { keys: ["name"] }
      ),
    [champions, skinlines, skins]
  );

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const matches = useMemo(
    () => (query.length ? fuse.search(query, { limit: 5 }) : []),
    [query, fuse]
  );

  useEffect(() => setSelected(0), [query]);

  function onSelect(type, entity) {
    if (type === "champion") {
      navigate(generatePath("/champions/:champion", { champion: entity.key }));
    }
    if (type === "skinline") {
      navigate(generatePath("/skinlines/:id", { id: entity.id }));
    }
    if (type === "skin") {
      const champId = splitId(entity.id)[0];
      const champ = champions.find((c) => c.id === champId);
      navigate(
        generatePath("/champions/:cKey/skins/:sId", {
          cKey: champ.key,
          sId: entity.id,
        })
      );
    }
  }

  function selectActive() {
    const opt = matches[selected];
    console.log(opt);
    onSelect(opt.item.$$type, opt.item);
    setQuery("");
  }

  useEffect(() => {
    function onKeyDown() {
      if (document.activeElement === document.body) {
        ref.current?.focus();
      }
    }
    document.addEventListener("keypress", onKeyDown);
    return () => document.removeEventListener("keypress", onKeyDown);
  });
  return (
    <div className={styles.search}>
      <input
        ref={ref}
        type="search"
        placeholder="Search "
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowResults(true)}
        onBlur={() => setShowResults(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            setSelected((selected + 1) % matches.length);
            e.preventDefault();
          }
          if (e.key === "ArrowUp") {
            setSelected((selected === 0 ? matches.length : selected) - 1);
            e.preventDefault();
          }
          if (e.key === "Enter" && matches.length) {
            selectActive();
            e.preventDefault();
            e.target.blur();
          }
        }}
      />
      {showResults && matches.length !== 0 && (
        <ul>
          {matches.map(({ item }, i) => (
            <li
              onMouseEnter={() => setSelected(i)}
              onMouseDown={selectActive}
              className={classNames(item.$$type, {
                [styles.selected]: selected === i,
              })}
              key={i}
            >
              {/* {item.$$type === "champion" ? (
                <img src={asset(item.squarePortraitPath)} alt={item.name} />
              ) : item.$$type === "skin" ? (
                <img src={asset(item.tilePath)} alt={item.name} />
              ) : null} */}
              <div>
                <div>{item.name}</div>
                {item.$$type === "champion" ? (
                  <span>Champion</span>
                ) : item.$$type === "skinline" ? (
                  <span>Skinline</span>
                ) : (
                  <span>Skin</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
