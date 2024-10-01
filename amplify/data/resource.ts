import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

export const MODEL_ID = "amazon.titan-text-express-v1";

export const generateHaikuFunction = defineFunction({
  entry: "./generateHaiku.ts",
  environment: {
    MODEL_ID,
  },
});

const schema = a.schema({
  Industries: a
    .model({
      prompt: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Responses: a
    .model({
      response: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  generateHaiku: a
    .query()
    .arguments({ prompt: a.string().required() })
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(generateHaikuFunction)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
