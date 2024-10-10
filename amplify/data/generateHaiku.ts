import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "eu-central-1" });

export const handler: Schema["generateHaiku"]["functionHandler"] = async (event, context) => {
  const { prompt, name, jobTitle, companyName } = event.arguments;
  const modelId = process.env.MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0";

  // Modify the prompt to include additional details
  const enhancedPrompt = `${prompt}\n\nHere is some additional information about the person you are contacting:
  - Name: ${name}
  - Job Title: ${jobTitle}
  - Company Name: ${companyName}`;

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: enhancedPrompt }],
      },
    ],
  };

  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });

  const response = await client.send(command);

  // Decode and return the response(s)
  const decodedResponseBody = new TextDecoder().decode(response.body);
  const responseBody = JSON.parse(decodedResponseBody);

  console.log(responseBody.content[0].text);

  return responseBody.content[0].text;
};
