import { RouteObject, createBrowserRouter } from "react-router-dom";
import Root from "../pages/root";
import { WEB_TYPE } from "../utils/constants";
import EmployeeSurveyPage from "../pages/employee-survey";
import ChatPage from "../pages/chat";
import CustomerSurveyPage from "../pages/customer-survey";
import EmployeeBenefitsPage from "../pages/employee-benefits";
import ClubprintempsPage from "../pages/clubprintemps";
import LoginPage from "../pages/login";
import LoginSuccessPage from "../pages/login-success";
import ChatBasePage from "../pages/chatbase";
import IFlyWaiverPage from "../pages/dohaquest/ifly-waiver";

const routes_private: RouteObject[] = [
  {
    path: "/employee",
    element: <EmployeeSurveyPage />,
  },
  {
    path: "/chat",
    element: <ChatBasePage />,
  },
  {
    path: "/chat/old",
    element: <ChatPage />,
  },
  {
    path: "/survey/retail",
    element: <CustomerSurveyPage type="retail" />,
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/login-success", element: <LoginSuccessPage /> },
];
const routes_public: RouteObject[] = [
  {
    path: "/survey/fnb",
    element: <CustomerSurveyPage type="fnb" />,
  },
  {
    path: "/employee-benefits",
    element: <EmployeeBenefitsPage />,
  },
  {
    path: "/clubprintemps",
    element: <ClubprintempsPage />,
  },
  {
    path: "/dohaquest",
    children: [{ path: "ifly-waiver", element: <IFlyWaiverPage /> }],
  },
];

const routesObject: Record<string, RouteObject[]> = {
  default: [...routes_private, ...routes_public],
  public: routes_public,
  private: routes_private,
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <div className="w-full h-screen flex items-center justify-center">
        <h3 className="text-2xl font-bold">Nothing here. Just go back. 🙊</h3>
      </div>
    ),
    children: routesObject[WEB_TYPE],
  },
]);

export default router;
