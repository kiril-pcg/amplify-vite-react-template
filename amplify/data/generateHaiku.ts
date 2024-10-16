import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "eu-central-1" });

export const handler: Schema["generateHaiku"]["functionHandler"] = async (event, context) => {
  const { prompt, name, jobTitle, companyName, about } = event.arguments;
  const modelId = process.env.MODEL_ID;

  // Format the prompt for Meta Llama 3
  const enhancedPrompt = `
<|begin_of_text|><|start_header_id|>user<|end_header_id|>
${prompt}\n\nPlease generate the message directly without stating 'Here’s a draft' or any introductory text. The message should be personalized for the following individual:
- Name: ${name}
- Job Title: ${jobTitle}
- Company Name: ${companyName}
- About: ${about}
Make sure the response is ready to be sent without any additional phrases such as 'Here is the message.'
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
`;

  // Define the payload according to Llama 3's structure
  const payload = {
    prompt: enhancedPrompt,
    max_gen_len: 1000, // You can adjust this based on your needs
    temperature: 0.5,  // Adjust to control randomness
    top_p: 0.9,        // Adjust to control token distribution
  };

  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });

  try {
    const response = await client.send(command);

    // Decode the response body
    const decodedResponseBody = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decodedResponseBody);

    // Assuming the response contains a 'generation' field with the text output
    const responseText = responseBody.generation;

    console.log(responseText);

    return responseText;
  } catch (error) {
    console.error('Error invoking model:', error);
    throw new Error('Failed to invoke Meta Llama 3 model');
  }
};
