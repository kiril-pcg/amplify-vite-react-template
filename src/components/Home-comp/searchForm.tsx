import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  { label: "Ohio, United States", value: "106981407" }
];

const formSchema = z.object({
  api: z.enum(["classic", "sales_navigator"]),
  apiKey: z.string().min(1, "API Key is required"),
  accountId: z.string().min(1, "Account ID is required"),
  apiType: z.string().min(1, "API Type is required"),
  limit: z.number().min(1, "Limit must be at least 1"),
  locations: z.array(z.string()),
  keywords: z.string().optional(),
});

export default function SearchForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      api: "classic",
      apiKey: "D0fx6LYK.2lZOkSSBR8tSIhq7DE+Yvn2X5JlPRLRVf5DSC81ufog=",
      accountId: "fSK7SIWrQU6RFktox0vV6A",
      apiType: "api9.unipile.com:13911",
      limit: 5,
      locations: [],
      keywords: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setUserProfiles([]);

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "X-API-KEY": values.apiKey,
      },
      body: JSON.stringify({
        api: values.api,
        category: "people",
        advanced_keywords: {},
        keywords: values.keywords,
        location: values.locations 
      }),
    };

    try {
      const response = await fetch(
        `https://${values.apiType}/api/v1/linkedin/search?limit=${values.limit}&account_id=${values.accountId}`,
        options
      );
      const data = await response.json();

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
              `https://${values.apiType}/api/v1/users/${item.public_identifier}?linkedin_sections=%2A&account_id=${values.accountId}`,
              {
                method: "GET",
                headers: {
                  "X-API-KEY": values.apiKey,
                  Accept: "application/json",
                },
              }
            );

            if (!userResponse.ok) {
              console.warn(
                `Failed to fetch profile for ${item.public_identifier}`
              );
              return null; // Handle as you prefer
            }

            return userResponse.json();
          } catch (error) {
            console.error(
              `Error fetching profile for ${item.public_identifier}`,
              error
            );
            return null; // Return a placeholder or null
          }
        })
      );

      // Filter out null profiles to avoid undefined items
      setUserProfiles(profiles.filter((profile) => profile !== null));
    } catch (error) {
      console.error("Error during search or profile fetching", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="api"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select API" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="sales_navigator">
                    Sales Navigator
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter API Key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter Account ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter API Type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                              const updatedLocations = field.value.includes(
                                location.value
                              )
                                ? field.value.filter(
                                    (l) => l !== location.value
                                  )
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
                  const location = locationOptions.find(
                    (l) => l.value === locationValue
                  );
                  return (
                    <Badge key={locationValue} variant="secondary">
                      {location?.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => {
                          const updatedLocations = field.value.filter(
                            (l) => l !== locationValue
                          );
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
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
                apiType={form.getValues().apiType}
                apiKey={form.getValues().apiKey}
                accountId={form.getValues().accountId}
              />
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
