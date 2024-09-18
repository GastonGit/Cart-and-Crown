import { DISCORD_CHANNEL_ID, DISCORD_TOKEN } from "../globalconfig";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";

let discordClient: Client | null = null;

export async function startDiscordLogger() {
  const _discordClient = new Client({
    intents: [GatewayIntentBits.Guilds],
  });
  _discordClient.login(DISCORD_TOKEN);

  await new Promise((resolve, reject) => {
    _discordClient.once("error", reject);
    _discordClient.once("ready", () => {
      _discordClient.off("error", reject); // Remove error listener
      console.log("Loaded discord client");
      discordClient = _discordClient;
      resolve(true);
    });
  });
}

export async function logErrorToDiscord(error: Error) {
  if (!discordClient) {
    throw new Error("Discord client is not loaded!");
  }

  try {
    const channel = await discordClient.channels.fetch(DISCORD_CHANNEL_ID);
    if (channel && channel instanceof TextChannel) {
      channel.send(
        `🚨 **Error**: ${error.message}\n\`\`\`${error.stack}\`\`\``
      );
    }
  } catch (err) {
    console.error("Failed to log error to Discord:", err);
  }
}
