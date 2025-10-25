import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { makeEmbed } from './embed.js';

export function makeRouter({ bot, config }) {
  const r = express.Router();

  const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 20
  });

  r.use(limiter);
  r.use(cors({
    origin: config.ALLOW_ORIGIN || '*'
  }));

  // Simple auth middleware
  r.use((req, res, next) => {
    const sec = req.headers['x-admin-secret'];
    if(!config.ADMIN_SECRET || sec !== config.ADMIN_SECRET) {
      return res.status(403).json({ ok:false, error:'forbidden' });
    }
    next();
  });

  // Health
  r.get('/health', (req, res) => res.json({ ok:true, up:true }));

  // Send DM embed
  r.post('/dm', async (req, res) => {
    try {
      const { userId, type, head, body, by } = req.body || {};
      if(!userId || !head || !body) return res.status(400).json({ ok:false, error:'missing_params' });
      const embed = makeEmbed({ type, head, body, by });
      await bot.sendDM(userId, embed);
      res.json({ ok:true });
    } catch(e) {
      console.error('[DM] error', e);
      res.status(500).json({ ok:false, error:'dm_failed' });
    }
  });

  // Optional: check member roles (pro webovou autorizaci)
  r.get('/member/:userId', async (req, res) => {
    try {
      const m = await bot.getMember(config.GUILD_ID, req.params.userId);
      res.json({ ok:true, roles:[...m.roles.cache.keys()] });
    } catch(e) {
      res.status(404).json({ ok:false, error:'not_found' });
    }
  });

  return r;
}
