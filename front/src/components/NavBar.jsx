import "../styles/Navbar.css";

function Navbar({
  isLogado,
  abaAtiva,
  setAbaAtiva,
  handleLogout,
  setAuthMode,
  setAuthError,
  setFeedbackMessage,
}) {
  if (isLogado) {
    return (
      <nav className="nav-wrapper">
        <div className="nav">
          <button
            className={`nav-button ${abaAtiva === "painel" ? "nav-button-active" : ""}`}
            onClick={() => setAbaAtiva("painel")}
          >
            Meu Pet
          </button>

          <button className="login-button logout-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav-wrapper">
      <div className="nav">
        <button
          className={`nav-button ${abaAtiva === "home" ? "nav-button-active" : ""}`}
          onClick={() => setAbaAtiva("home")}
        >
          Home
        </button>

        <button
          className={`nav-button ${abaAtiva === "login" ? "nav-button-active" : ""}`}
          onClick={() => {
            setAbaAtiva("login");
            setAuthMode("login");
            setAuthError("");
            setFeedbackMessage("");
          }}
        >
          Entrar/Criar
        </button>

        <button
          className={`nav-button ${abaAtiva === "depoimentos" ? "nav-button-active" : ""}`}
          onClick={() => setAbaAtiva("depoimentos")}
        >
          Depoimentos
        </button>
      </div>
    </nav>
  );
}

export default Navbar;