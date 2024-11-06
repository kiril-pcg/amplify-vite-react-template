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

const formSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  accountId: z.string().min(1, "Account ID is required"),
  apiType: z.string().min(1, "API Type is required"),
});

export function APIConfig() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      accountId: "",
      apiType: "",
    },
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem("apiConfig");
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      form.reset(parsedConfig);
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    try {
      localStorage.setItem("apiConfig", JSON.stringify(values));
      toast({
        title: "API Configuration saved",
        description: "Your API configuration has been saved successfully.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error saving API configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save API configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
