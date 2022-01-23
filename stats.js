const Elements = {
    WATER: Symbol(),
    FIRE: Symbol(),
    ROCK: Symbol(),
    BUZZ: Symbol(),
    PLANT: Symbol(),
    DARK: Symbol(),
    MONSTER: Symbol(),
    LIGHT: Symbol()
};
{
	let {
		WATER,
		FIRE,
		ROCK,
		BUZZ,
		PLANT,
		DARK,
		MONSTER,
		LIGHT
	} = Elements;
	var buffs = {
		[WATER]: [
			"Water: Ignore 20% of Fire defense",
			"Water: 20% more strength against Rock"
		],
		[FIRE]: [
			"Fire: 20% more damage to Plant",
			"Fire: 20% more damage to Monster"
		],
		[ROCK]: [
			"Rock: Ignore 20% of Plant defense"
		],
		[BUZZ]: [
			"Electric: Ignore 20% Water defense",
			"Electric: 20% more strength against Monster"
		],
		[PLANT]: [
			"Plant: Take 20% less Water damage",
			"Plant: Ignore 20% of Rock defense"
		],
		[LIGHT]: [
			"Light: Ignore 20% Dark defense"
		],
		[DARK]: [
			"Dark: 20% more strength against Light"
		],
		[MONSTER]: [
			"Monster: 20% more damage to Plant"
		]
	};
    var skills = {
        "none.charge": "Wait, then attack for extra damage"
    };
	var names = {
		none: ["Bob", "Carl", "Luke", "John", "Sue", "Mia", "Lisa", "Mark"],
		water: ["Drink", "Drip", "Drop", "Liquid", "H-Two", "Puddle", "River", "Levi"],
		fire: ["Flame", "Hot", "Burner", "Sun", "Energy", "Sunny", "Heat", "Warmth"],
		rock: ["Rocky", "Andesite", "Stony", "Pebble", "Boulder", "Grant", "Diorite", "Igneous"],
		buzz: ["Buzz", "Static", "Current", "Zap", "Electro", "Power", "Shock", "Watt"],
		tech: ["Skyence", "Electro", "Android", "Robo", "Beep", "Boop", "Robot", "Circuit"],
		plant: ["Grass", "Blade", "Bud", "Flowey", "Bush", "Leaf", "Moss", "Shrub"],
		rose: ["Rose", "Thorn", "Tulip", "Carnation", "Flower", "Flowey", "Petal", "Bud"],
		wood: ["Woody", "Bark", "Stump", "Palm", "Mahogany", "Stickerton", "Birch", "Boreal"],
		torch: ["Torch", "Candle", "Crispy", "Hothead", "Ghost Rider", "Toast", "Burnt", "Pyro"],
		venus: ["Bloom", "Chomp", "Nom", "Hangry", "Hungry", "Piranha", "Bud", "Bloom"],
		dark: ["Night", "Chaos", "Anti", "Venom", "End", "Shadow", "Phobi", "Pulse"],
		monster: ["Omi", "Lark", "Merth", "Aeth", "Luo", "Chob", "Werv", "Yert"],
		light: ["Bright", "Sun", "Lumi", "Flash", "Ray", "Bulb", "Flicker", "Energy"],
		prince: ["Ash", "Flame", "Arthur", "Ray", "Crisp", "Livid", "Engulf", "Burn"]
	};
	Elements.buffs = buffs;
    var base = {
        none: {
            name: "None",
            hp : 21,
            atk: 5,
            def: 5,
            spd: 10,
            pok: 0,
            tier: 0,
            str: 0,
            ele: [],
            per: "La",
            id: "none"
        },
        water: {
            name: "Water",
            hp : 15,
            atk: 4,
            def: 4,
            spd: 15,
            pok: 0,
            tier: 0,
            str: 1,
            per: "Co",
            ele: [WATER],
            id: "water"
        },
        fire: {
            name: "Fire",
            hp : 10,
            atk: 2,
            def: 2,
            spd: 15,
            pok: 5,
            tier: 0,
            str: 5,
            per: "En",
            ele: [FIRE],
            id: "fire"
        },
        rock: {
            name: "Rock",
            hp : 10,
            atk: 6,
            def: 15,
            spd: 5,
            pok: 0,
            str: 3,
            tier: 0,
            per: "St",
            ele: [ROCK],
            id: "rock"
        },
        buzz: {
            name: "Electric",
            hp : 15,
            atk: 2,
            def: 1,
            spd: 20,
            pok: 0,
            str: 10,
            tier: 0,
            per: "En",
            ele: [BUZZ],
            id : "buzz"
        },
        tech: {
            name: "Tech",
            hp : 19.7,
            atk: 5,
            def: 5,
            spd: 10,
            pok: 0,
            str: 0,
            tier: 1,
            per: "Ca",
            ele: [BUZZ, ROCK],
            id : "tech"
        },
        plant: {
            name: "Plant",
            hp : 26,
            atk: 4,
            def: 1,
            spd: 10,
            pok: 0,
            str: 3,
            tier: 0,
            per: "Ki",
            ele: [PLANT],
            id : "plant"
        },
        rose: {//Fire + Plant
            name: "Rose",
            hp : 20,
            atk: 3,
            def: 0,
            spd: 10,
            pok: 3,
            str: 4,
            tier: 1,
            per: "Ai",
            ele: [PLANT],
            id : "rose"
        },
        wood: {//Plant + Rock
            name: "Tree",
            hp : 40,
            atk: 2,
            def: 10,
            spd: 7,
            pok: 0,
            str: 2,
            tier: 1,
            per: "La",
            ele: [PLANT],
            id: "wood"
        },
        torch: {//Wood + Fire
            name: "Torch",
            hp : 17,
            atk: 3,
            def: 10,
            spd: 10,
            pok: 0,
            str: 2,
            tier: 2,
            per: "Ca",
            ele: [PLANT, FIRE],
            id: "torch"
        },
        venus: {//Plant + Monster
            name: "Venus",
            hp : 14,
            atk: 5,
            def: 10,
            spd: 10,
            pok: 0,
            str: 0,
            tier: 1,
            per: "Ai",
            ele: [PLANT, MONSTER],
            id : "venus"
        },
        dark: {
            name: "Dark",
            hp : 20,
            atk: 3,
            def: 2,
            spd: 10,
            pok: 0,
            str: 8,
            tier: 0,
            per: "Co",
            ele: [DARK],
            id : "dark"
        },
        monster: {
            name: "Monster",
            hp : 11,
            atk: 10,
            def: 2,
            spd: 10,
            pok: 0,
            str: 0,
            tier: 1,
            per: "En",
            ele: [MONSTER],
            id : "monster"
        },
        light: {
            name: "Light",
            hp : 13,
            atk: 7,
            def: 0,
            spd: 15,
            pok: 0,
            str: 2,
            tier: 0,
            per: "Ki",
            ele: [LIGHT],
            id : "light"
        },
        prince: {//Fire + None
            name: "Prince",
            hp: 20,
            atk: 5,
            def: 3,
            spd: 10,
            pok: 0,
            str: 1,
            tier: 1,
            per: "Ki",
            ele: [],
            id: "prince"
        }
    };
}

