import { Client, GatewayIntentBits, Partials } from 'discord.js';

export function createBot(token) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
  });

  client.once('ready', () => {
    console.log(`[BOT] Logged in as ${client.user.tag}`);
  });

  client.on('error', (e)=> console.error('[BOT] error', e));
  client.on('shardError', (e)=> console.error('[BOT] shard error', e));

  async function sendDM(userId, embed) {
    const user = await client.users.fetch(userId);
    const dm = await user.createDM();
    return dm.send({ embeds: [embed] });
  }

  async function getMember(guildId, userId) {
    const g = await client.guilds.fetch(guildId);
    return g.members.fetch(userId);
  }

  return {
    client,
    login: () => client.login(token),
    sendDM,
    getMember
  };
}
