import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

const models = [
  // { id: "x-ai/grok-4-fast:free", name: "xAI: Grok 4 Fast (free)" },
  {
    id: "deepseek/deepseek-chat-v3.1:free",
    name: "DeepSeek: DeepSeek V3.1 (free)",
    provider: "openrouter",
  },
  // {
  //   id: "gemini-2.5-flash",
  //   name: "Gemini 2.5 Flash(Gemini CLI)",
  //   provider: "gemini-cli",
  // },
  // {
  //   id: "gemini-2.5-pro",
  //   name: "Gemini 2.5 Pro(Gemini CLI)",
  //   provider: "gemini-cli",
  // },
];

const ConversationDemo = () => {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [provider, setProvider] = useState<string>(models[0].provider);
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "http://localhost:5001/api/chat",
    }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          model: model,
          provider: provider,
        },
      }
    );
    setText("");
  };

  return (
    <div className="w-screen min-h-screen relative rounded-lg border flex flex-col items-center justify-center pt-6">
      <div className="h-[calc(100vh-100px)] max-w-7xl w-full bg-popover rounded-lg pb-22">
        <Conversation className="w-full h-full">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text": // we don't use any reasoning or tool calls in this example
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton className="cursor-pointer" />
        </Conversation>
      </div>

      {/* prompt input */}
      <PromptInput
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-7xl"
        globalDrop
        multiple
      >
        <PromptInputBody>
          {/* attachments */}
          {/* <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments> */}

          {/* textarea */}
          <PromptInputTextarea
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </PromptInputBody>

        {/* toolbar */}
        <PromptInputToolbar>
          <PromptInputTools>
            {/* add attachments button */}
            {/* <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu> */}

            {/* microphone button */}
            {/* <PromptInputButton
              onClick={() => setUseMicrophone(!useMicrophone)}
              variant={useMicrophone ? "default" : "ghost"}
            >
              <MicIcon size={16} />
              <span className="sr-only">Microphone</span>
            </PromptInputButton> */}

            {/* web search button */}
            {/* <PromptInputButton
              onClick={() => setUseWebSearch(!useWebSearch)}
              variant={useWebSearch ? "default" : "ghost"}
            >
              <GlobeIcon size={16} />
              <span>Search</span>
            </PromptInputButton> */}

            {/* model select */}
            <PromptInputModelSelect
              onValueChange={(value) => {
                setModel(value);
                setProvider(
                  models.find((model) => model.id === value)?.provider ||
                    "openrouter"
                );
              }}
              value={model}
            >
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map((model) => (
                  <PromptInputModelSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>

          {/* submit button */}
          <PromptInputSubmit
            disabled={!text && !status}
            status={status}
            className="cursor-pointer"
            onMouseDown={(e) => {
              if (status === "streaming") {
                e.preventDefault();
                stop();
                return;
              }
            }}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

export default ConversationDemo;
