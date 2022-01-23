function forestStory(party, slow) {
	var plural = party.length - 1;
	var serv = characters.serv;
	var aid = characters.aid;
	var king = characters.king;
	var prince = characters.prince;
	var forest = locations.forest;
	var a, me = plural? "us": "me", you = plural? "y'all": "you";
	var I = plural? "we": "I";
	var list = [
		say(slow, aid, "Your highness, we have a messenger. It's about the prophecy"),
		say(slow, king, "Splendid! Send them in at once!"),
		say(slow, aid, "As you wish sire"),
		action(slow, aid, "Brings the messenger into the room"),
		blank,
		say(slow, serv, "Your highness, I bring great news."),
		say(slow, king, "Very well, out with it!"),
		say(slow, king, "Have you determined a location yet?"),
		say(slow, serv, `We have located ${plural? "a few of the": "one of the"} heros; they are somewhere in the forest`),
		say(slow, king, "Good, I will be off at once"),
		say(slow, serv, "o-o, Your highness, the prince has already left to retrieve them"),
		say(slow, king, "What? Who gave him orders to do such a thing?"),
		say(slow, serv, "The prince wishes that you stay put sire"),
		say(slow, king, "Sigh. Too kind, that boy. He should let me do my job every once in a while."),
		blank, location(slow, forest), blank,
		say(slow, prince, `Hello over there! Greetings${plural? " all around": ""}!`),
		sayPer(slow, a = pickBlob(party), {
			Ki: "Good afternoon! You are?",
			En: "Good afternoon!",
			La: "Hey.",
			Co: "Who are you?",
			Ai: "Oh, Hello",
			St: "Ello",
			Ca: "Who are you?"
		}),
		sayPer(slow, prince, {
			Ki: `Why, I am the prince. ${prince.name} of the Birch Empire.`,
			En: `It is indeed, isn't it? I am ${prince.name}, of the Birch Empire.`,
			La: `Hello indeed, I am ${prince.name} of the Birch Empire.`,
			Co: `Why, none other than the prince. ${prince.name} of the Birch Empire.`,
			Ai: `Hello indeed, I am ${prince.name} of the Birch Empire.`,
			St: `Yes, hello indeed, I am ${prince.name} of the Birch Empire.`,
			Ca: `Why, none other than the prince. ${prince.name} of the Birch Empire.`
		}, a.per),
		say(slow, prince, `I have come to retrieve ${you}. The king would like to speak with ${you} personally.`),
		sayPer(slow, a = pickBlob(party), {
			Ki: "Oh wow! Sounds pretty important.",
			En: `The King? Want to speak with ${me}? AWESOME!`,
			La: `Well, if it's for the King, I guess ${I} can't refuse`,
			Co: `The king? Need ${me}? I'm down`,
			Ai: `${plural? "We have": "There's"} a king?`,
			St: `Whaat? What's a king want with ${me}`,
			Ca: `Oh! Whatever could the king need ${me} for?`
		}),
		sayPer(slow, prince, {
			Ki: `Yes indeed. A matter of such imporance that I, the prince, have come here myself`,
			En: `Yes, love the enthusiasm`,
			La: "Glad your on board",
			Co: `Splendid, let's be off at once`,
			Ai: `Why of course! This land wouldn't be so great without the hard work of my father.`,
			St: `You are more important than you think.`,
			Ca: `${plural? "You all": "You"} are special. Special enough for I, the prince, to come here myself and retrieve you.`
		}, a.per),
		say(slow, prince, `I'll explain on the way, ${plural? "you are": "you are all"} very important to us`),
		say(slow, prince, `Don't worry about whatever monsters approach, I'll be sure to take them down swiftly.`)
	];
	if(slow) return list;
	else return list.join("\n");
}
function sayPer(slow, who, opt, per) {
	return say(slow, who, opt[per || who.per]);
}
function pickBlob(party) {return party[Math.floor(Math.random() * party.length)]}
function say(slow, who, what) {
	if(slow) {
		var url = getImage(who.type || who.id);
		return {
			text: what,
			user: {
				username: who.name,
				avatarURL: url
			}
		};
	}
	var icon = who.emoji || getEmoji(who.id);
	return `${who.name} ${icon}: "${what}"`;
}
function action(slow, who, what) {
	if(slow) {
		var url = getImage(who.type || who.id);
		return {
			text: `\\*${what}\\*`,
			user: {
				username: who.name,
				avatarURL: url
			}
		};
	}
	var icon = who.emoji || getEmoji(who.id);
	return `${who.name} ${icon}: \\*${what}\\*`;
}
function location(slow, where) {
	if(slow) {
		var url = getImage(where.type || where.id);
		var icon = where.emoji || getEmoji(where.id || where.type);
		return {
			text: `${icon}${where.name}${icon}`,
			user: {
				username: where.name,
				avatarURL: url
			}
		};
	}
	icon = where.emoji || getEmoji(where.id || where.type);
	return `${icon}${where.name}${icon}`;
}
var {getEmoji, getImage} = require("./stats");
var blank = "\u200B";
var locations = {
	forest: {
		name: "Forest",
		id: "forest"
	}
};
var characters = {
	king: {
		name: "King",
		id: "king"
	},
	serv: {
		name: "Servant",
		id: "servant"
	},
	aid: {
		name: "Royal aid",
		id: "aid"
	},
	prince: {
		name: "Prince Phillip",
		id: "prince"
	}
};
var chapters = [{
	name: "Prologue",
	emoji: "forest",
	description: "And so our story begins...",
	text: forestStory
}, {
	name: "Battle",
	emoji: "forest",
	description: "Our heros make their way through the forest, fighting the enemies that stand in their way",
	battle: {
		allies: [{
			type: "prince",
			lvl: 6,
			name: characters.prince.name
		}],
		enemies: [{
			type: "plant",
			lvl: 1
		}, {
			type: "plant",
			lvl: 1
		}],
		enemy: "Forest",
		msg: "Enemies spring out from in the forest!"
	}
}];

module.exports = {forest: forestStory, chapters};