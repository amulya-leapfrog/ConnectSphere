import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <Link to="/home">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/explore">Explore</Link>
    </div>
  );
}
