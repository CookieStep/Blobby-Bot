console.clear();
const Discord = require('discord.js');
const {Client, Intents, Guild, ApplicationCommand, CommandInteraction, MessageButton} = Discord;
const bot = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_MESSAGES]});

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`)
});

bot.on("messageCreate", async (_, msg) => {msg = _;
	if(msg.content == "?cmds") {
		try{
			await updateInteractions(msg.guild);
			msg.channel.send("Updated?");
		}catch(err) {
			msg.channel.send(err.message)
		}
	}
	if(msg.content == "?pfp") {
		updateInteractions(msg.guild);
		msg.channel.send(msg.member.user.avatarURL({format: "png", size: 1024}));
	}
	var {content} = msg;
	if (content.startsWith("?")) {
		var [command, ...parameters] = content.slice(1).split(' ');
		if(command == '') command = parameters.shift();
		if(cmds.has(command)) {
			msg.command = command;
			cmds.run(command, msg, ...parameters);
		}
	}
});
if(false) {
	/**@type {(msg: Discord.Message, ...params: string[]) => void}*/
	var command = () => {};
	/**@type {(msg: Discord.ButtonInteraction, ...params: string[]) => void}*/
	var bcmd = () => {};
	// commands.command = command;
}
/**@type {Map<string, command>}*/
var cmds = new Map();
cmds.add = (cmd, ...names) => names.forEach(name => cmds.set(name, cmd));
cmds.create = () => {};
cmds.run = (cmd, ...parameters) => cmds.get(cmd)(...parameters);

cmds.set("giveBlobSkill", async (msg, name, skill) => {
	var user = msg.member;
	if(user.id != ownerid) {
		msg.reply("You do not have permission to do that!");
		return;
	}
	var data = await userdata.load(user);
	var blob = data.getBlob(name);
	if(blob) {
		if(blob.skills.includes(skill)) {
			return msg.reply("This blob already has that skill!");
		}else{
			if(blobs.skills[skill]) {
				blob.skills.push(skill);
				msg.reply("Success!");
			}else return msg.reply("The skill does not exist!");
		}
	}else{
		msg.reply(`Unable to find a blob with named "${string}}"\nCheck your blobs?"`);
	}
});
cmds.set("setBlob", async (msg, name, lvl=1) => {
	var user = msg.member;
	if(user.id != ownerid) {
		msg.reply("You do not have permission to do that!");
		return;
	}
	if(name in blobs.base) {
		var data = await userdata.load(user);
		var blob = new userdata.Blob({type: name, lvl: +lvl});
		data.blobs.push(blob);
		userdata.save(user);
		msg.reply("Done!");
	}else{
		msg.reply("Blob not found!");
	}
});
cmds.set("myData", async msg => {
	var user = msg.member;
	if(user.id != ownerid) {
		msg.reply("You do not have permission to do that!");
		return;
	}
	var data = await userdata.load(user);
	msg.reply(JSON.stringify(data));
});
cmds.set("deleteMyData", async msg => {
	var user = msg.member;
	if(user.id != ownerid) {
		msg.reply("You do not have permission to do that!");
		return;
	}
	user = "u" + user;
	userdata.users.delete(user);
	await database.delete(user);
	msg.reply("Data cleared");
});
cmds.set("deleteDataFor", async (msg, user) => {
	if(msg.member.id != ownerid) {
		msg.reply("You do not have permission to do that!");
		return;
	}
	userdata.users.delete(user);
	user = "u" + user;
	await database.delete(user);
	msg.reply("Data cleared");
});
cmds.set("hub", async (msg, name, lvl=1) => {
	var user = msg.member;
	if(user.id != ownerid) {
		msg.reply("You do not have permission to do that!");
		return;
	}
	hub = msg.guild;
	database.set("myHub", hub.id);
});
bot.on("interactionCreate", (_, cmd) => {cmd = _;
	if(cmd.isCommand()) {
		var command = commands.get(cmd.commandName);
		if(command) command(cmd);
		else{
			cmd.reply("Unknown command.");
		}
	}
	if(cmd.isButton()) {
		var str = cmd.customId;
		var [name, ...params] = str.split(" ");
		var command = buttons.get(name);
		if(command) command(cmd, ...params);
		else{
			cmd.reply("Unknown button.");
		}
	}
});

