import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [isLogado, setIsLogado] = useState(false);
  const [depoimentos, setDepoimentos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingDepoimentos, setLoadingDepoimentos] = useState(false);
  const [formError, setFormError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [newDepoimento, setNewDepoimento] = useState({
    nomeCachorro: "",
    nomeTutor: "",
    raca: "",
    comentario: "",
  });

  const loadDepoimentos = async () => {
    setLoadingDepoimentos(true);
    setFormError("");

    try {
      const response = await fetch("/api/depoimentos");
      if (!response.ok) {
        throw new Error("Falha ao buscar depoimentos");
      }
      const data = await response.json();
      setDepoimentos(data);
    } catch (error) {
      console.error(error);
      setFormError("Nao foi possivel carregar os depoimentos. Tente novamente mais tarde.");
    } finally {
      setLoadingDepoimentos(false);
    }
  };

  useEffect(() => {
    if (abaAtiva === "depoimentos") {
      loadDepoimentos();
    }
  }, [abaAtiva]);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setIsLogado(true);
    setAbaAtiva("painel");
  };

  const handleLogout = () => {
    setIsLogado(false);
    setAbaAtiva("home");
  };

  const handleDepoimentoChange = (event) => {
    const { name, value } = event.target;
    setNewDepoimento((current) => ({ ...current, [name]: value }));
  };

  const handleDepoimentoSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFeedbackMessage("");

    const { nomeCachorro, nomeTutor, raca, comentario } = newDepoimento;
    if (!nomeCachorro || !nomeTutor || !raca || !comentario) {
      setFormError("Preencha todos os campos antes de enviar.");
      return;
    }

    try {
      const response = await fetch("/api/depoimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDepoimento),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Falha ao enviar depoimento.");
      }

      await loadDepoimentos();
      setFeedbackMessage("Depoimento enviado com sucesso!");
      setShowForm(false);
      setNewDepoimento({ nomeCachorro: "", nomeTutor: "", raca: "", comentario: "" });
    } catch (error) {
      console.error(error);
      setFormError("Nao foi possivel enviar o depoimento. Tente novamente.");
    }
  };

  if (isLogado) {
    return (
      <div className="page">
        <header className="header-area">
          <h1 className="logo">AUventura Park</h1>
          <p className="subtitle">Area do Cliente</p>

          <nav className="nav-wrapper">
            <div className="nav">
              <button
                className={`nav-button ${abaAtiva === "painel" ? "nav-button-active" : ""}`}
                onClick={() => setAbaAtiva("painel")}
              >
                Meu Pet
              </button>
              <button
                className="login-button"
                style={{ borderRight: "none", color: "#d9534f" }}
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          </nav>
        </header>

        <main className="main">
          {abaAtiva === "painel" && (
            <section className="card">
              <h2 className="card-title">Ola, Tutor!</h2>
              <p className="text">
                Aqui voce podera acompanhar a rotina do seu pet, verificar agendamentos e ver fotos das atividades diarias.
              </p>

              <div className="comment-box" style={{ marginTop: "20px" }}>
                <p className="comment-title">Status de hoje:</p>
                <p className="comment-text">O Thor esta brincando no patio principal com a turma dos grandalhoes!</p>
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header-area">
        <h1 className="logo">AUventura Park</h1>
        <p className="subtitle">Cuidado, carinho e diversao para o seu cao</p>

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
              onClick={() => setAbaAtiva("login")}
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
      </header>

      <main className="main">
        {abaAtiva === "home" && (
          <section className="home-section">
            <h2 className="home-title">Bem-vindo a AUventura Park</h2>
            <p className="home-text">
              Nossa creche para caes foi pensada para oferecer seguranca, socializacao, conforto e bem-estar durante toda a permanencia.
            </p>
          </section>
        )}

        {abaAtiva === "login" && (
          <section className="card login">
            <h2 className="card-title" style={{ textAlign: "center" }}>Acesse sua conta</h2>
            <p className="text" style={{ textAlign: "center", marginBottom: "25px" }}>
              Faça login para gerenciar as informacoes do seu pet.
            </p>

            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">E-mail:</label>
                <input type="email" id="email" className="form-input" placeholder="seu@email.com" required />
              </div>

              <div className="form-group">
                <label htmlFor="senha" className="form-label">Senha:</label>
                <input type="password" id="senha" className="form-input" placeholder="senha" required />
              </div>

              <button type="submit" className="add-button" style={{ width: "100%", marginTop: "15px" }}>
                Entrar
              </button>

              <button
                type="button"
                className="add-button"
                style={{ width: "100%", marginTop: "15px" }}
                onClick={() => setAbaAtiva("criarConta")}
              >
                Criar conta
              </button>
            </form>
          </section>
        )}

        {abaAtiva === "depoimentos" && (
          <section>
            <div className="depoimentos-header">
              <h2 className="title">Depoimentos</h2>
              <button className="add-button" onClick={() => setShowForm((current) => !current)}>
                {showForm ? "Fechar formulario" : "Adicionar depoimento"}
              </button>
            </div>

            {showForm && (
              <section className="card depoimento-form">
                <h3 className="card-title">Novo Depoimento</h3>
                {formError && <p className="text" style={{ color: "#d9534f" }}>{formError}</p>}
                {feedbackMessage && <p className="text" style={{ color: "#28a745" }}>{feedbackMessage}</p>}
                <form onSubmit={handleDepoimentoSubmit} className="login-form">
                  <div className="form-group">
                    <label htmlFor="nomeCachorro" className="form-label">Nome do cachorro:</label>
                    <input
                      id="nomeCachorro"
                      name="nomeCachorro"
                      className="form-input"
                      value={newDepoimento.nomeCachorro}
                      onChange={handleDepoimentoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nomeTutor" className="form-label">Nome do tutor:</label>
                    <input
                      id="nomeTutor"
                      name="nomeTutor"
                      className="form-input"
                      value={newDepoimento.nomeTutor}
                      onChange={handleDepoimentoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="raca" className="form-label">Raca do cachorro:</label>
                    <input
                      id="raca"
                      name="raca"
                      className="form-input"
                      value={newDepoimento.raca}
                      onChange={handleDepoimentoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="comentario" className="form-label">Comentario:</label>
                    <textarea
                      id="comentario"
                      name="comentario"
                      className="form-input"
                      value={newDepoimento.comentario}
                      onChange={handleDepoimentoChange}
                      rows={4}
                      required
                    />
                  </div>
                  <button type="submit" className="add-button" style={{ width: "100%", marginTop: "15px" }}>
                    Enviar depoimento
                  </button>
                </form>
              </section>
            )}

            <section className="depoimentos-list">
              {loadingDepoimentos && <p className="text">Carregando depoimentos...</p>}
              {formError && !showForm && <p className="text" style={{ color: "#d9534f" }}>{formError}</p>}
              {!loadingDepoimentos && depoimentos.length === 0 && (
                <p className="text">Ainda nao ha depoimentos cadastrados. Seja o primeiro a contribuir!</p>
              )}

              {depoimentos.map((depoimento) => (
                <div key={depoimento.id} className="card depoimento-card">
                  <h3 className="card-title">{depoimento.nomeCachorro}</h3>
                  <div className="info-group">
                    <p className="text"><strong>Tutor:</strong> {depoimento.nomeTutor}</p>
                    <p className="text"><strong>Raca:</strong> {depoimento.raca}</p>
                    <p className="text"><strong>Enviado em:</strong> {new Date(depoimento.criado_em).toLocaleDateString()}</p>
                  </div>
                  <div className="comment-box">
                    <p className="comment-title">Comentario:</p>
                    <p className="comment-text">{depoimento.comentario}</p>
                  </div>
                </div>
              ))}
            </section>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
