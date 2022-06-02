import { useContext } from "react";
import { AuthContext } from "../App";

import "../styles/auth.scss";

export function NewRoom() { 
  const { user, signInWithGoogle } = useContext(AuthContext);

  return (
    <div id="auth-section">
      <h2>Criar nova assembleia</h2>
      <form>
        <input type="text" placeholder="Nome da assembleia" />
        <button type="submit">
          Criar sala
        </button>
      </form>
      <p>
        Gostaria de entrar em uma assembleia existente?&nbsp;
        <a href="/">clique aqui</a>
      </p>
    </div>
  );
}
