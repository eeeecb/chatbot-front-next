import type {
  APIResult,
  Conversation,
  CreateConversationPayload,
  CreateUserPayload,
  FetchAnswerPayload,
  LoginPayload,
  SendEmailPayload,
  SendEmailResponse,
  Session,
  UpdateConversationPayload,
  User,
} from './definitions';

const apiUrl = 'http://localhost:3100';
const localUrl = 'http://localhost:3000';

const api = {
  async fetchConversation({ id }: { id: string }): Promise<APIResult<Conversation>> {
    const response = await fetch(`${apiUrl}/conversations/${id}?_expand=user`, {
      next: { revalidate: 10, tags: ['support'] },
    });

    const data = await response.json();

    return { status: response.status, data };
  },

  async fetchSupportConversations({
    collaboratorId,
  }: {
    collaboratorId: string;
  }): Promise<APIResult<Conversation[]>> {
    const response = await fetch(
      `${apiUrl}/conversations/support?collaboratorId=${collaboratorId}&_expand=user`,
      { next: { revalidate: 10, tags: ['support'] } }
    );

    const data = await response.json();

    return { status: response.status, data };
  },

  async updateConversation({
    body,
    id,
  }: UpdateConversationPayload): Promise<APIResult<Conversation>> {
    const response = await fetch(`${apiUrl}/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return { status: response.status, data };
  },

  async fetchAnswer({ body }: FetchAnswerPayload) {
    const response = await fetch(`${localUrl}/api/ai/retrieval`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: body.messages }),
    });

    const stream = response.body as ReadableStream<Uint8Array>;
    const reader = stream.getReader();

    return { status: response.status, data: reader };
  },

  async sendEmail({ body }: SendEmailPayload): Promise<APIResult<SendEmailResponse>> {
    const response = await fetch(`${localUrl}/api/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return { status: response.status, data };
  },
};

export default api;
