import "../styles/Depoimentos.css";

function Depoimentos({
  showForm,
  setShowForm,
  formError,
  feedbackMessage,
  loadingDepoimentos,
  depoimentos,
  newDepoimento,
  handleDepoimentoChange,
  handleDepoimentoSubmit,
}) {
  return (
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

          {formError && <p className="text auth-error">{formError}</p>}
          {feedbackMessage && <p className="text auth-success">{feedbackMessage}</p>}

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

            <div className="form-group textarea-group">
              <label htmlFor="comentario" className="form-label">Comentario:</label>
              <textarea
                id="comentario"
                name="comentario"
                className="form-input form-textarea"
                value={newDepoimento.comentario}
                onChange={handleDepoimentoChange}
                rows={4}
                required
              />
            </div>

            <button type="submit" className="add-button full-width-button">
              Enviar depoimento
            </button>
          </form>
        </section>
      )}

      <section className="depoimentos-list">
        {loadingDepoimentos && <p className="text">Carregando depoimentos...</p>}

        {formError && !showForm && <p className="text auth-error">{formError}</p>}

        {!loadingDepoimentos && depoimentos.length === 0 && (
          <p className="text">
            Ainda nao ha depoimentos cadastrados. Seja o primeiro a contribuir!
          </p>
        )}

        {depoimentos.map((depoimento) => (
          <div key={depoimento.id} className="card depoimento-card">
            <h3 className="card-title">{depoimento.nomeCachorro}</h3>

            <div className="info-group">
              <p className="text"><strong>Tutor:</strong> {depoimento.nomeTutor}</p>
              <p className="text"><strong>Raca:</strong> {depoimento.raca}</p>
              <p className="text">
                <strong>Enviado em:</strong>{" "}
                {new Date(depoimento.criado_em).toLocaleDateString()}
              </p>
            </div>

            <div className="comment-box">
              <p className="comment-title">Comentario:</p>
              <p className="comment-text">{depoimento.comentario}</p>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}

export default Depoimentos;