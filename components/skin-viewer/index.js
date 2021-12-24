import { Loading } from "../loading";
import { useCallback, useRef, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { useSwipeable } from "react-swipeable";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Info,
  Maximize2,
  Minimize2,
  User,
  Users,
} from "react-feather";
import {
  asset,
  rarity,
  useEscapeTo,
  useLocalStorageState,
} from "../../data/helpers";
import { Popup } from "./popup";
import styles from "./styles.module.scss";

const prefetchSkin = (skin, preload = true) => {
  const rel = preload ? "preload" : "prefetch";
  return skin.splashVideoPath ? (
    <>
      <link rel="prefetch" as="video" href={asset(skin.splashVideoPath)} />
      <link
        rel="prefetch"
        as="video"
        href={asset(skin.collectionSplashVideoPath)}
      />
    </>
  ) : (
    <>
      <link rel={rel} as="image" href={asset(skin.splashPath)} />
      <link rel={rel} as="image" href={asset(skin.uncenteredSplashPath)} />
    </>
  );
};

const canPlayWebM = () => {
  return (
    typeof window !== "undefined" &&
    document
      .createElement("video")
      .canPlayType('video/webm; codecs="vp8, vorbis"') === "probably"
  );
};

let draggingOrigin;

const clamp = (v) => Math.min(1, Math.max(0, v));

