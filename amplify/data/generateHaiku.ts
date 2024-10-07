import type { Schema } from "./resource";

export const handler: Schema["generateHaiku"]["functionHandler"] = async (
  event,
  context
) => {
  const prompt = event.arguments.prompt;
  return `The prompt is: ${prompt}`
};
