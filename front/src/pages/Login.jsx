import "../styles/Login.css";

function Login({
  authMode,
  setAuthMode,
  authName,
  setAuthName,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authError,
  feedbackMessage,
  authLoading,
  handleAuthSubmit,
  setAuthError,
  setFeedbackMessage,
}) {
  return (
    <section className="card login">
      <h2 className="card-title login-title">
        {authMode === "login" ? "Acesse sua conta" : "Crie sua conta"}
      </h2>

      <p className="text login-text">
        {authMode === "login"
          ? "Faça login para gerenciar as informações do seu pet."
          : "Cadastre-se para acessar o painel do tutor."}
      </p>

      <form onSubmit={handleAuthSubmit} className="login-form">
        {authMode === "signup" && (
          <div className="form-group">
            <label htmlFor="nome" className="form-label">Nome:</label>
            <input
              id="nome"
              type="text"
              className="form-input"
              value={authName}
              onChange={(event) => setAuthName(event.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">E-mail:</label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={authEmail}
            onChange={(event) => setAuthEmail(event.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha" className="form-label">Senha:</label>
          <input
            type="password"
            id="senha"
            className="form-input"
            value={authPassword}
            onChange={(event) => setAuthPassword(event.target.value)}
            placeholder="senha"
            required
          />
        </div>

        {authError && <p className="text auth-error">{authError}</p>}
        {feedbackMessage && <p className="text auth-success">{feedbackMessage}</p>}

        <button
          type="submit"
          className="add-button full-width-button"
          disabled={authLoading}
        >
          {authLoading
            ? "Carregando..."
            : authMode === "login"
            ? "Entrar"
            : "Criar conta"}
        </button>
      </form>

      <button
        type="button"
        className="add-button full-width-button switch-auth-button"
        onClick={() => {
          setAuthMode(authMode === "login" ? "signup" : "login");
          setAuthError("");
          setFeedbackMessage("");
        }}
      >
        {authMode === "login" ? "Ainda não tenho conta" : "Já tenho conta"}
      </button>
    </section>
  );
}

export default Login;