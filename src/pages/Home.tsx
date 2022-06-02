import { useNavigate } from "react-router-dom";

import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../App";

import "../styles/auth.scss";
import { database } from "../services/firebase";

export function Home() {
  const history = useNavigate();
  const { user, signInWithGoogle } = useContext(AuthContext);
  const [meetingCode, setMeetingCode] = useState("");

  async function handleCreateMeeting() {
    // se não estiver autenticado -> sign in
    if (!user) {
      await signInWithGoogle();
    }

    // se estiver autenticado -> redirecionar
    history("/meetings/new");
  }

  async function handleJoinMeeting(event: FormEvent) {
    event.preventDefault();

    if (meetingCode.trim() === "") {
      return;
    }

    // get -> busca todos os registros da assembleia
    const meetingRef = await database.ref(`meetings/${meetingCode}`).get();

    // se não existe -> retorne
    if (!meetingRef.exists()) {
      alert("Assembleia não existente");
      return;
    }

    // se existe -> redirecione
    history(`meetings/${meetingCode}`);
  }

  return (
    <div id="auth-section">
      <button onClick={handleCreateMeeting} className="auth-button">
        Crie sua assembleia com o Google
      </button>
      <div>ou entre em uma já existente</div>
      <form onSubmit={handleJoinMeeting}>
        <input
          type="text"
          placeholder="Digite o código"
          onChange={(event) => setMeetingCode(event.target.value)}
          value={meetingCode}
        />
        <button type="submit">Entrar na assembleia</button>
      </form>
    </div>
  );
}
