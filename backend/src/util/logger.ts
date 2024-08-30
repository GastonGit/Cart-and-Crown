import { Client, GatewayIntentBits, TextChannel } from "discord.js";

const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || "";
const TOKEN = process.env.DISCORD_TOKEN || "";

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds],
});

discordClient.login(TOKEN);

export const logErrorToDiscord = async (error: Error) => {
  try {
    const channel = await discordClient.channels.fetch(CHANNEL_ID);
    if (channel && channel instanceof TextChannel) {
      channel.send(
        `🚨 **Error**: ${error.message}\n\`\`\`${error.stack}\`\`\``
      );
    }
  } catch (err) {
    console.error("Failed to log error to Discord:", err);
  }
};
