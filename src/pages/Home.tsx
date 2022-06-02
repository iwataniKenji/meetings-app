import "../styles/auth.scss";

export function Home() {
  return (
    <div id="auth-section">
      <button className="create-room-btn">Crie sua assembleia com o Google</button>
      <div>ou entre em uma já existente</div>
      <form>
        <input type="text" placeholder="Digite o código" />
        <button className="join-room-btn" type="submit">
          Entrar na assembleia
        </button>
      </form>
    </div>
  );
}
