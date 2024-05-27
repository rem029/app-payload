import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect, useMemo } from "react";
import Header from "../components/header";
import { Helmet } from "react-helmet";
import { API_SURVEY_URL } from "../utils/constants";
import { capitalize } from "../helpers";
import Footer from "../components/footer";

const Root = () => {
  const { pathname } = useLocation();

  const header = useMemo(() => {
    if (pathname === "") return undefined;

    return capitalize(pathname.replaceAll("/", " "));
  }, [pathname]);

  useEffect(() => {
    document.title = header ? `Rem Apps | ${header}` : "Rem Apps";
    document.querySelector("html")?.setAttribute("data-theme", "default");
  }, [header]);

  return (
    <div className="w-full flex flex-col items-center justify-start bg-neutral">
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
        <meta name="description" content="Staging apps are deployed here" />

        <title>{header ? `Rem Apps | ${header}` : "Rem Apps"}</title>
      </Helmet>
      <div className="w-screen h-screen flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto">
        <Suspense
          fallback={
            <div className="w-screen h-screen flex flex-col items-center justify-center">
              <p className="text-primary text-lg">Loading page...</p>
              <span className="loading loading-ball loading-lg text-primary"></span>
            </div>
          }
        >
          <Header title={header} />
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default Root;
