const GuildSchema = {

	GhostPing: {
		on: false,
		channel: '',
	},

	Tickets: {
		settings: {
			category: '',
			on: false,
			logs: '',
		},
		case: 0,
		active: [
			/**
			 * @example [UserId, UserId]
			**/
		],
	},

	Moderation: {
		logs: {
			on: false,
			channel: '',
		},
		case: 0,
		cases: {
			/**
			 * @example UserId: {ModerationSchema}
			**/
		},
	},
};

const ModerationSchema = {
	type: '',
	case: 0,
	reason: '',

	username: '',
	time: new Date(),

	moderator: {
		username: '',
		id: '',
	},
};

module.exports = {
	GuildSchema,
	ModerationSchema,
};