/**@param {Guild} guild*/
function updateInteractions(guild) {
	return guild.commands.set(interactions);
}

/**@type {Map<string, (int: CommandInteraction) => void>}*/
var commands = new Map;
/**@type {Map<string, bcmd>}*/
var buttons = new Map;

/**@type {ApplicationCommand[]}*/
const interactions = [{
	name: "test",
	description: "Test?"
}, {
	name: "story",
	description: "Story mode."
}, {
	name: "say",
	description: "Test2",
	options: [{
		name: "text",
		description: "String",
		type: "STRING",
		required: true
	}]
}, {
	name: "blob",
	description: "View your blob's stats",
	options: [{
		name: "blobname",
		description: "The name of the blob",
		type: "STRING",
		required: true
	}]
}, {
	name: "blobs",
	description: "View your blobs",
	options: [{
		name: "who",
		description: "who's blobs do you wanna see?",
		type: "MENTIONABLE"
	}]
}, {
	name: "roll",
	description: "Gacha for blobs"
}, {
	name: "party",
	description: "View party",
	options: [{
		name: "who",
		description: "who's party do you wanna see?",
		type: "MENTIONABLE"
	}]
}, {
	name: "fight",
	description: "Battle",
	options: [{
		name: "who",
		description: "who's your opponent?",
		type: "MENTIONABLE",
		required: true
	}]
}];
commands.set("story", async cmd => {
	var data = await userdata.load(cmd.user);
	// var member = cmd.options.get("who").user;
	// var other = await userdata.load(member);

	if(!data._party.length) {
		cmd.reply({
			content: "You don't have a party!",
			ephemeral: true
		});
		return;
	}
	var embed = new Discord.MessageEmbed;

	embed.setTitle("Chapter select");
	embed.setFooter(cmd.user.id);
	if(data.story in story.chapters) {
		desc = story.chapters[data.story].description;
	}else var desc = "No more story yet, check back later!";
	embed.setDescription(desc);
	
	cmd.reply({
		embeds: [embed],
		components: generateChapterButtons()
	});

	function generateChapterButtons() {
		var {ceil, min} = Math;
		var rows = [];
		var {story: len} = data;
		var len = len + 1;
		var m = ceil(len/5);
		var n = 0;
		all: for(let i = 0; i < m; i++) {
			let b = 5 * (i + 1);
			b = min(b, len);
			let row = new Discord.MessageActionRow;
			rows.push(row);
			for(let a = i * 5; a < b; a++) {
				let blob = story.chapters[n++];
				if(!blob || n > len) break all;
				if(blob.battle && n != len) {
					--a;
					continue;
				}
				let button = new Discord.MessageButton;
				button.setCustomId(`story.start ${a}`);
				button.setLabel(blob.name);
				button.setEmoji(blobs.getEmoji(blob.emoji));
				button.setStyle(blob.text? "SECONDARY": "PRIMARY");
				row.addComponents(button);
			}
		}
		return rows;
	}
});
buttons.set("story.start", async (cmd, ch) => {
	if(cmd.message) var uid = cmd.message.embeds[0].footer.text;
	else uid = cmd.user.id;
	var data = await userdata.load(uid);
	ch = +ch;
	if(data.story < ch) return cmd.reply({
		content: "You can't access this chapter yet!",
		ephemeral: true
	});
	var chapter = story.chapters[ch];
	if(!chapter) return cmd.reply({
		content: "This chapter does not exist?",
		ephemeral: true
	});
	var slow = true;
	if(chapter.text) {
		var row = new Discord.MessageActionRow;
		var button = new Discord.MessageButton;
		button.setCustomId(`story.visual ${ch}`);
		button.setLabel("Visual");
		button.setStyle("PRIMARY");
		row.addComponents(button);

		button = new Discord.MessageButton;
		button.setCustomId(`story.list ${ch}`);
		button.setLabel("List");
		button.setStyle("SECONDARY");
		row.addComponents(button);

		button = new Discord.MessageButton;
		button.setCustomId(`story.skip ${ch}`);
		button.setLabel("Skip");
		button.setStyle("DANGER");
		row.addComponents(button);

		cmd.reply({
			content: "How would you like to view this cutscene?",
			components: [row],
			ephemeral: true
		});
	}else{
		//cmd.reply("Not yet implemented- Sorry");
		if(ch != data.story) {
			cmd.reply({
				content: "You've already completed this",
				ephemeral: true
			});
			return;
		}
		var member = {
			username: chapter.battle.enemy,
			id: "BOT"
		};
		var data = {party: [...data.party, ...chapter.battle.allies.map(obj =>
			new userdata.Blob(obj)
		)]}
		var other = {
			party: chapter.battle.enemies.map(obj =>
				new userdata.Blob(obj)
			)
		};
		var embed = blobs.battleSheet(data, other, cmd.user.username, member.username);
		await cmd.reply(chapter.battle.msg);
		var msg = await cmd.channel.send({
			embeds: [embed],
			components: [battleConfirmButtons()]
		});
		var battle = new Battle.Battle(member, cmd.user, msg, chapter);
	}
});
buttons.set("story.visual", async (cmd, ch) => {
	try{
		let channel = cmd.channel;
		let webhooks = await channel.fetchWebhooks();
		/**@type {Discord.WebhookClient}*/
		var webhook = webhooks.find(hook => hook.name == 'cooki.web');
		if(!webhook.token) {
			await webhook.delete();
			webhook = 0;
		}
		if(!webhook) webhook = await channel.createWebhook("cooki.web");
	}catch(err) {
		return cmd.reply("I don't have permision to use webhooks!");
	}
	
	var row = new Discord.MessageActionRow;
	var button = new Discord.MessageButton;
	button.setCustomId(`scene.next`);
	button.setLabel("Next");
	button.setStyle("PRIMARY");
	row.addComponents(button);
	
	button = new Discord.MessageButton;
	button.setCustomId(`scene.auto`);
	button.setLabel("Auto");
	button.setStyle("SECONDARY");
	row.addComponents(button);

	button = new Discord.MessageButton;
	button.setCustomId(`scene.skip`);
	button.setLabel("Skip");
	button.setStyle("DANGER");
	row.addComponents(button);

	// var a = cmd.reply({
	// 	content: blank,
	// 	components: [row]
	// });
	await cmd.reply(blank);
	cmd.deleteReply();
	var chapter = story.chapters[ch];
	var data = await userdata.load(cmd.user);
	var lines = chapter.text(data.party, true);
	var auto = false;
	var stop;
	for(let line of lines) {
		if(line.text) {
			let {text, user} = line;
			var obj = {
				username: user.username,
				avatarURL: user.avatarURL,
				content: text
			};
			if(auto) {
				await webhook.send(obj);
				await delay(1500);
			}else{
				obj.components = [row];
				var msg = await webhook.send(obj);
				var input = await next();
				if(input) break;
			};
		}else await delay(1500);
		if(stop) break;
	}
	function next() {
		return new Promise(resolve => {
			async function handler(int) {
				if(int.message && int.message.id == msg.id) {
					if(int.user == cmd.user) {
						if(int.customId == "scene.skip") {
							bot.off("interactionCreate", handler);
							await webhook.editMessage(msg, {components: []});
							resolve(true);
							auto = false;
							stop = true;
							await int.reply(blank);
							int.deleteReply();
						}
						if(int.customId == "scene.next") {
							bot.off("interactionCreate", handler);
							await webhook.editMessage(msg, {components: []});
							resolve();
							auto = false;
							await int.reply(blank);
							int.deleteReply();
						}
						if(int.customId == "scene.auto") {
							if(auto) {
								bot.off("interactionCreate", handler);
								await webhook.editMessage(msg, {components: []});
								auto = false;
								resolve();
							}else{
								auto = true;
								resolve();
							}
							await int.reply(blank);
							int.deleteReply();
						}
					}else cmd.reply({
						content: `Let ${cmd.user.username} watch at their own pace.`,
						ephemeral: true
					});
				}
			}
			bot.on("interactionCreate", handler);
		});
	}
	ch = (+ch) + 1;
	if(data.story < ch) {
		data.story = ch;
		userdata.save(cmd.user);
	}
	userdata.save(cmd.user);
});
buttons.set("story.list", async (cmd, ch) => {
	var chapter = story.chapters[ch];
	var data = await userdata.load(cmd.user);
	cmd.reply(chapter.text(data.party));
	ch = (+ch) + 1;
	if(data.story < ch) {
		data.story = ch;
		userdata.save(cmd.user);
	}
});
buttons.set("story.skip", async (cmd, ch) => {
	var chapter = story.chapters[ch];
	var data = await userdata.load(cmd.user);
	cmd.reply("Skipped!");
	ch = (+ch) + 1;
	if(data.story < ch) {
		data.story = ch;
		userdata.save(cmd.user);
	}
	await delay(3000);
	cmd.deleteReply();
});
{
	let handler = async cmd => {/*
		await delay(1500);
		if(!cmd.replied) cmd.reply({
			content: "Session has expired",
			ephemeral: true
		});*/
	}
	buttons.set("scene.next", handler);
	buttons.set("scene.auto", handler);
	buttons.set("scene.skip", handler);
}
commands.set("say", async cmd => {
	var string = cmd.options.getString("text");
	console.log(string);
	cmd.reply(string);
});
/**@param {User} data @param {Blob} blob*/
function createPartyRow(data, blob) {
	var row = new Discord.MessageActionRow;
	var button = new MessageButton;
	for(let i = 0; i < 4; i++) {
		button = new MessageButton;
		button.setCustomId("profile.setSlot "+i);
		button.setLabel(i == 0? "Leader": "Slot "+i);
		button.setStyle("SECONDARY");
		if(data._party[i]) {
			var name = data._party[i];
			let blob = data.getBlob(name);
			button.setEmoji(blobs.getEmoji(blob.type));
		}else var stop = true;
		row.addComponents(button);
		if(stop) break;
	}
	button = new MessageButton;
	button.setCustomId("viewparty");
	button.setLabel("View Party");
	button.setStyle("PRIMARY");
	row.addComponents(button);
	return row;
}
commands.set("blob", async cmd => {
	var string = cmd.options.getString("blobname");
	buttons.get("blobs.viewBlob")(cmd, string);
});
buttons.set("blobs.viewBlob", async (cmd, string) => {
	if(cmd.message) var uid = cmd.message.embeds[0].footer.text;
	else uid = cmd.user.id;
	var data = await userdata.load(uid);
	var blob = data.getBlob(string);
	if(blob) {
		var embed = blobs.statsSheet(blob, uid);
		var row = createPartyRow(data, blob);
		var row2 = new Discord.MessageActionRow;
		var button = new MessageButton;
		button.setCustomId("profile.rename");
		button.setLabel("Rename blob");
		button.setStyle("PRIMARY");
		row2.addComponents(button);
		cmd.reply({embeds: [embed], components: [row, row2]});
	}else{
		txt = `Unable to find a blob with named "${string}}"\nCheck your blobs?`;
		cmd.reply({
			content: txt,
			ephemeral: true
		});
	}
});
function allBlobsButtons(data) {
	var {ceil, min} = Math;
	var rows = [];
	var {blobs} = data;
	var len = blobs.length;
	var m = ceil(len/5);
	for(let i = 0; i < m; i++) {
		let b = 5 * (i + 1);
		b = min(b, len);
		let row = new Discord.MessageActionRow;
		rows.push(row);
		for(let a = i * 5; a < b; a++) {
			let button = new Discord.MessageButton;
			let blob = blobs[a];
			button.setCustomId(`blobs.viewBlob ${blob.name}`);
			button.setLabel(blob.name);
			button.setEmoji(blob.emoji);
			button.setStyle("SECONDARY");
			row.addComponents(button);
		}
	}
	return rows;
}
function partyButtons(data) {
	var {ceil, min} = Math;
	var rows = [];
	var {party: blobs} = data;
	var len = blobs.length;
	var m = Math.ceil(len/5);
	for(let i = 0; i < m; i++) {
		let b = 5 * (i + 1);
		b = min(b, len);
		let row = new Discord.MessageActionRow;
		rows.push(row);
		for(let a = i * 5; a < b; a++) {
			let button = new Discord.MessageButton;
			let blob = blobs[a];
			button.setCustomId(`blobs.viewBlob ${blob.name}`);
			button.setLabel(blob.name);
			button.setEmoji(blob.emoji);
			button.setStyle("SECONDARY");
			row.addComponents(button);
		}
	}
	return rows;
}
commands.set("blobs", async cmd => {
	var data = await userdata.load(cmd.user);
	var user = cmd.user;
	// if(cmd.isButton()) {
	// 	var int = cmd.message.interaction;
	// 	if(int) {
	// 		data = await userdata.load(int.user);
	// 		var other = true;
	// 	}
	// }
	var member = cmd.options.get("who");
	if(member) {
		data = await userdata.load(member.user);
		user = member.user;
		var other = true;
	}
	if(data.blobs.length) {
		var embed = blobs.allSheet(data, user.id);
		// var row = createPartyRow(data, blob);
		var rows = allBlobsButtons(data);
		cmd.reply({embeds: [embed], components: rows});
	}else{
		if(other) txt = "They have no blobs!";
		else txt = `You have no blobs!`;
		cmd.reply({
			content: txt,
			ephemeral: true
		});
	}
});
commands.set("party", async cmd => {
	var data = await userdata.load(cmd.user);
	var user = cmd.user.id;
	if(cmd.isButton()) {
		var uid = cmd.message.embeds[0].footer.text;
		user = uid;
		data = await userdata.load(uid);
		var other = true;
	}else
	var member = cmd.options.get("who");
	if(member) {
		data = await userdata.load(member.user);
		user = member.user.id;
		var other = true;
	}
	if(data.party.length) {
		var embed = blobs.partySheet(data, user);
		// var row = createPartyRow(data, blob);
		var rows = partyButtons(data);
		cmd.reply({embeds: [embed], components: rows});
	}else{
		if(other) txt = "Their party is empty";
		else txt = `Your party is empty`;
		cmd.reply({
			content: txt,
			ephemeral: true
		});
	}
});
commands.set("roll", async cmd => {
	var data = await userdata.load(cmd.user);
	if(!data.blobs.length && !data.money) {
		var type = blobs.gacha();
		var blob = new userdata.Blob({type, lvl: 1});
		var arr = blobs.names[type];
		blob.name = arr[Math.floor(Math.random() * arr.length)];
		var embed = blobs.statsSheet(blob, cmd.user.id);
		var row = createPartyRow(data, blob);
		var row2 = new Discord.MessageActionRow;
		var button = new MessageButton;
		button.setCustomId("profile.rename");
		button.setLabel("Rename blob");
		button.setStyle("PRIMARY");
		row2.addComponents(button);
		data.blobs.push(blob);
		userdata.save(cmd.user);
		cmd.reply({content: "First one's on the house bud.", embeds: [embed], components: [row, row2]});
	}else cmd.reply("How do you expect to get a blob with no money?");
});
function battleConfirmButtons() {
	var row = new Discord.MessageActionRow, button;

	button = new Discord.MessageButton;
	button.setCustomId("battle.acceptChallenge");
	button.setStyle("SUCCESS");
	button.setLabel("Accept");
	row.addComponents(button);
	button = new Discord.MessageButton;
	button.setCustomId("battle.declineChallenge");
	button.setStyle("DANGER");
	button.setLabel("Decline");
	row.addComponents(button);

	return row;
}
commands.set("fight", async cmd => {
	var data = await userdata.load(cmd.user);
	var member = cmd.options.get("who").user;
	var other = await userdata.load(member);

	if(!data.party.length) {
		cmd.reply({
			content: "You don't have a party!",
			ephemeral: true
		});
		return;
	}
	if(!other.party.length) {
		cmd.reply({
			content: "They don't have a party!",
			ephemeral: true
		});
		return;
	}
	var embed = blobs.battleSheet(data, other, cmd.user.username, member.username);
	await cmd.reply(`${member}, ${cmd.user} challenges you!`);
	var msg = await cmd.channel.send({
		embeds: [embed],
		components: [battleConfirmButtons()]
	});
	var battle = new Battle.Battle(cmd.user, member, msg);
});
buttons.set("profile.setSlot", async (cmd, id) => {
	var msg = cmd.message;
	var user = cmd.user;
	var name = msg.embeds[0].title;
	var data = await userdata.load(user);
	id = +id;
	var blob = data.getBlob(name);
	var uid = msg.embeds[0].footer.text;
	if(user.id != uid) {
		cmd.reply({
			content: `That's not your blob!`,
			ephemeral: true
		});
		return;
	}
	if(!blob) {
		cmd.reply({
			content: `Couldn't find a blob named "${name}"`,
			ephemeral: true
		});
	}else{
		delete data._party[data._party.indexOf(blob.name)];
		data._party[id] = blob.name;
		data._party = data._party.filter(name => name);
		// var set = new Set(data._party);
		// data._party = [...set];
		await userdata.save(user);
		var rows = cmd.message.components;
		rows[0] = createPartyRow(data, blob);
		cmd.message.edit({components: rows});
		cmd.reply({
			content: id == 0? `Set ${name} as party leader!`: `${name} is now in slot ${id}`,
			ephemeral: true
		});
	}
});
buttons.set("profile.rename", async cmd => {
	var msg = cmd.message;
	var user = cmd.user;
	var id = msg.embeds[0].footer.text;
	if(user.id != id) {
		cmd.reply({
			content: `That's not your blob!`,
			ephemeral: true
		});
		return;
	}
	var name = msg.embeds[0].title;
	var data = await userdata.load(user);
	var blob = data.getBlob(name);
	if(!blob) {
		cmd.reply({
			content: `Couldn't find a blob named "${name}"`,
			ephemeral: true
		});
	}else{
		cmd.reply({
			content: "Type a new name for this blob!",
			ephemeral: true
		});
		/**@param {Discord.Message} msg*/
		async function rec(msg) {
			if(msg.member.user == cmd.user) {
				var name = msg.content;
				bot.off("messageCreate", rec);
				var test = data.getBlob(name);
				if(test && test != blob) msg.editReply({
					content: "Name is taken.",
					ephemeral: true
				});
				else{
					for(let i in data._party) {
						if(data._party[i] == blob.name) {
							data._party[i] = name;
						}
					}
					blob.name = name;
					await userdata.save(cmd.user);
					var embed = cmd.message.embeds[0];
					embed.setTitle(blob.name);
					msg.delete();
					cmd.message.edit({embeds: [embed]});
				}
			}
		}
		bot.on("messageCreate", rec);
		setTimeout(() => {
			bot.off("messageCreate", rec);
		}, 10 * 60 * 1000);
	}
});
buttons.set("viewparty", commands.get("party"));

