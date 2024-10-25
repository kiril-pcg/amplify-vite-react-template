import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface MessageGridProps {
  messages: Array<{
    user: any;
    message: string;
  }>;
}

export function MessageGrid({ messages }: MessageGridProps) {
  const [editableMessages, setEditableMessages] = useState(
    messages.map((item) => item.message)
  );
  const { toast } = useToast();

  const handleCopy = (index: number) => {
    navigator.clipboard.writeText(editableMessages[index]).then(
      () => {
        toast({
          description: "Message copied to clipboard",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          variant: "destructive",
          description: "Failed to copy message",
        });
      }
    );
  };

  const handleMessageChange = (index: number, newValue: string) => {
    const newMessages = [...editableMessages];
    newMessages[index] = newValue;
    setEditableMessages(newMessages);
  };

  return (
    <>
      <Separator />
      <h2 id="generated-messages" className="text-2xl font-bold mb-4 mt-4">Generated Messages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
        {messages.map((item, index) => (
          <Card key={index} className="w-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={item.user.profile_picture_url}
                  alt={`${item.user.first_name} ${item.user.last_name}`}
                />
                <AvatarFallback>
                  {item.user.first_name[0]}
                  {item.user.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>
                  {item.user.first_name} {item.user.last_name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {item.user.headline}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ScrollArea className="h-[400px] w-full">
                <Textarea
                  value={editableMessages[index]}
                  onChange={(e) => handleMessageChange(index, e.target.value)}
                  className="min-h-[380px] resize-none"
                />
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleCopy(index)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
