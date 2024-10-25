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
import { Copy, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
  const [isSendingInMails, setIsSendingInMails] = useState(false);
  const { toast } = useToast();

  const handleCopy = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
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

  const handleSelectMessage = (index: number) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSendInMails = async () => {
    setIsSendingInMails(true);
    try {
      for (const index of selectedMessages) {
        const message = messages[index];
        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'X-API-KEY': 'tyg/PmZ4.xfMgHgrYx96iyQvwfqsSRRX0uvQQm9v4mf9P7cSzBHM='
          },
          body: JSON.stringify({
            account_id: 'FnqeOiPkSkmRKb3ZqmADow',
            text: editableMessages[index],
            attendees_ids: message.user.provider_id,
            linkedin: {
              api: 'sales_navigator',
              inmail: true
            }
          })
        };

        const response = await fetch('https://api2.unipile.com:13212/api/v1/chats', options);
        const data = await response.json();
        console.log(data);
      }
      toast({
        title: "InMails sent successfully",
        description: `Sent ${selectedMessages.size} InMails.`,
        variant: "success",
      });
      setSelectedMessages(new Set());
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error sending InMails",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSendingInMails(false);
    }
  };

  return (
    <>
      <Separator />
      <h2 id="generated-messages" className="text-2xl font-bold mb-4 mt-4">Generated Messages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
        {messages.map((item, index) => (
          <Card 
            key={index} 
            className={cn(
              "w-full flex flex-col cursor-pointer transition-all",
              selectedMessages.has(index) ? "border-blue-500 shadow-lg" : "hover:shadow-md"
            )}
            onClick={() => handleSelectMessage(index)}
          >
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
              <div className="flex-grow">
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
                  onClick={(e) => e.stopPropagation()}
                />
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => handleCopy(index, e)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button
        onClick={handleSendInMails}
        disabled={isSendingInMails || selectedMessages.size === 0}
        className="w-full mt-4"
      >
        {isSendingInMails ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending InMails...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send InMails ({selectedMessages.size})
          </>
        )}
      </Button>
    </>
  );
}