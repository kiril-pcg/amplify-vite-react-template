import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { Schema } from "../../../amplify/data/resource"
  
  interface ResponseAccordionProps {
    responses: Array<Schema["Responses"]["type"]>
  }
  
  export function ResponseAccordion({ responses }: ResponseAccordionProps) {
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
  
    return (
      <Accordion type="single" collapsible className="w-full">
        {latestResponses.map((response) => (
          <AccordionItem key={response.id} value={response.id}>
            <AccordionTrigger>{formatDate(response.createdAt)}</AccordionTrigger>
            <AccordionContent>
              {response.response}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }