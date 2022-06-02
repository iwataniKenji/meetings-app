import { FormEvent, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../App";
import { database } from "../services/firebase";

import "../styles/meeting.scss";

type MeetingParams = {
  id: string;
};

export function Meeting() {
  const user = useContext(AuthContext);
  const [newTopic, setNewTopic] = useState("");

  // pega código da sala através dos parâmetros
  const params = useParams<MeetingParams>();
  const meetingId = params.id;

  async function handleSendTopic(event: FormEvent) {
    event.preventDefault();

    if (newTopic.trim() === "") {
      return;
    }

    // se não houver usuário
    if (!user) {
      throw new Error("Você deve estar logado");
    }

    // criando objeto
    const topic = {
      name: newTopic,
      votes: 0,
    };

    // inserindo a pauta no assembleia específica
    await database.ref(`meetings/${meetingId}/topics`).push(topic);

    // esvazia conteúdo do state
    setNewTopic('');
  }

  return (
    <div id="meeting-room">
      <form onSubmit={handleSendTopic} className="meeting-room-container">
        <textarea
          placeholder="Digite sua pauta"
          onChange={(event) => setNewTopic(event.target.value)}
          value={newTopic}
        />

        <div>
          <button type="submit">Enviar pauta</button>
        </div>
      </form>
    </div>
  );
}