buttons.set("battle.acceptChallenge", async cmd => {
	var id = cmd.message.id;
	var battle = Battle.battles.get(id);
	if(!battle) {
		cmd.reply({
			content: "This battle was cancelled",
			ephemeral: true
		});
	}else if(battle.started) {
		cmd.reply({
			content: "This battle already started",
			ephemeral: true
		});
	}else if(cmd.user == battle.main) {
		cmd.reply({
			content: "Wait for them to accept!",
			ephemeral: true
		});
	}else if(cmd.user == battle.opp) {
		cmd.reply({
			content: `${cmd.user.username} accepted the challenge!`
		});
		battle.start();
		await delay(1000);
		cmd.deleteReply();
	}else{
		cmd.reply({
			content: "Your not involved in this battle!",
			ephemeral: true
		});
	}
});

var delay = time => new Promise(resolve => setTimeout(resolve, time));
buttons.set("battle.declineChallenge", cmd => {
	var id = cmd.message.id;
	var battle = Battle.battles.get(id);
	if(!battle) {
		cmd.reply({
			content: "This battle is was already cancelled",
			ephemeral: true
		});
	}else if(battle.started) {
		cmd.reply({
			content: "This battle already started",
			ephemeral: true
		});
	}else if(cmd.user == battle.main || cmd.user == battle.opp) {
		battle.delete();
		if(cmd.user == battle.main) {
			cmd.reply(`Battle canceled`);
		}else{
			cmd.reply(`Battle declined`);
		}
	}else{
		cmd.reply({
			content: "Your not involved in this battle!",
			ephemeral: true
		});
	}
});

