import { useContext } from "react";
import { AuthContext } from "../App";

import { FormEvent, useState } from "react";
import { database } from "../services/firebase";

import "../styles/auth.scss";
import { useNavigate } from "react-router-dom";

export function NewMeeting() {
  const { user } = useContext(AuthContext);
  const history = useNavigate();
  const [newMeeting, setNewMeeting] = useState("");

  async function handleCreateMeeting(event: FormEvent) {
    event.preventDefault();

    // retorna caso input esteja vazio
    if (newMeeting.trim() === "") {
      return;
    }

    // pega a referência "meetings" do firebase
    const meetingRef = database.ref("meetings");

    // cria assembleia
    const firebaseMeeting = await meetingRef.push({
      title: newMeeting,
      authorId: user?.id,
      statusActive: true,
    });

    // redireciona para a assembleia
    history(`/meetings/${firebaseMeeting.key}`);
  }

  return (
    <div id="auth-section">
      <h2>Criar nova assembleia</h2>
      <form onSubmit={handleCreateMeeting}>
        <input
          type="text"
          placeholder="Nome da assembleia"
          onChange={(event) => setNewMeeting(event.target.value)}
          value={newMeeting}
        />
        <button type="submit">Criar assembleia</button>
      </form>
      <p>
        Gostaria de entrar em uma assembleia existente?&nbsp;
        <a href="/">clique aqui</a>
      </p>
    </div>
  );
}
