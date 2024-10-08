import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { client } from "../../utils/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect } from "react"
import { Industrie } from "./columns"
import { useToast } from "../../hooks/use-toast"

const formSchema = z.object({
  industry: z.string().min(2, {
    message: "Industry name must be at least 2 characters.",
  }),
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
})

interface IndustryFormProps {
  initialData?: Industrie | null
  mode?: "create" | "update"
  onSuccess?: () => void
}

export default function IndustryForm({ initialData, mode = "create", onSuccess }: IndustryFormProps) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: initialData?.industryName || "",
      prompt: initialData?.prompt || "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        industry: initialData.industryName || "",
        prompt: initialData.prompt || "",
      })
    }
  }, [initialData, form])

  async function addIndustry(industryName: string, prompt: string) {
    try {
      await client.models.Industries.create({
        prompt: prompt,
        industryName: industryName,
      })
      return true
    } catch (error) {
      console.error("Error adding industry:", error)
      return false
    }
  }

  async function updateIndustry(id: string, industryName: string, prompt: string) {
    try {
      await client.models.Industries.update({
        id: id, 
        prompt: prompt,
        industryName: industryName,
      })
      return true
    } catch (error) {
      console.error("Error updating industry:", error)
      return false
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let success
    if (mode === "create") {
      success = await addIndustry(values.industry, values.prompt)
    } else {
      success = await updateIndustry(initialData!.id, values.industry, values.prompt)
    }

    if (success) {
      toast({
        title: `Industry ${mode === "create" ? "added" : "updated"} successfully`,
        description: `The industry "${values.industry}" has been ${mode === "create" ? "added" : "updated"}.`,
        variant: "success",
      })
      if (mode === "create") {
        form.reset()
      }
      if (onSuccess) {
        onSuccess()
      }
    } else {
      toast({
        title: `Failed to ${mode === "create" ? "add" : "update"} industry`,
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the industry name" {...field} />
              </FormControl>
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
                  placeholder="Enter your prompt here"
                  className="min-h-[350px] max-h-[28vw]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {mode === "create" ? "Submit" : "Update"}
        </Button>
      </form>
    </Form>
  )
}