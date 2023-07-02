import { Router } from 'express';
//import { adminMw, jwtCheck } from './middleware';


//Final router object used in server.ts
const apiRouter = Router();

// Add routers for each controller and assign unique base path
// apiRouter.use('/auth', authRouter);
// apiRouter.use('/user', jwtCheck, userRouter);
//apiRouter.use('/dbmigration', adminMw, migrationRouter);

export default apiRouter;
