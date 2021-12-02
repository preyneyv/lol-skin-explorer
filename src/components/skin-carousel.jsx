import {
  asset,
  champions,
  rarity,
  skinlines,
  splitId,
  teemoGGUrl,
} from "../data";
import {
  ArrowLeft,
  ExternalLink,
  Info,
  Maximize2,
  Minimize2,
  User,
  Users,
} from "react-feather";
import { Link, useNavigate, generatePath } from "react-router-dom";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { useTitle } from "../hooks";

export function SkinCarousel({
  back,
  skins,
  current,
  title,
  linkTo,
  showSkinline,
  showChampion,
}) {
  const [hovering, setHovering] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [centered, setCentered] = useState(false);
  const [fill, setFill] = useState(false);
  useEffect(() => {
    setLoaded(false);
  }, [current, centered]);
  const navigate = useNavigate();

  const currentIdx = skins.findIndex((s) => s.id === current);
  let nextSkin, prevSkin;
  const currentSkin = skins[currentIdx];
  if (skins.length > 1) {
    prevSkin = skins[(currentIdx === 0 ? skins.length : currentIdx) - 1];
    nextSkin = skins[(currentIdx + 1) % skins.length];
  }

  useTitle(currentSkin.name);

  const r = rarity(currentSkin);
  const champId = splitId(current)[0];
  const champ = champions.find((c) => c.id === champId);
  const skinLines = currentSkin.skinLines?.length
    ? currentSkin.skinLines.map((l) => skinlines.find((l2) => l2.id === l.id))
    : [];

  console.log(champ, skinLines);

  useEffect(() => {
    function onKeyDown(e) {
      if (skins.length > 1) {
        if (e.key === "ArrowLeft") navigate(linkTo(prevSkin));
        if (e.key === "ArrowRight") navigate(linkTo(nextSkin));
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [skins, prevSkin, nextSkin, linkTo, navigate]);

  const vidPath = centered
    ? currentSkin.splashVideoPath
    : currentSkin.collectionSplashVideoPath;
  const imgPath = centered
    ? currentSkin.splashPath
    : currentSkin.uncenteredSplashPath;

  return (
    <div className="skin-carousel">
      {!loaded && (
        <div className="preloader">
          <div>
            <div />
            <div />
            <div />
          </div>
        </div>
      )}
      <header>
        <Link to={back}>
          <ArrowLeft />
          <span>{title}</span>
        </Link>
        <div className="btn" onClick={() => setFill(!fill)}>
          {fill ? <Minimize2 /> : <Maximize2 />}
        </div>
        <div className="btn" onClick={() => setCentered(!centered)}>
          {centered ? <User /> : <Users />}
        </div>
      </header>
      <div className="mouse-event-block" />
      {prevSkin && (
        <Link
          to={linkTo(prevSkin)}
          className="prev"
          onMouseOver={() => setHovering("prev")}
          onMouseOut={() => setHovering("")}
        >
          <img src={asset(prevSkin.splashPath)} alt={prevSkin.name} />
          <div>{prevSkin.name}</div>
        </Link>
      )}
      <div
        className={classNames("current", {
          "hover-prev": hovering === "prev",
          "hover-next": hovering === "next",
          fill: fill,
        })}
      >
        {vidPath ? (
          <video muted autoPlay loop src={asset(vidPath)} />
        ) : (
          <img
            onLoad={() => setLoaded(true)}
            className={classNames({
              loading: !loaded,
            })}
            src={asset(imgPath)}
            alt={currentSkin.name}
          />
        )}
      </div>
      <div className="overlay">
        <span>{currentSkin.name}</span>
        <Info />
        <div>
          <div className="header">
            {r && (
              <div className="rarity">
                <img src={r[0]} alt={r[1]} />
                <span>{r[1]}</span>
              </div>
            )}
            {showChampion && (
              <Link to={generatePath("/champions/:key", { key: champ.key })}>
                {champ.name}
              </Link>
            )}
            {showSkinline &&
              skinLines.length !== 0 &&
              skinLines.map((l) => (
                <Link
                  key={l.id}
                  to={generatePath("/skinlines/:id", { id: l.id })}
                >
                  {l.name}
                </Link>
              ))}
          </div>
          {currentSkin.description ? (
            <p dangerouslySetInnerHTML={{ __html: currentSkin.description }} />
          ) : (
            <p>
              <i>No description available.</i>
            </p>
          )}
          <a href={teemoGGUrl(currentSkin)} rel="noreferrer" target="_blank">
            View Model on Teemo.GG <ExternalLink size={12} />
          </a>
        </div>
      </div>
      {nextSkin && (
        <Link
          to={linkTo(nextSkin)}
          className="next"
          onMouseOver={() => setHovering("next")}
          onMouseOut={() => setHovering("")}
        >
          <img src={asset(nextSkin.splashPath)} alt={nextSkin.name} />
          <div>{nextSkin.name}</div>
        </Link>
      )}
    </div>
  );
}
