import { useState, useEffect } from 'react'
import { UserCard } from './userCard'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { client } from "../../utils/utils"
import { Loader2, Check, ChevronsUpDown } from "lucide-react"
import { MessageGrid } from './messageGrid'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea"
import { Schema } from "../../../amplify/data/resource"

const formSchema = z.object({
  industry: z.string().min(1, "Industry is required"),
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
})

interface UserCardListProps {
  users: any[];
}

export function UserCardList({ users }: UserCardListProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessages, setGeneratedMessages] = useState<any[]>([]);
  const [industries, setIndustries] = useState<Array<Schema["Industries"]["type"]>>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      prompt: "",
    },
  });

  useEffect(() => {
    client.models.Industries.observeQuery().subscribe({
      next: (data) => setIndustries([...data.items]),
    });
  }, []);

  const watchIndustry = form.watch("industry");
  const watchPrompt = form.watch("prompt");

  useEffect(() => {
    const selectedIndustry = industries.find(
      (i) => i.industryName === watchIndustry
    );
    if (selectedIndustry) {
      form.setValue("prompt", selectedIndustry.prompt || "");
    }
  }, [watchIndustry, form, industries]);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleGenerateMessage = async () => {
    const data = form.getValues(); 
    if (selectedUsers.size === 0 || watchPrompt.length < 20) return; 

    setIsGenerating(true);
    setGeneratedMessages([]);
    const selectedUsersList = Array.from(selectedUsers).map(id => users.find(user => user.public_identifier === id));
    console.log(selectedUsersList)
    
    try {
      const messages = await Promise.all(selectedUsersList.map(async (user) => {
        const response = await client.queries.generateHaiku({ 
          prompt: data.prompt,
          first_name: user.first_name,
          last_name: user.last_name,
          headline: user.headline,
          location: user.location,
          summary: user.summary,
          test: "test",
        });
      
        if (response.errors && response.errors.length > 0) {
          throw new Error(response.errors[0].message);
        }
      
        return { user, message: response.data };
      }));

      setGeneratedMessages(messages);
      toast({
        title: "Messages generated successfully",
        description: `Generated ${messages.length} messages.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error generating messages:", error);
      toast({
        title: "Error generating messages",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  

  return (
    <div className="space-y-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {users.map((user) => (
          <div key={user.public_identifier} className="w-full">
            <UserCard
              user={user}
              isSelected={selectedUsers.has(user.public_identifier)}
              onSelect={() => handleSelectUser(user.public_identifier)}
            />
          </div>
        ))}
      </div>
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Industry</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? industries.find(
                              (industry) => industry.industryName === field.value
                            )?.industryName
                          : "Select industry"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search industry..." />
                      <CommandList>
                        <CommandEmpty>No industry found.</CommandEmpty>
                        <CommandGroup>
                          {industries.map((industry) => (
                            <CommandItem
                              value={industry.industryName || ""}
                              key={industry.id}
                              onSelect={() => {
                                form.setValue("industry", industry.industryName || "");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  industry.industryName === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {industry.industryName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Industry-specific prompt"
                    className="min-h-[250px] max-h-[30w]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="button"
            onClick={handleGenerateMessage} 
            disabled={selectedUsers.size === 0 || isGenerating || watchPrompt.length < 20}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Messages...
              </>
            ) : (
              "Generate Messages"
            )}
          </Button>
        </form>
      </Form>
      {generatedMessages.length > 0 && (
        <MessageGrid messages={generatedMessages} />
      )}
    </div>
  );
}