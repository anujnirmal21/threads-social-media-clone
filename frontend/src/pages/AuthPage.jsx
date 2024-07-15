import { useState } from "react";
import SignUp from "../components/SingnUp";
import Login from "../components/Login";

export default function AuthPage() {
  const [authToggle, setAuthToggle] = useState(false);
  return (
    <>
      {authToggle ? (
        <SignUp setAuthToggle={setAuthToggle} authToggle={authToggle} />
      ) : (
        <Login setAuthToggle={setAuthToggle} authToggle={authToggle} />
      )}
    </>
  );
}
