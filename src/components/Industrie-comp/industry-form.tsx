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
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"
import { Industrie } from "./columns"

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
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState<"success" | "error">("success") 

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
      setAlertType("success")
      setShowAlert(true)
      if (mode === "create") {
        form.reset()
      }
      if (onSuccess) {
        onSuccess()
      }
      setTimeout(() => setShowAlert(false), 5000) 
    } else {
      setAlertType("error")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
    }
  }

  return (
    <div>
      {showAlert && (
        <Alert className={alertType === "success" ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"}>
          {alertType === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={alertType === "success" ? "text-green-700" : "text-red-700"}>
            {alertType === "success"
              ? `Industry successfully ${mode === "create" ? "added" : "updated"}!`
              : `Error: Failed to ${mode === "create" ? "add" : "update"} industry.`}
          </AlertDescription>
        </Alert>
      )}
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
    </div>
  )
}