import "../styles/Agendamentos.css";

function Agendamentos({
  isLogado,
  user,
  setAbaAtiva,
  setAuthMode,
  agendamentos,
  novoAgendamento,
  handleAgendamentoChange,
  handleAgendamentoSubmit,
  agendamentoError,
  agendamentoFeedback,
  loadingAgendamentos,
}) {
  if (!isLogado) {
    return (
      <section className="card">
        <h2 className="card-title">Acesso restrito</h2>
        <p className="text">
          Para visualizar e criar agendamentos, você precisa fazer login.
        </p>

        <button
          className="add-button"
          onClick={() => {
            setAuthMode("login");
            setAbaAtiva("login");
          }}
        >
          Fazer login
        </button>
      </section>
    );
  }

  return (
    <section>
      <h2 className="title">Agendamentos</h2>

      <section className="card depoimento-form">
        <h3 className="card-title">Novo agendamento</h3>

        <p className="text">
          Tutor logado: <strong>{user?.nome}</strong>
        </p>

        {agendamentoError && <p className="text auth-error">{agendamentoError}</p>}
        {agendamentoFeedback && <p className="text auth-success">{agendamentoFeedback}</p>}

        <form onSubmit={handleAgendamentoSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Nome do cachorro:</label>
            <input
              name="nomeCachorro"
              className="form-input"
              value={novoAgendamento.nomeCachorro}
              onChange={handleAgendamentoChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Serviço:</label>
            <select
              name="servico"
              className="form-input"
              value={novoAgendamento.servico}
              onChange={handleAgendamentoChange}
              required
            >
              <option value="">Selecione</option>
              <option value="Banho">Banho</option>
              <option value="Tosa">Tosa</option>
              <option value="Banho e Tosa">Banho e Tosa</option>
              <option value="Creche">Creche</option>
              <option value="Veterinário">Veterinário</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Data:</label>
            <input
              type="date"
              name="data"
              className="form-input"
              value={novoAgendamento.data}
              onChange={handleAgendamentoChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Horário:</label>
            <input
              type="time"
              name="horario"
              className="form-input"
              value={novoAgendamento.horario}
              onChange={handleAgendamentoChange}
              required
            />
          </div>

          <div className="form-group textarea-group">
            <label className="form-label">Observações:</label>
            <textarea
              name="observacoes"
              className="form-input form-textarea"
              rows={3}
              value={novoAgendamento.observacoes}
              onChange={handleAgendamentoChange}
            />
          </div>

          <button type="submit" className="add-button full-width-button">
            Agendar
          </button>
        </form>
      </section>

      <section className="depoimentos-list">
        <h3 className="card-title">Meus agendamentos</h3>

        {loadingAgendamentos && <p className="text">Carregando agendamentos...</p>}

        {!loadingAgendamentos && agendamentos.length === 0 && (
          <p className="text">Você ainda não possui agendamentos.</p>
        )}

        {agendamentos.map((agendamento) => (
          <div key={agendamento.id} className="card depoimento-card">
            <h3 className="card-title">{agendamento.nomeCachorro}</h3>
            <p className="text"><strong>Serviço:</strong> {agendamento.servico}</p>
            <p className="text"><strong>Data:</strong> {agendamento.data}</p>
            <p className="text"><strong>Horário:</strong> {agendamento.horario}</p>

            {agendamento.observacoes && (
              <div className="comment-box">
                <p className="comment-title">Observações:</p>
                <p className="comment-text">{agendamento.observacoes}</p>
              </div>
            )}
          </div>
        ))}
      </section>
    </section>
  );
}

export default Agendamentos;