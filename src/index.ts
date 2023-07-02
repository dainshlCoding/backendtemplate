import './preprocessor'; // Must be the first import!!!
import server from './server';

const serverStartMsg = 'Express server started on port: ',
	port = process.env.PORT;

server.listen(port, () => {
	console.log(serverStartMsg + port);
	console.log(process.env.MONGODB)
});
