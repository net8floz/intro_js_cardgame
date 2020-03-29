import express from 'express';
const port = 6969;
const app = express();
 
app.get('/', (req, res) => { 
  res.json({ hello: 'world' });  
});

app.listen(port); 
