import { FormEvent, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../App";
import { Topic } from "./Topic";

import { database } from "../services/firebase";

import "../styles/meeting.scss";

type FirebaseTopics = Record<
  string,
  {
    name: string;
    votes: number;
    votesCount: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type TopicType = {
  id: string;
  name: string;
  votes: number;
  votesCount: number;
  voteId: string | undefined;
};

type MeetingParams = {
  id: string;
};

export function Meeting() {
  const { user } = useContext(AuthContext);
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState<TopicType[]>([]);

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
              votesCount: Object.values(value.votes ?? {}).length,

              // chave e valor do voto caso encontrado
              voteId: Object.entries(value.votes ?? {}).find(
                ([key, vote]) => vote.authorId === user?.id
              )?.[0],
            };
          }
        );

        setTopics(parsedTopics);
      });

      // remove todos os event listeners para a determinada assembleia referenciada
      return () => {
        meetingRef.off("value");
      };
    },
    // executa toda vez que URL mudar
    [meetingId, user?.id]
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

  async function handleVoteTopic(topicId: string, voteId: string | undefined) {
    // se houver voto -> remover
    if (voteId) {
      await database
        .ref(`meetings/${meetingId}/topics/${topicId}/votes/${voteId}`)
        .remove();
    }
    // se não houver voto -> adicionar
    else {
      await database.ref(`meetings/${meetingId}/topics/${topicId}/votes`).push({
        authorId: user?.id,
      });
    }
  }

  return (
    <>
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
      {topics.map((topic) => {
        return (
          <Topic
            key={topic.id}
            content={topic.name}
            topicId={topic.id}
            votesCount={topic.votesCount}
            voteId={topic.voteId}
            computeVotes={handleVoteTopic}
          />
        );
      })}
    </>
  );
}
