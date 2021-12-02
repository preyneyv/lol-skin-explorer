import React, { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { _ready, champions, skinlines, skins, asset, splitId } from "../data";
import classNames from "classnames";
import { useNavigate, generatePath } from "react-router";

let fuse;
_ready.then(
  () =>
    (fuse = new Fuse(
      champions
        .map((c) => ({ ...c, $$type: "champion" }))
        .concat(skinlines.map((l) => ({ ...l, $$type: "skinline" })))
        .concat(Object.values(skins).map((s) => ({ ...s, $$type: "skin" }))),
      { keys: ["name"] }
    ))
);

export function Omnisearch() {
  const ref = useRef();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const matches = useMemo(
    () => (query.length ? fuse.search(query, { limit: 5 }) : []),
    [query]
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
    function onKeyDown(e) {
      if (e.code === "Slash" && e.altKey) {
        ref.current?.focus();
        e.preventDefault();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="search-container">
      <input
        ref={ref}
        type="search"
        placeholder="Search (Alt + /)"
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
              onClick={selectActive}
              className={classNames(item.$$type, {
                selected: selected === i,
              })}
              key={i}
            >
              {item.$$type === "champion" ? (
                <img src={asset(item.squarePortraitPath)} alt={item.name} />
              ) : item.$$type === "skin" ? (
                <img src={asset(item.tilePath)} alt={item.name} />
              ) : null}
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
