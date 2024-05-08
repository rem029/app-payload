import { Thread } from "openai/resources/beta/threads/threads";
import OpenAI, { ClientOptions } from "openai";
import { Payload } from "payload";
import { MessagesPage } from "openai/resources/beta/threads/messages";

export const createAndFetchMessage = async (
  content: string,
  args: {
    threadId?: string;
    apiKey: string;
    apiAssistantKey: string;
    instruction: string;
    additional_instruction?: string;
    payload?: Payload;
  },
) => {
  let thread: Thread;
  let messages: MessagesPage;
  const {
    threadId,
    apiKey,
    apiAssistantKey,
    instruction,
    additional_instruction,
    payload,
  } = args;

  const options: ClientOptions = { apiKey: apiKey };
  const openai = new OpenAI(options);

  if (threadId) {
    thread = await openai.beta.threads.retrieve(threadId);
    payload.logger.info(`Thread retrieve: ${thread.id}`);
  } else {
    thread = await openai.beta.threads.create();

    if (payload) {
      payload.create({
        collection: "chat-history",
        data: {
          id: thread.id,
        },
      });
    }

    payload.logger.info(`Thread created: ${thread.id}`);
  }

  if (content) {
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content,
    });

    payload.logger.info(`Messaged added to thread id: ${thread.id}`);
    const assistant = await openai.beta.assistants.retrieve(apiAssistantKey);
    payload.logger.info(`Retrieved existing assistant id: ${thread.id}`);
    await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
      instructions: instruction,
      additional_instructions: additional_instruction,
      model: "gpt-3.5-turbo",
      tools: [{ type: "file_search" }],
    });

    payload.logger.info(
      `Sending message to assistant and creating poll: ${thread.id}`,
    );
  }

  messages = await openai.beta.threads.messages.list(thread.id);

  if (payload) {
    const _messages = messages;
    _messages.data.reverse();

    let _arr_messages: string[] = [];

    for (let _msgIndex = 0; _msgIndex < _messages.data.length; _msgIndex++) {
      const message = messages.data[_msgIndex].content[0]["text"]?.value || "";
      const role = messages.data[_msgIndex].role;

      _arr_messages = [..._arr_messages, `${role.toUpperCase()}\n${message}`];
    }

    payload.update({
      collection: "chat-history",
      data: {
        description: _arr_messages.join("\n\n\n"),
      },
      where: {
        id: {
          equals: thread.id,
        },
      },
    });
  }

  return messages;
};
