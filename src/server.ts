import app from './app';
import { PORT } from './config/server-config';

const setupAndStartServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

setupAndStartServer();
