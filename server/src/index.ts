import express, { Request, Response } from 'express';
const app = express();
const port = 4000;

app.use(express.static(__dirname + '/../../client/build'));

app.get('/', (req: Request, res: Response) =>
  res.sendFile(__dirname + '/../../client/build/index.html')
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
