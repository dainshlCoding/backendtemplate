import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import commandLineArgs from 'command-line-args';

/**
 * Preprocesor is a single function.
 * It executes and sets up functionalities that must run BEFORE the node server is started.
 * This is useful for environment variables, command-line arguments, cron-jobs, database connections.
 */

(() => {
	setEnvironment();
	//connectToMongoDB()
	//	.then(() => log('DATABASE CONNECTION ESTABLISHED'))
	//	.catch((err) => logError(err));
})();

/**
 * Setup environemnt
 */
function setEnvironment() {
	// Setup command line options and declare environment
	const options = commandLineArgs([
		{
			name: 'env',
			alias: 'e',
			defaultValue: 'development',
			type: String,
		},
	]);
	// Set the environment
	const dotenvConfig = dotenv.config({
		path: path.join(__dirname, `env/${options.env}.env`),
	});
	if (dotenvConfig.error) {
		throw dotenvConfig.error;
	}
}

/**
 * Connect to your MongoDB via mongoose
 * @param mongoConnectionString 
 */
async function connectToMongoDB() {
	const mongoConnectionString = process.env.MONGODB;
	await mongoose.connect(mongoConnectionString);
}