function _SkinViewer({
  backTo,
  linkTo,
  collectionName,
  collectionIcon,
  collectionPage,
  prev,
  next,
  skin,
}) {
  const meta = skin.$skinExplorer;
  const supportsVideo = useMemo(() => canPlayWebM(), []);
  const router = useRouter();
  useEscapeTo(backTo);
  const [centered, setCentered] = useLocalStorageState(
    "viewer__centered",
    false
  );
  const [fill, setFill] = useLocalStorageState("viewer__fill", false);
  const [deltaX, setDeltaX] = useState(0);
  const [smoothX, setSmoothX] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [position, setPosition] = useState({ top: 0.5, left: 0.5 });
  const [velocity, setVelocity] = useState({ top: 0, left: 0 });
  const [patch, setPatch] = useState("");
  const showUIRef = useRef();
  const dimensions = useRef({ width: 1, height: 1 });

  useEffect(() => {
    setDeltaX(0);
    setSmoothX(false);
    setExiting(false);
    setLoaded(false);
    setPosition({ top: 0.5, left: 0.5 });
    setPatch("");
    setVelocity({ top: 0, left: 0 });
  }, [skin]);

  useEffect(() => {
    if (Math.abs(velocity.top) < 0.000001 && Math.abs(velocity.left) < 0.000001)
      return;

    const i = requestAnimationFrame(() => {
      setPosition({
        top: clamp(position.top - velocity.top * 18),
        left: clamp(position.left - velocity.left * 18),
      });
      setVelocity({
        top: velocity.top * 0.95,
        left: velocity.left * 0.95,
      });
    });
    return () => cancelAnimationFrame(i);
  }, [position.top, position.left, velocity]);

  useEffect(() => {
    if (showUI) {
      clearTimeout(showUIRef.current);
      setTimeout(() => setShowUI(false), 3000);
    }
  }, [showUI, setShowUI]);

  const goPrevious = useCallback(
    (swipe) => {
      if (!prev || exiting) return;
      setExiting(true);

      if (swipe) {
        setDeltaX(swipe ? "100vw" : "80px");
        router.prefetch(router.pathname, linkTo(prev));
        setTimeout(() => router.push(router.pathname, linkTo(prev)), 300);
      } else {
        router.push(router.pathname, linkTo(prev));
      }
    },
    [router, linkTo, prev, setExiting, setDeltaX, exiting]
  );

  const goNext = useCallback(
    (swipe) => {
      if (!next || exiting) return;
      setExiting(true);

      if (swipe) {
        setDeltaX(swipe ? "-100vw" : "-80px");
        router.prefetch(router.pathname, linkTo(next));
        setTimeout(() => router.push(router.pathname, linkTo(next)), 300);
      } else {
        router.push(router.pathname, linkTo(next));
      }
    },
    [router, linkTo, next, setExiting, setDeltaX, exiting]
  );

  const toggleFill = useCallback(() => setFill(!fill), [fill, setFill]);

  const toggleCentered = useCallback(
    () => setCentered(!centered),
    [centered, setCentered]
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "ArrowLeft") goPrevious(false);
      if (e.key === "ArrowRight") goNext(false);
      if (meta.changes && e.key === "ArrowUp")
        setPatch(meta.changes[meta.changes.indexOf(patch) - 1] || "");
      if (meta.changes && e.key === "ArrowDown")
        setPatch(meta.changes[meta.changes.indexOf(patch) + 1] || patch);
      if (e.code === "KeyZ") toggleFill();
      if (e.code === "KeyC") toggleCentered();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrevious, toggleFill, toggleCentered, patch, meta.changes]);

  useEffect(() => {
    function onClick() {
      setShowInfoBox(false);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  });

  const doPan = (x, y, isDelta = false) => {
    const delta = isDelta
      ? [x, y]
      : [x - draggingOrigin[0], y - draggingOrigin[1]];
    const { width, height } = dimensions.current;
    !isDelta && (draggingOrigin = [x, y]);
    setPosition({
      left: clamp(
        position.left -
          delta[0] / ((width / height) * window.innerHeight - window.innerWidth)
      ),
      top: clamp(
        position.top -
          delta[1] / ((height / width) * window.innerWidth - window.innerHeight)
      ),
    });
  };

  const handlers = useSwipeable({
    onSwipeStart(e) {
      e.event.preventDefault();
      if (fill) {
        draggingOrigin = [e.deltaX, e.deltaY];
      }
    },
    onSwiping(e) {
      e.event.preventDefault();
      if (fill) {
        doPan(e.deltaX, e.deltaY);
      } else {
        if (!prev) return;
        if (e.dir === "Left" || e.dir === "Right") {
          setDeltaX(`${e.deltaX}px`);
          setSmoothX(false);
        }
      }
    },
    onSwiped(e) {
      e.event.preventDefault();
      if (fill) {
        const { width, height } = dimensions.current;
        let left = e.vxvy[0] / (width - window.innerWidth),
          top = e.vxvy[1] / (height - window.innerHeight);
        if (Math.abs(e.vxvy[0]) < 1) left = 0;
        if (Math.abs(e.vxvy[1]) < 1) top = 0;
        setVelocity({
          left,
          top,
        });
        draggingOrigin = null;
      } else {
        setDeltaX(`0px`);
        setSmoothX(true);
      }
    },
    onSwipedLeft(e) {
      e.event.preventDefault();
      !fill && e.velocity > 0.6 && goNext(true);
    },
    onSwipedRight(e) {
      e.event.preventDefault();
      !fill && e.velocity > 0.6 && goPrevious(true);
    },
    onSwipedUp(e) {
      e.event.preventDefault();

      if (meta.changes)
        setPatch(
          meta.changes[
            (meta.changes.indexOf(patch) + 1) % (meta.changes.length + 1)
          ] || ""
        );
    },
    preventDefaultTouchmoveEvent: true,
    delta: { left: 3, right: 3, up: 30 },
  });

  const vidPath = supportsVideo
    ? centered
      ? skin.splashVideoPath
      : skin.collectionSplashVideoPath
    : false;
  const imgPath = centered ? skin.splashPath : skin.uncenteredSplashPath;
  const objectFit = fill ? "cover" : "contain";
  const objectPosition = fill
    ? `${position.left * 100}% ${position.top * 100}% `
    : "center center";
  const r = rarity(skin);
  return (
    <>
      <Head>
        <title>{skin.name} &middot; Skin Explorer</title>
        <meta
          name="description"
          content={
            skin.description || `Look at the splash art for ${skin.name}!`
          }
        />
        {prefetchSkin(skin, true)}
        {prev && prefetchSkin(prev, false)}
        {next && prefetchSkin(next, false)}
        <style>
          {`
          body {
            overscroll-behavior: none;
          }
        `}
        </style>
      </Head>
      <div
        className={classNames(styles.viewer, {
          [styles.exiting]: exiting,
          [styles.smoothX]: smoothX,
          [styles.loaded]: loaded,
          [styles.fill]: fill,
          [styles.show]: showUI,
        })}
      >
        <div
          className={styles.hitbox}
          {...handlers}
          onTouchStart={() =>
            setVelocity({
              top: 0,
              left: 0,
            })
          }
          onDoubleClick={toggleFill}
          onMouseDown={(e) => {
            if (fill) {
              draggingOrigin = [e.screenX, e.screenY];
            }
          }}
          onMouseMove={(e) => {
            if (fill && draggingOrigin) {
              doPan(e.screenX, e.screenY);
            }
            setShowUI(true);
          }}
          onMouseUp={(e) => {
            draggingOrigin = null;
          }}
          onWheel={(e) => {
            if (fill) {
              doPan(-e.deltaX, -e.deltaY, true);
            }
          }}
        />
        <div className={styles.overlay}>
          <header>
            <Link href={collectionPage} as={backTo}>
              <a className={styles.backTo}>
                <ArrowLeft />
                <div>
                  {collectionIcon}
                  {collectionName}
                </div>
              </a>
            </Link>
            <div className={styles.controls}>
              <div onClick={toggleFill} title="Fill Screen (Z)">
                {fill ? <Minimize2 /> : <Maximize2 />}
              </div>
              <div onClick={toggleCentered} title="Centered (C)">
                {centered ? <User /> : <Users />}
              </div>
              {meta.changes && (
                <div>
                  <select
                    value={patch}
                    onChange={(e) => setPatch(e.target.value)}
                  >
                    <option disabled>Game Patch</option>
                    <option value="">PBE</option>
                    {meta.changes.map((patch) => (
                      <option key={patch} value={patch}>
                        {patch}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </header>
          {prev && (
            <Link href={router.pathname} as={linkTo(prev)}>
              <a className={styles.prev}>
                <ArrowLeft />
                <div>{prev.name}</div>
              </a>
            </Link>
          )}
          {next && (
            <Link href={router.pathname} as={linkTo(next)}>
              <a className={styles.next}>
                <div>{next.name}</div>
                <ArrowRight />
              </a>
            </Link>
          )}
        </div>
        <div
          className={classNames(styles.infoBox, { [styles.show]: showInfoBox })}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={styles.name}
            onClickCapture={(e) => setShowInfoBox(!showInfoBox)}
          >
            <span>
              {r && (
                <Image
                  src={r[0]}
                  title={r[1]}
                  alt={r[1]}
                  objectFit="contain"
                  objectPosition="center"
                  layout="fixed"
                  width={18}
                  height={18}
                />
              )}
              {skin.name}
            </span>
            <Info />
          </div>
          <Popup skin={skin} />
        </div>
        <div className={styles.letterBox}>
          {vidPath ? (
            <video
              muted
              autoPlay
              loop
              key={vidPath}
              style={{ objectFit: "cover" }}
            >
              <source src={asset(vidPath, patch || "pbe")} />
            </video>
          ) : (
            <Image
              unoptimized
              priority
              src={asset(imgPath, patch || "pbe")}
              layout="fill"
              alt={skin.name}
              objectFit="cover"
            />
          )}
        </div>

        <main
          className={styles.main}
          style={{ transform: `translateX(${deltaX})` }}
        >
          {vidPath ? (
            <video
              muted
              autoPlay
              loop
              key={vidPath}
              style={{ objectFit, objectPosition }}
              onLoadedData={() => setLoaded(true)}
              onLoadedMetadata={(e) => {
                dimensions.current = {
                  width: e.target.videoWidth,
                  height: e.target.videoHeight,
                };
              }}
            >
              <source src={asset(vidPath, patch || "pbe")} />
            </video>
          ) : (
            <Image
              priority
              unoptimized
              src={asset(imgPath, patch || "pbe")}
              layout="fill"
              alt={skin.name}
              objectFit={objectFit}
              objectPosition={objectPosition}
              onLoadingComplete={({ naturalHeight, naturalWidth }) => {
                dimensions.current = {
                  width: naturalWidth,
                  height: naturalHeight,
                };
                setLoaded(true);
              }}
            />
          )}
        </main>
      </div>
    </>
  );
}

export function SkinViewer(props) {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <>
        <div
          style={{
            display: "flex",
            height: "100vh",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </div>
      </>
    );
  }

  return <_SkinViewer {...props} />;
}
