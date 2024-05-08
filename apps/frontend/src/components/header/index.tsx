import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { getHeaderName } from "../../helpers";
import { API_SURVEY_URL } from "../../utils/constants";
// import Navigation from "../navigation";

export const Header = () => {
  let { pathname } = useLocation();

  const headerName = useMemo(() => {
    return getHeaderName(pathname);
  }, [pathname]);

  return (
    <header className="w-screen max-md:px-4 px-2 max-md:py-4 p-8 h-min flex gap-4 justify-center items-center bg-neutral  shadow-md shadow-gray-100">
      <div className="w-[720px] h-full flex flex:row justify-between items-center max-sm:flex-col max-md:items-start">
        <h1 className="text-left text-primary opacity-80 text-md max-md:text-sm">
          {headerName}
        </h1>

        <img
          src={`${API_SURVEY_URL}/media//do-logo-header.png`}
          alt="do-logo-header"
          className="w-36 h-auto object-contain flex max-md:w-24"
        />
      </div>
    </header>
  );
};

export default Header;
