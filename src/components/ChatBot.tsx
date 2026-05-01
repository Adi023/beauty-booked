import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const SUGGESTIONS = [
  "How do I book an appointment?",
  "What services do you offer?",
  "Where can I see before/after photos?",
  "How do I reschedule a booking?",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi! 👋 I'm the **MS Salon assistant**. Ask me anything about our services, bookings, or how to use the app.",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // Hide on admin routes (Header is hidden there too)
  const hidden = pathname.startsWith("/admin");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: Msg = { role: "user", content: trimmed };
      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setIsLoading(true);

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (resp.status === 429) {
          toast({ title: "Slow down", description: "Too many requests. Please wait a moment." });
          setIsLoading(false);
          return;
        }
        if (resp.status === 402) {
          toast({
            title: "AI credits exhausted",
            description: "Please add credits in workspace settings.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantText = "";
        let done = false;

        // Add empty assistant message we'll fill
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (!done) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;
          buffer += decoder.decode(value, { stream: true });

          let nl: number;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (delta) {
                assistantText += delta;
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantText } : m,
                  ),
                );
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
      } catch (err) {
        console.error("chat error", err);
        toast({
          title: "Something went wrong",
          description: "Couldn't reach the assistant. Please try again.",
          variant: "destructive",
        });
        setMessages((prev) => prev.filter((m) => m.content !== ""));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading],
  );

  if (hidden) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-primary text-primary-foreground",
          "flex items-center justify-center",
          "hover:scale-110 transition-transform",
        )}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-24 right-5 z-50",
              "w-[calc(100vw-2.5rem)] sm:w-96 h-[32rem] max-h-[calc(100vh-8rem)]",
              "bg-card border border-border rounded-2xl shadow-2xl",
              "flex flex-col overflow-hidden",
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-primary text-primary-foreground">
              <Sparkles className="w-4 h-4" />
              <div className="flex-1">
                <p className="font-serif font-semibold text-sm leading-tight">MS Salon Assistant</p>
                <p className="text-[11px] opacity-80">Ask anything about the app</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1">
              <div ref={scrollRef} className="p-4 space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm",
                      )}
                    >
                      {m.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1">
                          <ReactMarkdown
                            components={{
                              a: ({ href, children }) => {
                                const isInternal = href?.startsWith("/");
                                if (isInternal && href) {
                                  return (
                                    <Link
                                      to={href}
                                      onClick={() => setOpen(false)}
                                      className="text-primary underline underline-offset-2 font-medium"
                                    >
                                      {children}
                                    </Link>
                                  );
                                }
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline underline-offset-2"
                                  >
                                    {children}
                                  </a>
                                );
                              },
                            }}
                          >
                            {m.content || "…"}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-3.5 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}

                {messages.length === 1 && (
                  <div className="pt-2 space-y-1.5">
                    <p className="text-[11px] text-muted-foreground px-1">Try asking:</p>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-border p-3 flex gap-2 bg-background"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                disabled={isLoading}
                className="flex-1 h-10 text-sm"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}