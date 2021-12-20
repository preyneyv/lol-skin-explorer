import Link from "next/link";

export default function Other() {
  return <Link href="/">Back home</Link>;
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60,
  };
}
