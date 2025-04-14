import express from 'express';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(morgan('common'));

app.get('/', (_req, res) => {
  res.send('Hello from Tomodachi Events API!');
});

app.post('/', (req, res) => {
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
