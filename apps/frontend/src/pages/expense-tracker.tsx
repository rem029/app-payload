import { lazy } from "react";

const LazyExpenseTracker = lazy(() => import("../components/expense-tracker"));

const ExpenseTrackerPage = () => <LazyExpenseTracker />;

export default ExpenseTrackerPage;
