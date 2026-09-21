import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'MindCare AI Backend is running',
    status: 'success'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MindCare AI'
  });
});

app.listen(PORT, () => {
  console.log(`MindCare AI server running on http://localhost:${PORT}`);
});