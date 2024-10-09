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
  timeoutSeconds: 120,
  name: "generateHaikuFunction",
});

const schema = a.schema({
  Industries: a
    .model({
      industryName: a.string(),
      prompt: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Responses: a
    .model({
      id: a.id().required(),
      responseId: a.id(),
      response: a.string(),
      cratedAt: a.datetime(),
    })
    .secondaryIndexes((index) => [index("responseId").sortKeys(['cratedAt']),])
    .authorization((allow) => [allow.publicApiKey()]),
    generateHaiku: a
    .query()
    .arguments({ 
        name: a.string(), 
        jobTitle: a.string(), 
        companyName: a.string(), 
        prompt: a.string().required() 
    })
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
