import { Navigate } from "react-router-dom";

/**
 * Legacy route.
 * Habits now live inside the Health page.
 */
export default function Habits() {
  return <Navigate to="/health" replace />;
}
