import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { asset } from "../../data/helpers";
import classNames from "classnames";
import styles from "./styles.module.scss";
import axios from "axios";

export function Omnisearch() {
  const ref = useRef();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios
      .get("/api/omnisearch", { params: { query } })
      .then((res) => setMatches(res.data));
  }, [query]);

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
        placeholder="Search"
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
          {matches.map((match, i) => (
            <li
              onMouseEnter={() => setSelected(i)}
              onMouseDown={selectActive}
              className={classNames(match.$$type, {
                [styles.selected]: selected === i,
              })}
              key={i}
            >
              {match.image && (
                <Image
                  src={asset(match.image)}
                  alt={match.name}
                  width={36}
                  height={36}
                />
              )}
              <div>
                <div>{match.name}</div>
                {match.type === "champion" ? (
                  <span>Champion</span>
                ) : match.type === "skinline" ? (
                  <span>Skinline</span>
                ) : match.type === "universe" ? (
                  <span>Universe</span>
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
