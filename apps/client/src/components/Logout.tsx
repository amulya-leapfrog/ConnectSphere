import { clearCookieStorage } from "../utils/cookies";

export default function Logout() {
  const handleLogout = () => {
    clearCookieStorage();
    window.location.reload();
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