/**@param {aBattle} battle*/
function battleTargets(battle, str) {
	var row = new Discord.MessageActionRow;
	if(battle.turn.owner == battle.main.id) {
		var party = battle.party2;
	}else party = battle.party;
	for(let blob of party) {
		let button = new MessageButton;
		button.setCustomId(`${str} ${blob.name}`);
		button.setLabel(blob.name);
		button.setStyle("SECONDARY");
		button.setEmoji(blob.emoji);
		if(Math.round(blob.hp) <= 0) {
			button.setDisabled(true);
		}
		row.addComponents(button);
	}
	return row;
}

buttons.set("battle.attack", cmd => {
	var id = cmd.message.id;
	var battle = Battle.battles.get(id);
	if(!battle) {
		cmd.reply({
			content: "This battle is over.",
			ephemeral: true
		});
	// }else if(battle.started) {
	// 	cmd.reply({
	// 		content: "This battle already started",
	// 		ephemeral: true
	// 	});
	}else if(cmd.user == battle.main || cmd.user == battle.opp) {
		if(cmd.user.id == battle.turn.owner && !battle.turn.bot) {
			cmd.reply({
				content: "Who will you attack?",
				components: [battleTargets(battle, "battle.use attack "+id)],
				ephemeral: true
			});
		}else{
			cmd.reply({
				content: "It's not your turn!",
				ephemeral: true
			});
		}
	}else{
		cmd.reply({
			content: "Your not involved in this battle!",
			ephemeral: true
		});
	}
});
buttons.set("battle.use", (cmd, what, id, on) => {
	// var id = cmd.message.id;
	var battle = Battle.battles.get(id);
	if(!battle) {
		cmd.reply({
			content: "The battle already ended!",
			ephemeral: true
		});
	// }else if(battle.started) {
	// 	cmd.reply({
	// 		content: "This battle already started",
	// 		ephemeral: true
	// 	});
	}else if(cmd.user == battle.main || cmd.user == battle.opp) {
		if(cmd.user.id == battle.turn.owner) {
			var text = battle.use(what, on);
			cmd.reply({
				content: text,
				ephemeral: true
			});
		}else{
			cmd.reply({
				content: "It's not your turn!",
				ephemeral: true
			});
		}
	}else{
		cmd.reply({
			content: "Your not involved in this battle!",
			ephemeral: true
		});
	}
});

/**@type {Discord.Guild}*/
var hub;
var ownerid = "563924556910297099";

const userdata = require("./userdata");
const blobs = require("./stats");
const database = require("./database");
if(db) database.key = db.key;
const story = require("./story");
const Battle = require("./battle");
if(aBattle) var aBattle = Battle.Battle;

var blank = "\u200B";

if(User) var {User} = userdata;

(async () => {
	bot.login(await database.get("myLogin"));
	var hubId = await database.get("myHub");
	if(hubId) {
		hub = await bot.guilds.fetch(hubId);
		await hub.emojis.fetch();
		blobs.setHub(hub);
	}
	// console.log(await database.list());
})();
console.log("v1.6");