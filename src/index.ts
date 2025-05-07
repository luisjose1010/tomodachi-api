import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { authRouter } from './routes/auth.routes';
import { usersRouter } from './routes/users.routes';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(morgan('common'));
app.use(cors());

app.get('/', (_req, res) => {
  res.send('Hello from Tomodachi Events API!');
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { app };
