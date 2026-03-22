import { useState } from "react";
import "./App.css"; 

function App() {
  const [abaAtiva, setAbaAtiva] = useState("home");

  const depoimentoTeste = {
    nomeCachorro: "Thor",
    nomeTutor: "Mariana Silva",
    raca: "Golden Retriever",
    data: "22/03/2026",
    comentario:
      "Thor adorou passar o dia na creche! Foi muito bem cuidado, brincou bastante e voltou para casa muito feliz.",
  };

  return (
    <div className="page">
      <header className="header-area">
        <h1 className="logo">PetLove Center</h1>
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
            <h2 className="home-title">Bem-vindo à PetLove Center</h2>
            <p className="home-text">
              Nossa creche para cães foi pensada para oferecer segurança,
              socialização, conforto e bem-estar para os pets durante toda a
              permanência.
            </p>
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