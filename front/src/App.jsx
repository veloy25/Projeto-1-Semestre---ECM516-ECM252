import { useState } from "react";
import "./App.css";

function App() {
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [isLogado, setIsLogado] = useState(false);

  const depoimentoTeste = {
    nomeCachorro: "Thor",
    nomeTutor: "Mariana Silva",
    raca: "Golden Retriever",
    data: "22/03/2026",
    comentario:
      "Thor adorou passar o dia na creche! Foi muito bem cuidado, brincou bastante e voltou para casa muito feliz.",
  };

  const handleLoginSubmit = () => {
    setIsLogado(true);
    setAbaAtiva("painel");
  };

  const handleLogout = () => {
    setIsLogado(false);
    setAbaAtiva("home");
  };

  if (isLogado) {
    return (
      <div className="page">
        <header className="header-area">
          <h1 className="logo">AUventura Park</h1>
          <p className="subtitle">Área do Cliente</p>

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
              <h2 className="card-title">Olá, Tutor!</h2>
              <p className="text">Aqui você poderá acompanhar a rotina do seu pet, verificar agendamentos e ver fotos das atividades diárias.</p>

              <div className="comment-box" style={{ marginTop: "20px" }}>
                <p className="comment-title">Status de hoje:</p>
                <p className="comment-text">🐾 O Thor está brincando no pátio principal com a turma dos grandalhões!</p>
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
        <p className="subtitle">Cuidado, carinho e diversão para o seu cão</p>

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
      </header>

      <main className="main">
        {abaAtiva === "home" && (
          <section className="home-section">
            <h2 className="home-title">Bem-vindo à AUventura Park</h2>
            <p className="home-text">
              Nossa creche para cães foi pensada para oferecer segurança,
              socialização, conforto e bem-estar para os pets durante toda a
              permanência.
            </p>
          </section>
        )}

        
        {abaAtiva === "login" && (
          <section className="card login">
            <h2 className="card-title" style={{ textAlign: "center" }}>Acesse sua conta</h2>
            <p className="text" style={{ textAlign: "center", marginBottom: "25px" }}>
              Faça login para gerenciar as informações do seu pet.
            </p>

            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">E-mail:</label>
                <input type="email" id="email" className="form-input" placeholder="seu@email.com" required />
              </div>

              <div className="form-group">
                <label htmlFor="senha" className="form-label">Senha:</label>
                <input type="password" id="senha" className="form-input" placeholder="••••••••" required />
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
              <button className="add-button">Adicionar depoimento</button>
            </div>

            <div className="card">
              <h3 className="card-title">Depoimento teste</h3>

              <div className="info-group">
                <p className="text">
                  <strong>Nome do cachorro:</strong> {depoimentoTeste.nomeCachorro}
                </p>
                <p className="text">
                  <strong>Nome do tutor:</strong> {depoimentoTeste.nomeTutor}
                </p>
                <p className="text">
                  <strong>Raça do cachorro:</strong> {depoimentoTeste.raca}
                </p>
                <p className="text">
                  <strong>Data:</strong> {depoimentoTeste.data}
                </p>
              </div>

              <div className="comment-box">
                <p className="comment-title">Comentário:</p>
                <p className="comment-text">{depoimentoTeste.comentario}</p>
              </div>
            </div>
          </section>
        )}


      </main>
    </div>
  );
}

export default App;