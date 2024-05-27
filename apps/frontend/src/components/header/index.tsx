import { API_SURVEY_URL } from "../../utils/constants";

export const Header = ({ title }: HeaderProps) => {
  return (
    <header className="w-screen max-md:px-4 px-2 max-md:py-4 p-8 h-min flex gap-4 justify-center items-center bg-neutral  shadow-md shadow-gray-100">
      <div className="w-[720px] h-full flex flex:row justify-between items-center max-sm:flex-col max-md:items-start">
        <div className="text-sm breadcrumbs">
          <ul>
            {title
              ?.split(" ")
              .filter((t) => t !== "")
              .map((t) => (
                <li>
                  <h1 className="text-left text-primary opacity-80 text-md max-md:text-sm">
                    {t.replaceAll("-", " ")}
                  </h1>
                </li>
              ))}
          </ul>
        </div>

        <img
          src={`${API_SURVEY_URL}/media//rem-logo-header.png`}
          alt="rem-logo-header"
          className="w-36 h-auto object-contain flex max-md:w-24"
        />
      </div>
    </header>
  );
};

interface HeaderProps {
  title?: string;
}

export default Header;
