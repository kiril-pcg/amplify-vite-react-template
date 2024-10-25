import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "eu-central-1" });

export const handler: Schema["generateHaiku"]["functionHandler"] = async (event, context) => {
  const {
    prompt,
    first_name = "Unknown",
    last_name = "User",
    headline = "No headline available",
    location = "Unknown location",
    summary = "No summary available",
    test = "test"
  } = event.arguments;

  const modelId = process.env.MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0";

  // Construct a user description from the selected fields
  const userDescription = `
    His name is ${first_name} ${last_name}.
    He is located in ${location}.
    His professional headline is: "${headline}".
    Here is a brief summary of him: "${summary}".
  `.trim();

  // Build the enhanced prompt
  const enhancedPrompt = `${prompt}\n\nPlease generate a message directly, without introductory phrases. The message should be personalized based on the following details:\n${userDescription}\n\nEnsure the message is complete and can be sent as-is.`;

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

  try {
    const response = await client.send(command);
    const decodedResponseBody = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decodedResponseBody);

    console.log("Generated message:", responseBody.content[0].text);

    return responseBody.content[0].text;

  } catch (error) {
    console.error("Error invoking model:", error);
    throw new Error("Model invocation failed. Please check the logs for more details.");
  }
};
