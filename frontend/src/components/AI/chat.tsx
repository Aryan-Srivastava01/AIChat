import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
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
import { MessageSquare, MicIcon } from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { DefaultChatTransport } from "ai";

const models = [
  // { id: "x-ai/grok-4-fast:free", name: "xAI: Grok 4 Fast (free)" },
  {
    id: "deepseek/deepseek-chat-v3.1:free",
    name: "DeepSeek: DeepSeek V3.1 (free)",
  },
];

const ConversationDemo = () => {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const { messages, sendMessage, status } = useChat({
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
        },
      }
    );
    setText("");
  };

  return (
    <div className="max-w-7xl bg-popover w-screen min-h-screen p-6 relative rounded-lg border flex flex-col items-center justify-center">
      {/* Loader */}
      {}
      <Conversation>
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
        <ConversationScrollButton />
      </Conversation>

      {/* <form onSubmit={handleSubmit}>
        <Input
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.currentTarget.value)}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        ></Input>
        <Button variant={"outline"} type="submit">
          Send
        </Button>
      </form> */}

      <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
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
          <PromptInputSubmit disabled={!text && !status} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

export default ConversationDemo;
