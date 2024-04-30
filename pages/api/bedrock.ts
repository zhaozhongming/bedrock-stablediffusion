/*
This is a client to invoke Bedrock's Stable Diffusion model.
*/
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { IPromptPayload } from "@/pages/api/promptPayload";

var region = process.env.region;

export const invoke_bedrock = async (payload: IPromptPayload) => {
  var rand_seed = generate_random_seed(0, 4294967295);
  let cmdBody = '';
  if (!payload.imageBase64) {
    cmdBody = `{
      "text_prompts":[
          {
              "text":"${payload.prompt}"
          }],
      "cfg_scale":10,
      "seed":${rand_seed},
      "steps":50}`;
  }
  else {
    cmdBody = `{
      "text_prompts":[
          {
              "text":"${payload.prompt}"
          }],
      "init_image" : "${payload.imageBase64}",
      "cfg_scale":10,
      "seed":${rand_seed},
      "steps":50}`;
  }
  // Build the request payload for the Stable Diffusion model
  const params = { 
    contentType: 'application/json',
    accept: '*/*',
    modelId: 'stability.stable-diffusion-xl-v1',
    body: cmdBody,
  };

  const client = new BedrockRuntimeClient({region: region});

  try {
    const command = new InvokeModelCommand(params);
    const bedrock_response = await client.send(command);
    return bedrock_response;
  } catch (e) { 
    throw e;
  }
};

function generate_random_seed(min: number, max: number) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}