import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Check, ChevronsUpDown, X } from "lucide-react";
import { UserCardList } from "../Home-comp/userCardList";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

const locationOptions = [
  { label: "United States", value: "103644278" },
  { label: "California, United States", value: "102095887" },
  { label: "Texas, United States", value: "102748797" },
  { label: "New York, United States", value: "105080838" },
  { label: "Florida, United States", value: "101318387" },
  { label: "Los Angeles County, California, United States", value: "103104382" },
  { label: "New York, New York, United States", value: "102571732" },
  { label: "Illinois, United States", value: "101949407" },
  { label: "Pennsylvania, United States", value: "102986501" },
  { label: "Georgia, United States", value: "103950076" },
  { label: "Ohio, United States", value: "106981407" },
  { label: "Bulgaria", value: "105333783" },
  { label: "Sofia City, Bulgaria", value: "102908739" },
  { label: "Macedonia", value: "103420483" },
];

const formSchema = z.object({
  limit: z.number().min(1, "Limit must be at least 1"),
  locations: z.array(z.string()).min(1, "Add at least one location!"),
  keywords: z.string().optional(),
});

export function SearchForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const { toast } = useToast();
  const [apiConfig, setApiConfig] = useState<{apiKey: string, accountId: string, apiType: string} | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('apiConfig');
    if (savedConfig) {
      setApiConfig(JSON.parse(savedConfig));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      limit: 5,
      locations: [],
      keywords: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!apiConfig) {
      toast({
        title: "API Configuration Missing",
        description: "Please set up your API configuration first.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setUserProfiles([]);

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "X-API-KEY": apiConfig.apiKey,
      },
      body: JSON.stringify({
        api: "classic",
        category: "people",
        advanced_keywords: {},
        keywords: values.keywords,
        location: values.locations 
      }),
    };

    try {
      const response = await fetch(
        `https://${apiConfig.apiType}/api/v1/linkedin/search?limit=${values.limit}&account_id=${apiConfig.accountId}`,
        options
      );
      const data = await response.json();

      if (!response.ok) { 
        console.error("API Error:", response);
    
        toast({
          title: `Error ${response.status}`,
          description: response.statusText,
          variant: "destructive",
        });
        return;
      }

      if (!data.items || data.items.length === 0) {
        console.warn("No items found in the search response.");
        toast({
          title: "No users found",
        });
        setUserProfiles([]);
        return;
      }

      // Fetch user profiles for each search result
      const profiles = await Promise.all(
        data.items.map(async (item: any) => {
          try {
            const userResponse = await fetch(
              `https://${apiConfig.apiType}/api/v1/users/${item.public_identifier}?linkedin_sections=%2A&account_id=${apiConfig.accountId}`,
              {
                method: "GET",
                headers: {
                  "X-API-KEY": apiConfig.apiKey,
                  Accept: "application/json",
                },
              }
            );

            if (!userResponse.ok) {
              console.warn(
                `Failed to fetch profile for ${item.public_identifier}`
              );
              return null;
            }

            return userResponse.json();
          } catch (error) {
            console.error(
              `Error fetching profile for ${item.public_identifier}`,
              error
            );
            return null;
          }
        })
      );

      setUserProfiles(profiles.filter((profile) => profile !== null));
    } catch (error) {
      console.error("Error during search or profile fetching", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching user profiles.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter limit"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="locations"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Locations</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.value.length > 0
                        ? `${field.value.length} location${
                            field.value.length > 1 ? "s" : ""
                          } selected`
                        : "Select locations"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search locations..." />
                    <CommandList>
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup>
                        {locationOptions.map((location) => (
                          <CommandItem
                            value={location.label}
                            key={location.value}
                            onSelect={() => {
                              const updatedLocations = field.value.includes(location.value)
                                ? field.value.filter((l) => l !== location.value)
                                : [...field.value, location.value];
                              form.setValue("locations", updatedLocations);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value.includes(location.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {location.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((locationValue) => {
                  const location = locationOptions.find((l) => l.value === locationValue);
                  return (
                    <Badge key={locationValue} variant="secondary">
                      {location?.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => {
                          const updatedLocations = field.value.filter((l) => l !== locationValue);
                          form.setValue("locations", updatedLocations);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input placeholder="Enter keywords" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting || !apiConfig}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
        <div className="mt-12">
          {userProfiles.length > 0 && (
            <div className="mt-8">
              <UserCardList
                users={userProfiles}
                apiType={apiConfig?.apiType || ""}
                apiKey={apiConfig?.apiKey || ""}
                accountId={apiConfig?.accountId || ""}
              />
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}