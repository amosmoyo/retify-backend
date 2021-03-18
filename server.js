const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT * 1;

app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});
