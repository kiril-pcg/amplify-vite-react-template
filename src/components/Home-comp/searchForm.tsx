import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { UserCardList } from "../Home-comp/userCardList"

const formSchema = z.object({
  api: z.enum(["classic", "sales_navigator"]),
  apiKey: z.string().min(1, "API Key is required"),
  accountId: z.string().min(1, "Account ID is required"),
  limit: z.number().min(1, "Limit must be at least 1"),
  firstName: z.string().optional(),
  company: z.string().optional(),
  keywords: z.string().optional(),
})

export default function SearchForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userProfiles, setUserProfiles] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      api: "classic",
      apiKey: "6o94JX4S.o0f3nQazq/tbSDCbnpzaYV0+tfC7Nxtns5KqS9Onfvw=",
      accountId: "2FwwXfeeRMy7bvc7-90fBQ",
      limit: 10,
      firstName: "",
      company: "",
      keywords: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setUserProfiles([])

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': values.apiKey
      },
      body: JSON.stringify({
        api: values.api,
        category: 'people',
        advanced_keywords: {
          first_name: values.firstName,
          company: values.company
        },
        keywords: values.keywords
      })
    };

    try {
      const response = await fetch(`https://api2.unipile.com:13212/api/v1/linkedin/search?limit=${values.limit}&account_id=${values.accountId}`, options)
      const data = await response.json()
      
      // Fetch user profiles for each search result
      const profiles = await Promise.all(data.items.map(async (item: any) => {
        const userResponse = await fetch(`https://api2.unipile.com:13212/api/v1/users/${item.public_identifier}?linkedin_sections=%2A&account_id=${values.accountId}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': values.apiKey,
            'Accept': 'application/json'
          }
        })
        return userResponse.json()
      }))
      setUserProfiles(profiles)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
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
                  <SelectItem value="sales_navigator">Sales Navigator</SelectItem>
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
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limit</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter limit" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Enter company" {...field} />
              </FormControl>
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
          <UserCardList users={userProfiles} />
        </div>
      )}
      </div>
      </form>
    </Form>
  )
}