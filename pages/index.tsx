import UI from "./components/UI";
import Head from "next/head";

export default function Home() {

  return (
    <>
    <Head>
        <title>Pokedex</title>
        <link rel="icon" href="/assets/icons/Pokedex-logo.svg" type="image/icon" />
    </Head>

    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}> 
      <UI />
    </main>
    </>
  );

}
