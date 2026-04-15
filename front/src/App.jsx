import { useEffect, useState } from "react";
import "./styles/global.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Depoimentos from "./pages/Depoimentos";

function App() {
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [isLogado, setIsLogado] = useState(false);
  const [user, setUser] = useState(null);

  const [authMode, setAuthMode] = useState("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const loadProfile = async () => {
      try {
        const response = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Token inválido");
        }

        const data = await response.json();
        setUser(data.user);
        setIsLogado(true);
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setIsLogado(false);
      }
    };

    loadProfile();
  }, []);

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

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setFeedbackMessage("");
    setAuthLoading(true);

    if (!authEmail || !authPassword || (authMode === "signup" && !authName)) {
      setAuthError("Preencha todos os campos obrigatórios.");
      setAuthLoading(false);
      return;
    }

    try {
      const endpoint = authMode === "login" ? "/api/login" : "/api/signup";

      const payload =
        authMode === "login"
          ? { email: authEmail, senha: authPassword }
          : { nome: authName, email: authEmail, senha: authPassword };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.error || "Falha na autenticação.");
      }

      if (authMode === "signup") {
        setFeedbackMessage("Conta criada com sucesso. Faça login para continuar.");
        setAuthMode("login");
        setAuthName("");
      } else {
        localStorage.setItem("authToken", responseBody.token);
        localStorage.setItem("authUser", JSON.stringify(responseBody.user));
        setUser(responseBody.user);
        setIsLogado(true);
        setAbaAtiva("painel");
      }

      setAuthEmail("");
      setAuthPassword("");
    } catch (error) {
      console.error(error);
      setAuthError(error.message || "Erro ao autenticar. Tente novamente.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    setIsLogado(false);
    setAbaAtiva("home");
    setAuthMode("login");
    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthError("");
    setFeedbackMessage("");
  };

  const handleDepoimentoChange = (event) => {
    const { name, value } = event.target;
    setNewDepoimento((current) => ({
      ...current,
      [name]: value,
    }));
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
      setNewDepoimento({
        nomeCachorro: "",
        nomeTutor: "",
        raca: "",
        comentario: "",
      });
    } catch (error) {
      console.error(error);
      setFormError("Nao foi possivel enviar o depoimento. Tente novamente.");
    }
  };

  return (
    <div className="page">
      <Header
        isLogado={isLogado}
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        handleLogout={handleLogout}
        setAuthMode={setAuthMode}
        setAuthError={setAuthError}
        setFeedbackMessage={setFeedbackMessage}
      />

      <main className="main">
        {isLogado ? (
          abaAtiva === "painel" && (
            <section className="card">
              <h2 className="card-title">Ola, {user?.nome || "Tutor"}!</h2>
              <p className="text">
                Você está logado como <strong>{user?.email}</strong>.
              </p>
              <p className="text">
                Aqui voce podera acompanhar a rotina do seu pet, verificar agendamentos e ver fotos das atividades diarias.
              </p>

              <div className="comment-box status-box">
                <p className="comment-title">Status de hoje:</p>
                <p className="comment-text">
                  O Thor esta brincando no patio principal com a turma dos grandalhoes!
                </p>
              </div>
            </section>
          )
        ) : (
          <>
            {abaAtiva === "home" && <Home />}

            {abaAtiva === "login" && (
              <Login
                authMode={authMode}
                setAuthMode={setAuthMode}
                authName={authName}
                setAuthName={setAuthName}
                authEmail={authEmail}
                setAuthEmail={setAuthEmail}
                authPassword={authPassword}
                setAuthPassword={setAuthPassword}
                authError={authError}
                feedbackMessage={feedbackMessage}
                authLoading={authLoading}
                handleAuthSubmit={handleAuthSubmit}
                setAuthError={setAuthError}
                setFeedbackMessage={setFeedbackMessage}
              />
            )}

            {abaAtiva === "depoimentos" && (
              <Depoimentos
                showForm={showForm}
                setShowForm={setShowForm}
                formError={formError}
                feedbackMessage={feedbackMessage}
                loadingDepoimentos={loadingDepoimentos}
                depoimentos={depoimentos}
                newDepoimento={newDepoimento}
                handleDepoimentoChange={handleDepoimentoChange}
                handleDepoimentoSubmit={handleDepoimentoSubmit}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;