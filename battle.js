var blobstats = require("./stats");
var {chapters} = require("./story");
var delay = time => new Promise(resolve => setTimeout(resolve, time));
class Battle{
    /**@param {User} member @param {User} user*/
    constructor(user, member, msg, chapter) {
        battles.set(msg.id, this);
        this.main = user;
        this.opp = member;
        this.id = msg.id;
        this.msg = msg;
        if(chapter) {
            this.battleInfo = chapter.battle;
            this.ch = chapters.indexOf(chapter);
        }
    }
    delete() {
        battles.delete(this.id);
    }
    async start() {
        var data = await userdata.load(this.battleInfo? this.opp: this.main);
        var allBlobs = [];
        var party = [];
        var party2 = [];
        var names = new Set;
        if(this.battleInfo) {
            var odat = data;
            data = {party: [...data.party]};
            other = {party: []};
            for(let obj of this.battleInfo.allies) {
                var blob = new dBlob(obj);
                if(odat.getBlob(blob.name)) {
                    blob.name += " {S}";
                }
                blob.bot = true;
                data.party.push(blob);
            }
            for(let obj of this.battleInfo.enemies) {
                do{
                    var blob = new dBlob(obj);
                }while(names.has(blob.name));
                names.add(blob.name);
                blob.bot = true;
                other.party.push(blob);
            }
        }else{
            var other = await userdata.load(this.opp);
        }
        if(this.battleInfo) {
            var od = this.main.id;
            var md = this.opp.id;
        } else {
            var md = this.main.id;
            var od = this.opp.id;
        }
        for(let blob of data.party) {
            blob = new Blob(blob, md);
            party.push(blob);
            allBlobs.push(blob);
        }
        for(let blob of other.party) {
            blob = new Blob(blob, od);
            party2.push(blob);
            allBlobs.push(blob);
        }
        this.allBlobs = allBlobs;
        if(this.battleInfo) {
            this.party = party2;
            this.party2 = party;
        }else{
            this.party = party;
            this.party2 = party2;
        }
        var turn = this.getTurn();
        let change = turn.delay;
        this.allBlobs.forEach(blob => blob.delay -= change);
        this.setTimeline();
        this.log = "Let the battle begin!";
        var embed = this.battleSheet(turn);
        var row = this.buttons(turn);
        this.row = row;
        this.msg.edit({embeds: [embed], components: [row]});

        if(turn.bot) this.doBotTurn(turn);
    }
    getTurn() {
        var {allBlobs} = this;
        allBlobs = [...allBlobs, ...this.events];
        allBlobs = allBlobs.filter(blob => round(blob.hp) > 0).sort((a, b) => a.delay - b.delay);
        // console.log(allBlobs);
        /**@type {Blob}*/
        this.turn = allBlobs[0];
        return this.turn;
    }
    events = [];
    addEvent(delay, func) {
        this.events.push({
            run: func,
            delay,
            hp: 1
        });
    }
    battleSheet(turn) {
        var msg = this.log;
        var embed = new MessageEmbed;
        var a = this.main.username;
        var b = this.opp.username;
        if(this.main.id == turn.owner) username = a;
        else var username = b;
        var {party} = this;
        var {length} = party;
        var {party2} = this;
        var {length: len2} = party2;
        for(let i = 0; i <= length; i++) {
            let blob = party[i];
            let blob2 = party[i - 1];
            embed.addField(i == 0? `${a}'s party`: `(lvl ${blob2.lvl}) (${round(blob2.hp)}/${round(blob2.maxHp)} hp)`, blob? `${blob.emoji} (${blob.name})`: `**VS**`);
        }
        for(let i = 0; i <= len2; i++) {
            let blob = party2[i];
            let blob2 = party2[i - 1];
            embed.addField(i == 0? `${b}'s party`: `(lvl ${blob2.lvl}) (${round(blob2.hp)}/${round(blob2.maxHp)} hp)`, blob? `${blob.emoji} [${blob.name}]`: this.timeline);
        }
        if(this.allDead) {
            this.delete();
            embed.addField(`${username}'s party wins!`, msg);
        }else{
            embed.addField(`It's ${username}'s (${turn.name}'s) turn`, msg);
        }
        return embed;
    }
    async doBotTurn(turn) {
        if(turn.owner == this.main.id) {
            var party = this.party2;
            var enemies = this.party;
        }else{
            party = this.party;
            enemies = this.party2;
        }
        await delay(1000);
        this.botTurn(turn, party, enemies);
    }
    botTurn(blob, enemies, party) {
        enemies = enemies.filter(blob => round(blob.hp) > 0);
        var target = enemies[Math.floor(Math.random() * enemies.length)];
        this.use("attack", target.name);
    }
    use(what, on) {
        if(this.turn.owner == this.main.id) {
            var party = this.party2;
            var party2 = this.party;
            // var name = this.main.username;
        }else{
            party = this.party;
            party2 = this.party2;
            // name = this.opp.username;
        }
        if(what == "attack") {
            var who;
            for(let blob of party) {
                if(blob.name == on) {
                    who = blob;
                    break;
                }
            }
            if(who) {
                if(round(who.hp) <= 0) return "They don't have any hp!";
                var [dmg, ret] = this.turn.attack(who);
                var txt = `${this.turn.name} attacks ${who.name}!`;
                if(dmg) txt += `\n${this.turn.name} hits ${who.name} for ${dmg} damage!`;
                else txt += "\nIt is ineffective!";
                if(ret) txt += `\n${this.turn.name} takes ${dmg} damage in the process!`;
                if(round(who.hp) <= 0) txt += `\n${who.name} has lost it's form!`;
                if(round(this.turn.hp) <= 0) txt += `\n${this.turn.name} has lost it's form!`;
                this.log = `${this.log}\n${txt}`;
                this.nextTurn();
                return "Success!";
            }else return `Couldn't find a blob named "${on}"`;
        }
    }
    nextTurn() {
        var {party, party2} = this;
        var allDead = true;
        for(let blob of party) {
            if(round(blob.hp) > 0) {
                allDead = false;
            }
        }
        if(allDead) {
            this.allDead = true;
            this.winner = this.main.id;
        }else{
            var allDead = true;
            for(let blob of party2) {
                if(round(blob.hp) > 0) {
                    allDead = false;
                }
            }
            if(allDead) {
                this.allDead = true;
                this.winner = this.opp.id;
            }
        }

        let turn = this.getTurn();
        let change = turn.delay;
        this.allBlobs.forEach(blob => blob.delay -= change);
        this.setTimeline();
        let embed = this.battleSheet(turn);
        let row = this.buttons(turn);
        this.row = row;
        this.msg.edit({embeds: [embed], components: [row]});

        if(turn.bot && !allDead) this.doBotTurn(turn);
        if(allDead) this.end();
        else{
            if(turn.bot) this.doBotTurn(turn);
            if(turn.event) turn.run();
        }
    }
    async end() {
        var a = this.main.username;
        var b = this.opp.username;
        if(this.main.id == this.winner) username = a;
        else var username = b;
        if(this.battleInfo && this.winner == this.opp.id) {
            var data = await userdata.load(this.opp);
            var ch = this.ch + 1;
            if(data.story < ch) {
                data.story = ch;
                userdata.save(this.opp);
            }
            var {party, party2} = this;
            var div = 0;
            for(let blob of party2) {
                div += blob.share;
            }
            var xpText = "";
            div = 1/div;
            for(let blob of party2) {//Give xp
                let share = blob.share * div;
                let sxp = round(blob.xp);
                for(let other of party) {
                    blob.xp += 100 * share * (other.share)/(other.share + blob.share);
                }
                xpText += `\n${blob.name} gained ${round(blob.xp) - sxp} xp!`;
            }
            xpText += data.partyLevelup(username);
            await userdata.save(this.opp);
        }
        await this.msg.channel.send(`${username}'s party wins!`);
        if(xpText) this.msg.channel.send(xpText);
    }
    setTimeline() {
        var blobs = [];
        var order = [];
        // var {turn} = this;
        var id = this.main.id;
        for(let blob of this.allBlobs) {
            if(round(blob.hp) > 0) {
                blobs.push({
                    team: blob.owner == id,
                    name: blob.name,
                    emoji: blob.emoji,
                    delay: blob.delay,
                    del: blob.del
                });
            }
        }
        if(blobs.length) for(let i = 0; i < 6; i++) {
            blobs.sort((a, b) => a.delay - b.delay);
            let turn = blobs[0];
            let change = turn.delay;
            blobs.forEach(blob => blob.delay -= change);
            turn.delay = turn.del;
            order.push(turn);
        }
        if(order.length) {
            var txt = "Turns:"
            for(let blob of order) {
                if(blob.team) txt += `\n${blob.emoji} (${blob.name})`;
                else txt += `\n${blob.emoji} [${blob.name}]`;
            }
            this.timeline = txt;
        }
    }
    showSkills(cmd) {
        var {turn} = this;
        var blob = turn;
        var buttons = new MessageActionRow;
        for(let id of blob.skills) {
            let skill = blobstats.skills[id].name;

            var button = new MessageButton;
            button.setCustomId("battle.skill " + id);
            // button.setEmoji(emoji);
            button.setStyle("SECONDARY");
            button.setLabel(skill);
            row.addComponents(button);
        }
        cmd.reply({
            text: `What skill will ${turn.name} use?`,
            components: [buttons],
            ephemeral: true
        });
    }
    useSkill(cmd) {
        cmd.reply({
            text: "Not yet implemented...",
            ephemeral: true
        });
    }
    buttons(who) {
        var row = new MessageActionRow;
        var emoji = who.emoji;
        var button = new MessageButton;
        button.setCustomId("battle.attack");
        button.setEmoji(emoji);
        button.setStyle("SECONDARY");
        button.setLabel("Attack");
        row.addComponents(button);
        if(who.skills.length) {
            button.setCustomId("battle.skills");
            button.setEmoji(emoji);
            button.setStyle("SECONDARY");
            button.setLabel("Attack");
            row.addComponents(button);
        }
        return row;
    }
    started = false;
}
const int = num => ceil(num);
const pen = (a, p) => (p+sqrt(p*p + 4*p*a))*.5;

