import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "eu-central-1" });

export const handler: Schema["generateHaiku"]["functionHandler"] = async (event, context) => {
  const { prompt, userData } = event.arguments;
  const modelId = process.env.MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0";

  const formatedData = JSON.stringify(userData, null, 2);
  
  const enhancedPrompt = `${prompt}\n\nPlease generate the message directly without stating 'Here’s a draft' or any introductory text. The message should be personalized based on the following data:
  ${formatedData}
  
  Make sure the response is ready to be sent without any additional phrases such as 'Here is the message.'`;
  

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

  const decodedResponseBody = new TextDecoder().decode(response.body);
  const responseBody = JSON.parse(decodedResponseBody);

  console.log(responseBody.content[0].text);

  return responseBody.content[0].text;
};