function create(base, lvl) {
    base = {...base};
    var l = lvl - 1;
    var mult = 2 ** (l * .1);
    for(let stat in base) {
		var value = base[stat];
        if(typeof value != "number") continue;
        base[stat] = value * mult;
    }
    base.lvl = lvl;
    base.mult = mult;
    return base;
}
var {MessageEmbed, Guild} = require("discord.js");
if(Blob) var {Blob, User} = require("./userdata");
/**@param {Blob} blob*/
function statsSheet(blob, id) {
	var embed = new MessageEmbed;
	var blobStats = blob.stats;
	// hub
	var emo = getImage(blobStats.id);
	embed.setTitle(blob.name);
	embed.setThumbnail(emo);
	embed.addField(blobStats.name + ` (lvl ${blob.lvl})`, stats(blob, blobStats));
	embed.setFooter(id);
	return embed;
}
/**@param {User} data*/
function partySheet(data, id) {
	var embed = new MessageEmbed;
	var {party} = data;
	var {length} = party;
	for(let i = 0; i < length; i++) {
		let blob = party[i];
		let blobStats = blob.stats;
		embed.addField(i == 0? "Party Leader": "Slot "+i, blob.name + ` (lvl ${blob.lvl})`);
		embed.addField(getEmoji(blobStats.id).toString(), stats(blob, blobStats));
	}
	embed.setFooter(id);
	return embed;
}
/**@param {User} data*/
function battleSheet(data, other, a, b) {
	var embed = new MessageEmbed;
	var {party} = data;
	var {length} = party;
	var {party: party2} = other;
	var {length: len2} = party2;
	for(let i = 0; i <= length; i++) {
		let blob = party[i];
		let blob2 = party[i - 1];
		let blobStats, blobStat2;
		if(blob)  blobStats = blob.stats;
		if(blob2) blobStat2 = blob2.stats;
		embed.addField(i == 0? `${a} vs ${b}`: blob2.name + ` (lvl ${blob2.lvl}) (${round(blob2.hp)}/${round(blobStat2.hp)} hp)`, blobStats? getEmoji(blobStats.id).toString(): "**VS**");
	}
	for(let i = 0; i < len2; i++) {
		let blob = party2[i];
		let blobStats = create(base[blob.type],  blob.lvl);
		embed.addField(getEmoji(blobStats.id).toString(), "**"+blob.name + ` (lvl ${blob.lvl}) (${round(blob.hp)}/${round(blobStats.hp)} hp)**`);
	}
	return embed;
}
/**@param {User} data*/
function allSheet(data, id) {
	var embed = new MessageEmbed;
	var {blobs} = data;
	var {length} = blobs;
	for(let i = 0; i < length; i++) {
		let blob = blobs[i];
		let blobStats = blob.stats;
		embed.addField(blob.name + ` (lvl ${blob.lvl})`, getEmoji(blobStats.id).toString());
	}
	embed.setFooter(id);
	return embed;
}
var int = Math.ceil;
function stats(blob, blobStats) {
	var stats = "";
	stats += `Experience: ${round(blob.xp)}/100 xp\n`
	// stats += `Health: ${round(blob.hp)}/${round(blobStats.hp)} hp\n`;
	stats += `Health: ${round(blobStats.hp)} hp\n`;
	stats += `Attack: ${round(blobStats.atk)} dmg\n`;
	stats += `Thorns: ${round(blobStats.pok)} dmg\n`;
	stats += `Strength: ${round(blobStats.str)} def\n`;
	stats += `Defense: ${round(blobStats.def)} def\n`;
	stats += `Speed: ${round(blobStats.spd)} spd\n`;
	var ele = blob.elements;
	if(ele) {
		stats += `Elements: ${ele}\n`;
		stats += blob.eleInfo;
	}
	return stats
};

var blank = "\u200B";

function getImage(id) {
	if(id in base) var url = base[id].url;
	if(!url) {
		url = hub.emojis.cache.find(emoji => emoji.name == id).url;
		if(id in base) base[id].url = url;
	}
	return url;
}
function getEmoji(id) {
	return hub.emojis.cache.find(emoji =>
		emoji.name == id
	);
}
function chanceToLose(a, b) {
	a = a.mult * a.mult;
	b = b.mult * b.mult;
	return b/(a + b);
}
var {floor, random, round} = Math;
function gacha() {
	var arr = [];
	for(let id in base) {
		var blob = base[id];
		if(blob.tier == 0) {
			arr.push(id);
		}
	}
	return arr[floor(random() * arr.length)];
}
/**@type {Guild}*/
var hub;

module.exports = {base, names, create, getImage, Elements, getEmoji, allSheet, battleSheet, partySheet, statsSheet, gacha, setHub(h) {hub = h}};