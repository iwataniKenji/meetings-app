import "../styles/meeting.scss";

export function Meeting() {
  return (
    <div id="meeting-room">
      <form className="meeting-room-container">
        <textarea placeholder="Digite sua pauta" />

        <div>
          <button>Enviar pauta</button>
        </div>
      </form>
    </div>
  );
}
