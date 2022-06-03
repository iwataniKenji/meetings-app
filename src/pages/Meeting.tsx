import { FormEvent, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../App";

import { database } from "../services/firebase";

import "../styles/meeting.scss";

type FirebaseTopics = Record<
  string,
  {
    name: string;
    votes: number;
  }
>;

type Topic = {
  id: string;
  name: string;
  votes: number;
};

type MeetingParams = {
  id: string;
};

export function Meeting() {
  const user = useContext(AuthContext);
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);

  // pega código da sala através dos parâmetros
  const params = useParams<MeetingParams>();
  const meetingId = params.id;

  useEffect(
    () => {
      // meetingRef -> pega referência da assembleia no firebase
      const meetingRef = database.ref(`meetings/${meetingId}`);

      // on -> ouvir toda vez que houver mudança na assembleia específica
      meetingRef.on("value", (meeting) => {
        const databaseMeeting = meeting.val();
        const firebaseTopics: FirebaseTopics = databaseMeeting.topics ?? {};

        // pautas formatadas em array
        const parsedTopics = Object.entries(firebaseTopics).map(
          ([key, value]) => {
            return {
              id: key,
              name: value.name,
              votes: value.votes,
            };
          }
        );

        setTopics(parsedTopics);
      });
    },
    // executa toda vez que URL mudar
    [meetingId]
  );

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
    setNewTopic("");
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
