import { create } from "apisauce";
import getAppConfig from "./appConfig";

const genericBaseURL = create({
  baseURL: "",
});

const sendDiscordMessage = (message: string) => {
  if (!getAppConfig().appDiscordWebhookURL) return null;
  genericBaseURL.post(
    getAppConfig().appDiscordWebhookURL,
    {
      content: message,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return null;
};

export default function (message: string) {
  if (!message) return null;
  const newMessage = `
An event occured and here are the details:
  
${message}

DATE: ${new Date().toLocaleString()}
  `;

  sendDiscordMessage(newMessage);
  return;
}
