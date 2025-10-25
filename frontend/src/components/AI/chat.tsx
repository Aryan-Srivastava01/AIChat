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
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { CheckIcon, CopyIcon, MessageSquare } from "lucide-react";
import { Fragment, useState } from "react";
import { Action, Actions } from "../ai-elements/actions";

const models = [
  {
    name: "Z.AI: GLM 4.5 Air (free)",
    id: "z-ai/glm-4.5-air:free",
    provider: "openrouter",
  },
  {
    name: "DeepSeek: DeepSeek V3.1 (free)",
    id: "deepseek/deepseek-chat-v3.1:free",
    provider: "openrouter",
  },
  {
    name: "Tongyi DeepResearch 30B A3B (free)",
    id: "alibaba/tongyi-deepresearch-30b-a3b:free",
    provider: "openrouter",
  },
  {
    name: "Meituan: LongCat Flash Chat (free)",
    id: "meituan/longcat-flash-chat:free",
    provider: "openrouter",
  },
  {
    name: "NVIDIA: Nemotron Nano 9B V2 (free)",
    id: "nvidia/nemotron-nano-9b-v2:free",
    provider: "openrouter",
  },
  {
    name: "OpenAI: gpt-oss-20b (free)",
    id: "openai/gpt-oss-20b:free",
    provider: "openrouter",
  },
  {
    name: "Qwen: Qwen3 Coder 480B A35B (free)",
    id: "qwen/qwen3-coder:free",
    provider: "openrouter",
  },
  {
    name: "MoonshotAI: Kimi K2 0711 (free)",
    id: "moonshotai/kimi-k2:free",
    provider: "openrouter",
  },
  {
    name: "Venice: Uncensored (free)",
    id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
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
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api/chat";

const ConversationDemo = () => {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [provider, setProvider] = useState<string>(models[0].provider);
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: API_BASE_URL,
    }),
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);

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

  const handleCopyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="w-screen min-h-screen relative rounded-lg flex flex-col items-center justify-start px-2 sm:px-0">
      <div className="h-[calc(100vh-100px)] max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl w-full bg-popover rounded-lg pb-22">
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
                            <Fragment key={`${message.id}-${i}`}>
                              <Response>{part.text}</Response>
                              {/* Actions like retry and copy */}
                              {message.role === "assistant" && (
                                <Actions>
                                  {/* <Action onClick={() => stop()} label="Retry">
                                    <RefreshCcwIcon className="size-3" />
                                  </Action> */}
                                  <Action
                                    onClick={() => handleCopyText(part.text)}
                                    label="Copy"
                                    className={cn(
                                      "cursor-pointer rounded-full w-[10%] px-2 py-1 hover:scale-105 transition-all duration-300 ease-in-out font-bold",
                                      isCopied
                                        ? "bg-chart-7 text-chart-6 rounded-full border border-chart-6 hover:bg-chart-7 hover:text-chart-6"
                                        : "hover:bg-card"
                                    )}
                                  >
                                    {isCopied ? (
                                      <span className="text-xs flex gap-1 items-center justify-center">
                                        <CheckIcon className="size-3" />
                                        Copied
                                      </span>
                                    ) : (
                                      <span className="w-full text-xs flex gap-1 items-center justify-center">
                                        <CopyIcon className="size-3" />
                                        Copy
                                      </span>
                                    )}
                                  </Action>
                                </Actions>
                              )}
                            </Fragment>
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
      <div className="fixed bottom-0 w-full max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl px-2 sm:px-0">
        <PromptInput
          onSubmit={handleSubmit}
          className="bg-sidebar rounded-lg"
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
              className="placeholder:text-muted-foreground/30!"
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
    </div>
  );
};

export default ConversationDemo;
