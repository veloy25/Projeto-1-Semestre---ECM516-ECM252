import { useState } from "react";

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
    <div style={styles.page}>
      <header style={styles.headerArea}>
        <h1 style={styles.logo}>PetLove Center</h1>
        <p style={styles.subtitle}>Cuidado, carinho e diversão para o seu cão</p>

        <nav style={styles.navWrapper}>
          <div style={styles.nav}>
            <button
              style={{
                ...styles.navButton,
                ...(abaAtiva === "home" ? styles.navButtonActive : {}),
              }}
              onClick={() => setAbaAtiva("home")}
            >
              Home
            </button>

            <button
              style={{
                ...styles.navButton,
                ...(abaAtiva === "depoimentos" ? styles.navButtonActive : {}),
              }}
              onClick={() => setAbaAtiva("depoimentos")}
            >
              Depoimentos
            </button>
          </div>
        </nav>
      </header>

      <main style={styles.main}>
        {abaAtiva === "home" && (
          <section style={styles.homeSection}>
            <h2 style={styles.homeTitle}>Bem-vindo à PetLove Center</h2>
            <p style={styles.homeText}>
              Nossa creche para cães foi pensada para oferecer segurança,
              socialização, conforto e bem-estar para os pets durante toda a
              permanência.
            </p>
          </section>
        )}

        {abaAtiva === "depoimentos" && (
          <section>
            <div style={styles.depoimentosHeader}>
              <h2 style={styles.title}>Depoimentos</h2>
              <button style={styles.addButton}>Adicionar depoimento</button>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Depoimento teste</h3>

              <div style={styles.infoGroup}>
                <p style={styles.text}>
                  <strong>Nome do cachorro:</strong> {depoimentoTeste.nomeCachorro}
                </p>
                <p style={styles.text}>
                  <strong>Nome do tutor:</strong> {depoimentoTeste.nomeTutor}
                </p>
                <p style={styles.text}>
                  <strong>Raça do cachorro:</strong> {depoimentoTeste.raca}
                </p>
                <p style={styles.text}>
                  <strong>Data:</strong> {depoimentoTeste.data}
                </p>
              </div>

              <div style={styles.commentBox}>
                <p style={styles.commentTitle}>Comentário:</p>
                <p style={styles.commentText}>{depoimentoTeste.comentario}</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f1e8",
    fontFamily: "Arial, sans-serif",
  },

  headerArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "40px",
    paddingBottom: "25px",
  },

  logo: {
    margin: 0,
    fontSize: "42px",
    fontWeight: "bold",
    color: "#4b3b2a",
    textAlign: "center",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: "25px",
    fontSize: "18px",
    color: "#7a6855",
    textAlign: "center",
  },

  navWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },

  nav: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    border: "1px solid #cfc7b8",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },

  navButton: {
    padding: "14px 28px",
    border: "none",
    borderRight: "1px solid #cfc7b8",
    backgroundColor: "#ffffff",
    color: "#3f352b",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  navButtonActive: {
    backgroundColor: "#b7b095",
    color: "#ffffff",
  },

  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "30px 20px 50px",
  },

  homeSection: {
    backgroundColor: "#ffffff",
    border: "1px solid #d8d1c3",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },

  homeTitle: {
    marginTop: 0,
    fontSize: "30px",
    color: "#3f352b",
  },

  homeText: {
    fontSize: "17px",
    color: "#5f564c",
    lineHeight: "1.6",
    marginBottom: 0,
  },

  depoimentosHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "12px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#3f352b",
  },

  addButton: {
    backgroundColor: "#7d8f69",
    color: "#ffffff",
    border: "none",
    padding: "12px 18px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #d8d1c3",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },

  cardTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "24px",
    color: "#3f352b",
  },

  infoGroup: {
    marginBottom: "20px",
  },

  text: {
    fontSize: "16px",
    color: "#4f463d",
    margin: "8px 0",
  },

  commentBox: {
    backgroundColor: "#f7f4ed",
    padding: "18px",
    border: "1px solid #ddd5c7",
  },

  commentTitle: {
    margin: "0 0 10px 0",
    fontWeight: "bold",
    color: "#3f352b",
  },

  commentText: {
    margin: 0,
    fontSize: "16px",
    color: "#5f564c",
    lineHeight: "1.5",
  },
};

export default App;