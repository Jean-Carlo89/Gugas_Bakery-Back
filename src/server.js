import './setup.js'; 
import app from './app.js'

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT)
    console.log(process.env.DB_DATABASE)
    console.log(process.env.DB_USER)
  console.log(`Server is listening on port ${process.env.PORT}`);
});