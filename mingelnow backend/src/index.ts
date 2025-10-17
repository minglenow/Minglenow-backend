import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (_, res) => res.send('MingleNow backend running.'));
app.listen(4000, () => console.log('Server running on port 4000'));