import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import { useData } from "../../data/contexts";
import { Omnisearch } from "../omnisearch";

export const Header = () => {
  const { patches, patch } = useData();
  const router = useRouter();

  const onSelectPatch = (e) => {
    const target = e.target.value;
    const here = router.pathname.replace("/[patchId]", "") || "/";

    if (target === "pbe") {
      router.push(here);
    } else {
      router.push({
        pathname: `/[patchId]${here}`,
        query: { patchId: target },
      });
    }
  };

  return (
    <header className={styles.header}>
      <div>
        <img src="/logo.png" alt="logo" />
      </div>
      <div>
        <Omnisearch />
      </div>
      <div>
        <select value={patch ?? "pbe"} onChange={onSelectPatch}>
          <option value="pbe">PBE</option>
          {patches.map((patch) => (
            <option key={patch} value={patch}>
              {patch}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};
