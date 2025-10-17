import { Router } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

const router = Router();
const ACCESS_EXP = '15m';
const REFRESH_EXP = '30d';

// Register
router.post('/register', async (req, res) => {
  const { email, phone, password, display_name, dob } = req.body;
  if (!display_name) return res.status(400).json({ error: 'missing display_name' });
  const repo = getRepository(User);
  const user = new User();
  user.email = email;
  user.phone = phone;
  user.display_name = display_name;
  user.dob = dob;
  if (password) user.password_hash = await bcrypt.hash(password, 12);
  await repo.save(user);
  // send verification email/OTP here
  res.json({ ok: true, userId: user.id });
});

// Login (email or phone)
router.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;
  const repo = getRepository(User);
  const user = email ? await repo.findOne({ where: { email } }) : await repo.findOne({ where: { phone } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.password_hash) return res.status(400).json({ error: 'No password set' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const access = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: ACCESS_EXP });
  const refresh = jwt.sign({ userId: user.id }, process.env.REFRESH_SECRET!, { expiresIn: REFRESH_EXP });
  // store refresh token in Redis or DB with device info (omitted for brevity)
  res.json({ access, refresh });
});

export default router;