import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { client } from "../../utils/utils";
import { Schema } from "../../../amplify/data/resource";

const formSchema = z.object({
  name: z.string().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  // bio: z.string().max(500, {
  //   message: "Bio must not be longer than 500 characters.",
  // }).optional(),
  industry: z.string().optional(),
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

interface ProfileFormProps {
  industries: Array<Schema["Industries"]["type"]>;
  onResponseAdded: () => void;
}

export function ProfileForm({ industries, onResponseAdded }: ProfileFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      jobTitle: "",
      companyName: "",
      // bio: "",
      prompt: "",
    },
  });

  const watchIndustry = form.watch("industry");

  useEffect(() => {
    const selectedIndustry = industries.find(
      (i) => i.industryName === watchIndustry
    );
    if (selectedIndustry) {
      form.setValue("prompt", selectedIndustry.prompt || "");
    }
  }, [watchIndustry, form, industries]);

  async function addResponse(response: string) {
    try {
      await client.models.Responses.create({
        response: response,
      })
      return true
    } catch (error) {
      console.error("Error adding response:", error)
      return false
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("data: ", data);
  
    try {
      const response = await client.queries.generateHaiku({ 
        name: data.name, 
        jobTitle: data.jobTitle, 
        companyName: data.companyName, 
        prompt: data.prompt 
    });
    
      if (response.errors && response.errors.length > 0) {
        console.error("GraphQL Error:", response.errors);
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Your response was not generated, there was an error in the lambda.",
        })
      } else if (response.data) {
        console.log(response.data);
        const success = await addResponse(response.data);
        if (success) {
          onResponseAdded();
          toast({
            variant: "success",
            title: "Success! Your response has been saved!",
            description: "Your message has been sent.",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error!",
            description: "Failed to save the response.",
          })
        }
      } else {
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Your job title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Your company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}