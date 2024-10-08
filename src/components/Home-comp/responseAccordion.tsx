import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Schema } from "../../../amplify/data/resource"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ResponseAccordionProps {
  responses: Array<Schema["Responses"]["type"]>
}

export function ResponseAccordion({ responses }: ResponseAccordionProps) {
  const { toast } = useToast()
  const [openItems, setOpenItems] = useState<string[]>(["0", "1", "2"])

  const latestResponses = responses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        description: "Text copied to clipboard",
      })
    }, (err) => {
      console.error('Could not copy text: ', err)
      toast({
        variant: "destructive",
        description: "Failed to copy text",
      })
    })
  }

  return (
    <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="w-full">
      {latestResponses.map((response, index) => (
        <AccordionItem key={response.id} value={index.toString()}>
          <AccordionTrigger>{formatDate(response.createdAt)}</AccordionTrigger>
          <AccordionContent>
            <div className="flex justify-between items-start">
              <div className="flex-grow pr-4">{response.response}</div>
              <Button
                variant="outline"
                size="icon"
                className="p-2.5"
                onClick={(e) => {
                  e.preventDefault()
                  copyToClipboard(response.response || "")
                }}
                aria-label="Copy response"
              >
                <Copy />
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}