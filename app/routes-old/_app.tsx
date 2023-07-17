import { AppProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { WebsiteLayout } from "$components";

export default function App({ Component, url, route, params, data }: AppProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href={asset("/styles/css/global.css")} />
      </Head>

      {url.pathname.startsWith("/app")
        ? <Component />
        : (
          <WebsiteLayout pathname={url.pathname}>
            <Component />
          </WebsiteLayout>
        )}
    </>
  );
}
