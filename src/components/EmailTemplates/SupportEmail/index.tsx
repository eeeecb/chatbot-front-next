import type { Message } from '@/utils/definitions';

function SupportEmail({
  id,
  collaboratorName,
  messages,
  name,
}: {
  id: string;
  collaboratorName: string;
  messages: Message[];
  name: string;
}) {
  const style = {
    hr: {
      backgroundColor: 'gray',
      border: 'none',
      marginTop: '40px',
      minHeight: '1px',
    },
    p: {
      whiteSpace: 'pre-line',
    },
  };

  return (
    <main>
      <h1>Olá, {name}! 👋</h1>
      {messages.map(({ content }, index) => (
        <p key={index} style={style.p}>
          {content}
        </p>
      ))}
      <p>{`Atenciosamente, ${collaboratorName}.`}</p>
      <hr style={style.hr} />
      <p>{`Esta resposta foi gerada a partir da conversa ID: ${id}`}</p>
      <p>Chatbot Inc.</p>
    </main>
  );
}

export default SupportEmail;
