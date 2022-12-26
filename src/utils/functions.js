/* Import Required Types and Modules */
const { Collection } = require('discord.js');
const { GuildSchema } = require('./Database Schema.js');


/**
 * Get ID from the mention format: <@0000>
 * @function
 * @author Liam Skinner <me@liamskinner.co.uk>
 *
 * @param {object} value
 * @param {string} value.string - Discord Mention || UserId
 *
 * @returns {string}
**/
const getUserId = ({ string }) => {

	const matches = string.match(/^<@!?(\d+)>$/);
	return matches ? matches[1] : string;

};


/* Connection to the Firestore Database */
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env['Database'])) });
const firestore = admin.firestore();

/* Create the Database's cache */
const cache = new Collection();
const database = {

	/**
	 * Get a value from the cache or fetch from the database
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {string} documentID The document ID
	 *
	 * @returns {object} Database Object
	**/
	getValue: async (documentID) => {

		/* Is the data in the cache? */
		const cacheData = cache.get(documentID);
		if (cacheData) return cacheData;

		/* Fetch the data from Firestore */
		const collection = await firestore.collection('guilds').doc(documentID).get();
		const firestoreData = collection.data() || GuildSchema;

		/* Set the values in the database */
		cache.delete(documentID);
		cache.set(documentID, firestoreData);
		return firestoreData;
	},

	/**
	 * Set a value in the database and cache
	 * @async @function
	 * @author Liam Skinner <me@liamskinner.co.uk>
	 *
	 * @param {string} documentID The document ID
	 * @param {object} data The new data to set
	 *
	 * @returns {boolean} Whether it was successful
	**/
	setValue: async (documentID, data) => {

		/* Update the cache */
		cache.delete(documentID);
		cache.set(documentID, data);

		/* Update the database */
		await firestore.collection('guilds').doc(documentID).set(data);
		return true;
	},
};


/**
 * Change a strings length with 2 way padding
 * @function
 * @author Liam Skinner <me@liamskinner.co.uk>
 *
 * @param {string} str
 * @param {number} length - Idea length of the string
 *
 * @returns {string}
**/
const fitString = (str, length) => (str + ' '.repeat(length -= str.length));

/**
 * Form a grid of values from a 2D Array
 * @function
 * @author Liam Skinner <me@liamskinner.co.uk>
 *
 * @param {array<array<string>>} results - 2d array of string values
 *
 * @returns {string}
**/
const makeGrid = (results) => {
	const rows = [];

	for (let y = 0; y < results[0].length; y++) {
		const values = [y + 1];

		for (let x = 0; x < 3; x++) {
			if (x == '0') {
				const num = results[x][y].toString();
				values.push(`${num.length == 2 ? 0 + num.toString() : num.toString()} ms  `);
			}
			else { values.push(fitString(results[x][y].toString(), [8, 7, 7][x])); }
		}
		rows[y] = `| ${values[0]}  |  ${values[1]}|   ${values[2]}|  ${values[3]}|`;
	}

	const border = '+----+----------+----------+---------+';
	const title = '| ID |   PING   | SERVERS  |  USERS  |';

	return [border, title, border].concat(rows).concat(border).join('\n');
};


/**
 * Format seconds in it's highest denomination
 * @function
 * @author Liam Skinner <me@liamskinner.co.uk>
 *
 * @param {number} seconds - time in seconds
 *
 * @returns {string}
**/
const formatTime = (seconds) => {

	const denominations = [
		[1, 'Second'],
		[60, 'Minute'],
		[60 * 60, 'Hour'],
	];
	const type = (seconds < 61 ? 0 : (seconds < 3600 ? 1 : 2));
	const num = Math.floor(seconds / denominations[type][0]);

	return `${num} ${denominations[type][1]}${num != 1 ? 's' : ''}`;
};


module.exports = {
	getUserId,
	database,
	fitString,
	makeGrid,
	formatTime,
};
