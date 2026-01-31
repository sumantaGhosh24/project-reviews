"use client";

import {useState} from "react";
import {BrainIcon, InfoIcon} from "lucide-react";
import {toast} from "sonner";

import {authClient} from "@/lib/auth/auth-client";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button, buttonVariants} from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

type Message = {
  role: "user" | "assistant" | string;
  content: string;
};

export default function ProjectChat({content}: {content: string}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const {data: session, isPending} = authClient.useSession();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, {role: "user", content: input}];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/project-chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          markdown: content,
          messages: updatedMessages,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      let assistantMessage = "";

      setMessages((prev) => [...prev, {role: "assistant", content: ""}]);

      while (reader) {
        const {value, done} = await reader.read();
        if (done) break;

        assistantMessage += decoder.decode(value);

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          };
          return copy;
        });
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  if (isPending) return <Skeleton className="w-full h-20" />;

  return (
    <Drawer>
      <DrawerTrigger className={buttonVariants()}>
        <BrainIcon className="h-4 w-4" /> Ask AI
      </DrawerTrigger>
      <DrawerContent className="container mx-auto p-5 h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Ask AI</DrawerTitle>
          <DrawerDescription>
            Ask AI anything about the project.
          </DrawerDescription>
        </DrawerHeader>
        <Alert className="mb-5" variant="destructive">
          <InfoIcon />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This chat not gonna save, whenever your reload all chat data lost.
          </AlertDescription>
        </Alert>
        <ScrollArea className="max-h-[40vh]">
          {messages.map((message, i) => (
            <Card
              className={`mb-3 py-2 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
              key={i}
            >
              <CardContent>
                <div
                  className={`flex items-center gap-2 mb-2 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "user" ? (
                    <Avatar>
                      <AvatarImage src={session?.user.image as string} />
                      <AvatarFallback>
                        {session?.user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarFallback>
                        <BrainIcon />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm">{message.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
        <DrawerFooter>
          <div className="flex gap-2">
            <Input
              className="flex-1 border p-2 rounded"
              value={input}
              placeholder="Ask something about the project..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={loading}>
              Send
            </Button>
          </div>
          <DrawerClose>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
