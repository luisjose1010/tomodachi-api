import express from 'express';
import morgan from 'morgan';

import { PrismaClient } from "@prisma/client";
import authRoutes from './routes/auth.routes';

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(morgan('common'));

app.get('/', (_req, res) => {
  res.send('Hello from Tomodachi Events API!');
});

app.use('/auth', authRoutes);

app.post('/users', (req, res) => {
  const data = {
    id_card: req.body.id_card,
    password: req.body.password,
    name: req.body.name,
    phone_number: req.body.phone_number,
    email: req.body.email,
    instagram: req.body.instagram,
    role_id: req.body.role_id,
  }

  const query = prisma.user.create({
    data
  })

  query.then((data) => {
    res.status(201).send(data);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

app.get('/users', (_req, res) => {
  prisma.user.findMany().then(data => res.json(data));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
