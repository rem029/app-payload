import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/root";
import { RouteObjectWithLabel } from "../types";
import ExpenseTracker from "../pages/expense-tracker";

const routes: RouteObjectWithLabel[] = [
  {
    path: "/expense-tracker",
    element: <ExpenseTracker />,
    children: [
      { path: "page1", element: <ExpenseTracker /> },
      { path: "page2", element: <ExpenseTracker /> },
    ],
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <div className="w-full h-screen flex items-center justify-center">
        <h3 className="text-2xl font-bold">Nothing here. Just go back. 🙊</h3>
      </div>
    ),
    children: routes,
  },
]);

export default router;
