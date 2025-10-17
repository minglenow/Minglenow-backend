import { Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

const router = Router();

router.get('/candidates', async (req, res) => {
  const { userId, lat, lng, max_distance = 50, min_age = 18, max_age = 99, limit = 20 } = req.query;
  const repo = getRepository(User);
  // Very simple example: use PostGIS to filter distance
  const raw = await repo.query(
    SELECT id, display_name, bio, ST_DistanceSphere(location, ST_MakePoint($1, $2)) as distance_m
     FROM users
     WHERE id != $3
       AND (date_part('year', age(dob)) BETWEEN $4 AND $5)
     ORDER BY distance_m
     LIMIT $6,
    [lng, lat, userId, min_age, max_age, limit]
  );

  // Apply additional scoring in app; this is a start
  res.json({ candidates: raw });
});

export default router;