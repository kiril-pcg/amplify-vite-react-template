import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MessageGridProps {
  messages: Array<{
    user: any;
    message: string;
  }>;
}

export function MessageGrid({ messages }: MessageGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {messages.map((item, index) => (
        <Card key={index} className="w-full">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={item.user.profile_picture_url} alt={`${item.user.first_name} ${item.user.last_name}`} />
              <AvatarFallback>{item.user.first_name[0]}{item.user.last_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{item.user.first_name} {item.user.last_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{item.user.headline}</p>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full">
              <p className="text-sm">{item.message}</p>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}