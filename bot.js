const tmi = require('tmi.js');
const { config } = require("dotenv")
config({
    path: __dirname + "/.env"
});


const client = new tmi.Client({
	options: { debug: true },
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: process.env.USERNAME,
		password: process.env.TOKENDOM
	},
	channels: [ 'domthenoodle2k' ]
});

client.connect().then(console.log(`Twitch bot alive!`)).catch(err => console.log(err));

client.on('follow', async (channe, user) => {
    client.say(channe, `Thank you for the follow, ${user}!`)
})

client.on('message', async (channel, tags, message, self) => {
	if(self || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

	if(command === 'discord') {
        client.say(channel, `Join the official ${channel.replace('#','')} Discord server to stay up to date with all the noodle news!\nhttps://discord.gg/SKfuGYR`);
    }
    

    if(command === 'uptime') {
        const getUptime = () => {
            let res = require("superagent").get(`https://beta.decapi.me/twitch/uptime/${channel.replace('#','')}`).catch((err) => console.log(err));

            if(!res) return console.log(`No res for uptime`)
            return res
        }
        
        const info = await getUptime()
        if(info.text.includes(`offline`)){
            return client.say(channel, `${info.text}`).catch((err) => console.log(err));
        }else{
            return client.say(channel, `${channel.replace('#', '')} has been streaming for ${info.text}`).catch((err) => console.log(err));
        }

    }

    if(command === 'twitter') {
        client.say(channel, `Here is the official ${channel.replace('#', '')} Twitter account!\nhttps://twitter.com/The_N00DL3`).catch((err) => console.log(err));
    }

    if(command === 'merch'){
        client.say(channel, `Go bag some official Lizzard Gaming merch! https://moteefe.com/lizzard-gaming`).catch(err => console.log(err))
    }

    //!Mod cmds

    if(command === 'clear'){
        if(!tags.badges.broadcaster && !tags.mod) return

        client.clear(channel)
        .then(() => {
        client.say(channel, `${tags.username} cleared chat!`)
        }).catch(err => console.log(err))
    }

    if(command === 'slowmode'){
        if(!tags.badges.broadcaster && !tags.mod) return

        let time = args

        client.slow(channel, time)
        .then(() => {
            client.say(channel, `${tags.username} enabled slowmode!`)
        }).catch(err => console.log(err))
        
    }

    if(command === 'slowmodeoff'){
        if(!tags.badges.broadcaster && !tags.mod) return
        client.slowoff(channel).then(client.say(channel, `${tags.username} disabled slowmode`)).catch(err => console.log(err))
        
    }
    
    if(command === 'ping'){

        if(!tags.badges.broadcaster && !tags.mod) return
        client.ping()
        .then((data) => {
            console.log(data)
            client.say(channel, `PONG! [${data}ms]`)
        }).catch(err => console.log(err))
    }

    

});