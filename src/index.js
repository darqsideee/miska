import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { createBot } from './bot.js';
import { makeRouter } from './routes.js';

const config = {
  TOKEN: process.env.DISCORD_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
  ALLOW_ORIGIN: process.env.ALLOW_ORIGIN,
  PORT: Number(process.env.PORT || 8080),
};

if(!config.TOKEN) {
  console.error('Missing DISCORD_TOKEN in env.');
  process.exit(1);
}

const bot = createBot(config.TOKEN);
await bot.login();

const app = express();
app.use(express.json({ limit:'1mb' }));
app.use(morgan('tiny'));

app.use('/api', makeRouter({ bot, config }));

app.get('/', (_req,res)=> res.send('NovaSector Bot API'));
app.listen(config.PORT, ()=> console.log(`[API] listening on :${config.PORT}`));