var {round, floor, ceil} = Math;
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
    } = blobstats.Elements;
    var Blob = class Blob{
        /**@param {dBlob} blob @param {string} owner*/
        constructor(blob, owner) {
            var stats = blob.stats;
            this.blob = blob;
            /**@type {number}*/
            this.maxHp = stats.hp;
            /**@type {number}*/
            this.share = stats.mult * stats.mult;
            this.owner = owner;
            this.lvl = blob.lvl
            this.hp = blob.hp;
            /**@type {number}*/
            this.spd = stats.spd;
            /**@type {number}*/
            this.def = stats.def;
            /**@type {number}*/
            this.atk = stats.atk;
            /**@type {number}*/
            this.pok = stats.pok;
            this.delay = this.del;
            this.name = blob.name;
            this.emoji = blobstats.getEmoji(stats.id).toString();
            /**@type {Symbol[]}*/
            this.ele = stats.ele;
            /**@type {boolean}*/
            this.bot = blob.bot;
        }
        get xp() {return this.blob.xp}
        set xp(amo) {return this.blob.xp = amo}
        attack(blob, melee=1) {
            var hp = round(blob.hp);
            var mh = round(this.hp);

            var a = {atk: this.atk, str: this.str, def: this.def, ele: [...this.ele]};
            var b = {atk: blob.pok, str: blob.str, def: blob.def, ele: [...blob.ele]};

            status(a, b);
            elements(a, b);
            elements(b, a);

            var atk = pen(a.str, a.atk);
            var def = pen(b.str, b.atk);

            var pok = b.atk;
            var res = a.def;

            var dmg = (atk * atk)/(atk + def);
            var pok = (pok * pok)/(pok + res);

            if(dmg) blob.hp -= dmg;
            if(melee) {
                if(pok) this.hp -= pok;
                if(melee == 1 && blob.status['none.braced']) {
                    blob.attack(this, 2);
                }
            }

            this.delay += this.del;
            return [hp - round(blob.hp), mh - round(this.hp)];
            function elements(a, b) {
                var vs = (e, e2) => (a.ele.includes(e) && b.ele.includes(e2));
                //Fire has 20% less defense against Water
                if(vs(FIRE, WATER)) a.def *= 0.8;
                //Water has 20% less attack against Plant
                if(vs(WATER, PLANT)) a.atk *= 0.8;
                //Fire has 20% more attack against Plant
                if(vs(FIRE, PLANT)) a.atk *= 1.2;
                //Water has 20% more strength against Rock
                if(vs(WATER, ROCK)) a.str *= 1.2;
                //Rock has 20% less defense against Plant
                if(vs(ROCK, PLANT)) a.def *= 0.8;
                //Plant has 20% less defense against Rock
                if(vs(PLANT, ROCK)) a.def *= 0.8;
                //Water has 20% less defense against Buzz
                if(vs(WATER, BUZZ)) a.def *= 0.8;
                //Dark has 20% more strength against Light
                if(vs(DARK, LIGHT)) a.str *= 1.2;
                //Light has 20% more attack against Dark
                if(vs(LIGHT, DARK)) a.str *= 1.2;
                //Fire has 20% more attack against Monster
                if(vs(FIRE, MONSTER)) a.atk *= 1.2;
                //Plant has 20% less defense against Monster
                if(vs(PLANT, MONSTER)) a.def *= 0.8;
                //Buzz has 20% more strength against Monster
                if(vs(BUZZ, MONSTER)) a.str *= 1.2;
                //Monster has 20% less defense against Rock
                if(vs(MONSTER, ROCK)) a.def *= 0.8;
            }
            function status(a, b) {
                function effects(a, b) {
                    if(!a.ele.includes(WATER) && a.status.Wet) {
                        if(b.ele.includes(FIRE)) {
                            b.def *= 0.9; //Fire has less defense
                        }
                        if(b.ele.includes(PLANT)) {
                            a.atk *= 0.9; //Water has less attack
                        }
                        if(b.ele.includes(ROCK)) {
                            a.str *= 0.9; //Water has more strength
                        }
                        if(b.ele.includes(BUZZ)) {
                            a.def *= 0.9; //Water has less defense
                        }
                    }
                }
                effects(a, b);
                effects(b, a);
            }
        }
        get del() {
            return 1/this.spd;
        }
    }
}
var {MessageEmbed, MessageActionRow, MessageButton, User} = require("discord.js");
var userdata = require("./userdata");
var blank = "\u200B";
var {Blob: dBlob} = userdata;
/**@type {Map<string, Battle>}*/
var battles = new Map;
module.exports = {battles, Battle};