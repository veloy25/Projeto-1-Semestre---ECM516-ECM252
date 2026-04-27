import "../styles/Header.css";
import Navbar from "./NavBar";

function Header({
  isLogado,
  abaAtiva,
  setAbaAtiva,
  handleLogout,
  setAuthMode,
  setAuthError,
  setFeedbackMessage,
}) {
  return (
    <header className="header-area">
      <h1 className="logo">AUventura Park</h1>
      <p className="subtitle">
        {isLogado ? "Área do Cliente" : "Cuidado para seu pet, tranquilidade para você!"}
      </p>

      <Navbar
        isLogado={isLogado}
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        handleLogout={handleLogout}
        setAuthMode={setAuthMode}
        setAuthError={setAuthError}
        setFeedbackMessage={setFeedbackMessage}
      />
    </header>
  );
}

export default Header;