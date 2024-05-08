import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useMemo } from "react";
import { getPageConfig } from "../helpers";
import Header from "../components/header";
import { Helmet } from "react-helmet";
import { API_SURVEY_URL } from "../utils/constants";

function Root() {
  const { pathname } = useLocation();

  const { header } = useMemo(() => {
    const { header, theme } = getPageConfig(pathname);
    document.title = header ? `Doha Oasis | ${header}` : "Doha Oasis";
    document.querySelector("html")?.setAttribute("data-theme", theme);
    return { header };
  }, [pathname]);

  const showHeader = useMemo(() => {
    if (pathname.includes("/employee-benefits")) return false;
    if (pathname.includes("/clubprintemps")) return false;
    if (pathname.includes("/dohaquest")) return false;

    return true;
  }, [pathname]);
  return (
    <div className="w-full max-h-screen flex flex-col items-center justify-start bg-neutral overflow-x-hidden overflow-y-auto">
      <Helmet>
        <link rel="icon" href={`${API_SURVEY_URL}/media//favicon.ico`} />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`${API_SURVEY_URL}/media//apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${API_SURVEY_URL}/media//favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${API_SURVEY_URL}/media//favicon-16x16.png`}
        />
        <link rel="manifest" href={`${API_SURVEY_URL}/media//manifest.json`} />
        <link
          rel="mask-icon"
          href={`${API_SURVEY_URL}/media//safari-pinned-tab.svg`}
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#00aba9" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#78716c" />
        <meta
          name="description"
          content="Share Your Dining Experience to Help Us Serve You Better!"
        />

        <title>{header ? `Doha Oasis | ${header}` : "Doha Oasis"}</title>
      </Helmet>
      <div className="max-w-[720px] w-full min-h-screen flex flex-col items-center justify-start">
        <Suspense
          fallback={
            <div className="w-screen h-screen flex flex-col items-center justify-center">
              <p className="text-primary text-lg">Loading page...</p>
              <span className="loading loading-ball loading-lg text-primary"></span>
            </div>
          }
        >
          {showHeader && <Header />}
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default Root;
