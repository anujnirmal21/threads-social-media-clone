import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";

export default function ProtectedRoute({ children }) {
  const user = useRecoilValue(userAtom);

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}
