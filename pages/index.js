import { List } from "../layouts/list";

export default function Index() {
  return <List patch={null} />;
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 600,
  };
}
