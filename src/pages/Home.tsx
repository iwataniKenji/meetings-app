import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../App";

import "../styles/auth.scss";

export function Home() {
  const history = useNavigate();
  const { user, signInWithGoogle } = useContext(AuthContext);

  async function handleCreateRoom() {
    // se não estiver autenticado -> sign in
    if (!user) {
      await signInWithGoogle();
    }

    // se estiver autenticado -> redirecionar 
    history("/rooms/new");
  }

  return (
    <div id="auth-section">
      <button onClick={handleCreateRoom} className="auth-button">
        Crie sua assembleia com o Google
      </button>
      <div>ou entre em uma já existente</div>
      <form>
        <input type="text" placeholder="Digite o código" />
        <button type="submit">
          Entrar na assembleia
        </button>
      </form>
    </div>
  );
}
