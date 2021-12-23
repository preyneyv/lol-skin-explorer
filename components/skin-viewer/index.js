import classNames from "classnames";
import { useSwipeable } from "react-swipeable";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useRef, useEffect, useMemo, useState } from "react";
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
  teemoGGUrl,
  useEscapeTo,
  useLocalStorageState,
} from "../../data/helpers";
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
  const showUIRef = useRef();

  useEffect(() => {
    setDeltaX(0);
    setSmoothX(false);
    setExiting(false);
    setLoaded(false);
  }, [skin]);

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
        setTimeout(() => router.push(router.pathname, linkTo(next)), 300);
      }
      router.push(router.pathname, linkTo(next));
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
      if (e.code === "KeyZ") toggleFill();
      if (e.code === "KeyC") toggleCentered();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrevious, toggleFill, toggleCentered]);

  useEffect(() => {
    function onClick() {
      setShowInfoBox(false);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  });

  const vidPath = supportsVideo
    ? centered
      ? skin.splashVideoPath
      : skin.collectionSplashVideoPath
    : false;
  const imgPath = centered ? skin.splashPath : skin.uncenteredSplashPath;
  const handlers = useSwipeable({
    onSwiping(e) {
      if (!prev) return;
      setDeltaX(`${e.deltaX}px`);
      setSmoothX(false);
    },
    onSwiped() {
      setDeltaX(`0px`);
      setSmoothX(true);
    },
    onSwipedLeft(e) {
      e.velocity > 0.8 && goNext(true);
    },
    onSwipedRight(e) {
      e.velocity > 0.8 && goPrevious(true);
    },
    delta: 10,
  });
  return (
    <>
      <Head>
        <title>{skin.name} &middot; Skin Explorer</title>
        {prefetchSkin(skin, true)}
        {prev && prefetchSkin(prev, false)}
        {next && prefetchSkin(next, false)}
      </Head>
      <div
        className={classNames(styles.viewer, {
          [styles.exiting]: exiting,
          [styles.smoothX]: smoothX,
          [styles.loaded]: loaded,
          [styles.show]: showUI,
        })}
        {...handlers}
        onDoubleClick={toggleFill}
        onMouseMove={() => setShowUI(true)}
      >
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
            <span>{skin.name}</span>
            <Info />
          </div>
          <div className={styles.popup}>
            {skin.description ? (
              <p dangerouslySetInnerHTML={{ __html: skin.description }} />
            ) : (
              <p>
                <i>No description available.</i>
              </p>
            )}
          </div>
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
              <source src={asset(vidPath)} />
            </video>
          ) : (
            <Image
              unoptimized
              priority
              src={asset(imgPath)}
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
              style={{ objectFit: fill ? "cover" : "contain" }}
              onLoadedData={() => setLoaded(true)}
            >
              <source src={asset(vidPath)} />
            </video>
          ) : (
            <Image
              priority
              unoptimized
              src={asset(imgPath)}
              layout="fill"
              alt={skin.name}
              objectFit={fill ? "cover" : "contain"}
              onLoadingComplete={() => setLoaded(true)}
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
    prev = collection[(idx === 0 ? collection.length : idx) - 1];
    next = collection[(idx + 1) % collection.length];
  }

  return { skin, prev, next };
}
