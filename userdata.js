const database = require("./database");
const {base: blobs, getEmoji, names, Elements, create} = require("./stats");
class User{
	/**@type {Blob[]}*/
	blobs = [];
	money = 0;
	items = [];
	story = 0;
	/**@type {string[]}*/
	_party = [];
	get party() {
		/**@type {Blob[]}*/
		var arr = [];
		for(let name of this._party) {
			var blob = this.getBlob(name);
			if(blob) arr.push(blob);
		}
		return arr;
	}
	getBlob(name) {
		name = name.toLowerCase();
		for(let blob of this.blobs) {
			if(blob.name.toLowerCase() == name) return blob;
		}
	}
	partyLevelup(name) {
		var txt = "";
		let mon = 0;
		for(let blob of this.party) {
			let ups = 0;
			while(blob.xp >= 100) {
				blob.xp -= 100;
				++blob.lvl;
				++ups;
				++this.money;
				++mon;
			}
			if(ups == 1) txt += `\n${blob.name} leveled up!`;
			else if(ups) txt += `\n${blob.name} leveled up ${ups} times!`;
		}
		if(mon) txt += `\n${name} got $${mon}`;
		return txt;
	}
}
class Blob{
	constructor({type, name, lvl, hp, xp, skills}) {
		/**@type {string}*/
		this.type = type;
		/**@type {number}*/
		this.lvl = lvl;
		var base = this.base;
		var arr = names[type];
		var nname = arr[Math.floor(Math.random() * arr.length)];
		/**@type {string}*/
		this.name = name || nname;
		this.skills = skills || [];
		/**@type {number}*/
		this.xp = xp || 0;
		if(hp) {
			/**@type {number}*/
			this._hp = hp;
		}
	}
	get eleInfo() {
		var ele = this.base.ele;
		var txt = "";
		for(let sym of ele) {
			for(let line of Elements.buffs[sym]) {
				txt += "\n"+line;
			}
		}
		return txt;
	}
	get elements() {
		return this.base.ele.map(sym => elechart[sym]).join(", ");
	}
	get per() {
		return this.base.per;
	}
	get personality() {
		return perchart[this.per];
	}
	get stats() {return create(this.base, this.lvl)};
	get base() {return blobs[this.type]};
	get hp() {
		if(!isNaN(this._hp)) return this._hp;
		else return this.stats.hp;
	}
	get emoji() {
		return getEmoji(this.type);
	}
}
var perchart = {
	Ki: "Kind",
	En: "Energetic",
	La: "Laid-Back",
	Co: "Cool",
	Ai: "Airheaded",
	St: "Stubborn",
	Ca: "Cautious"
};
var elechart = {
	[Elements.BUZZ]: "Electric",
	[Elements.WATER]: "Water",
	[Elements.FIRE]: "Fire",
	[Elements.DARK]: "Dark",
	[Elements.LIGHT]: "Light",
	[Elements.PLANT]: "Plant",
	[Elements.ROCK]: "Rock",
	[Elements.MONSTER]: "Monster"
}

async function load(user) {
	var userid = "u" + user;
	var userdata = users.get(userid);
	if(!userdata) {
		var base = new User;
		var userdata = await database.get(userid);
		if(userdata) {
			Object.assign(base, userdata);
		}
		userdata = base;
		for(let i in userdata.blobs) {
			userdata.blobs[i] = new Blob(userdata.blobs[i]);
		}
		users.set(userid, userdata);
	}
	return userdata;
}
function save(user) {
	var userid = "u" + user;
	var userdata = users.get(userid);
	return database.set(userid, userdata);
}
/**@type {Map<string, User>}*/
var users = new Map;
module.exports = {
	load, save,
	Blob, users,
	User
};