import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient();

export const handler: Schema["generateHaiku"]["functionHandler"] = async (
  event,
  context
) => {
  const { prompt, name, jobTitle, companyName } = event.arguments;
  const modelId = process.env.MODEL_ID;

  // Modify the prompt to include additional details
  const enhancedPrompt = `${prompt}\n\nHere is some additional information about the person you are contacting:
  - Name: ${name}
  - Job Title: ${jobTitle}
  - Company Name: ${companyName}`;

  const payload = {
    inputText: enhancedPrompt,
    textGenerationConfig: {
      maxTokenCount: 4096,
      stopSequences: [],
      temperature: 0,
      topP: 1,
    },
  };

  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });

  const response = await client.send(command);

  const decodedResponseBody = new TextDecoder().decode(response.body);
  const responseBody = JSON.parse(decodedResponseBody);

  console.log(responseBody.results[0].outputText); 

  return responseBody.results[0].outputText;
};
