import { EmbedBuilder } from 'discord.js';

export function makeEmbed({ type='info', head, body, by }) {
  const color = type === 'warn' ? 0xff0000 : 0x7c3aed;
  return new EmbedBuilder()
    .setTitle(head)
    .setDescription(body)
    .setColor(color)
    .setTimestamp(new Date())
    .setFooter({ text: by ? `Sent by ${by}` : 'Web message' });
}
