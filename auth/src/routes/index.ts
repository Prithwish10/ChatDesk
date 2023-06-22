import { Router } from "express";

export default () => {
  const app = Router();

  app.get('/users/currentuser', (req, res) => {
    res.send('Hi There!!');
  })

  return app;
};
