import { Client, GatewayIntentBits, TextChannel } from "discord.js";

const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || "";
const TOKEN = process.env.DISCORD_TOKEN || "";

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds],
});

discordClient.login(TOKEN);

export async function logErrorToDiscord(error: Error) {
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
}

export async function startDiscordLogger() {
  await new Promise((resolve, reject) => {
    discordClient.once("error", reject);
    discordClient.once("ready", () => {
      discordClient.off("error", reject); // Remove error listener
      console.log(`Discord error logging is ready`);
      resolve(true);
    });
  });
}
