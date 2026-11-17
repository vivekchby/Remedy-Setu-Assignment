import { Link, useNavigate } from "react-router-dom";

export default function Header({ dashboard = false }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("leadflow_token");
    navigate("/login");
  }

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Remedy Setu LeadFlow home">
        <span className="brand-mark" aria-hidden="true">ॐ</span>
        <span className="brand-copy">Remedy Setu<span>LEADFLOW</span></span>
      </Link>
      <nav>
        {dashboard ? (
          <button className="button button-outline button-small" onClick={logout}>Logout</button>
        ) : (
          <Link className="nav-link" to="/login">Sales login</Link>
        )}
      </nav>
    </header>
  );
}
