const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
const bdd = require("./bdd.json");



bot.on("ready", async () => {
    console.log("le bot est allumé")
    bot.user.setStatus("online")
    setTimeout(() => {
        bot.user.setActivity("taper Mathis Sarlin");
    }, 100)
});

bot.on("guildMemberAdd", member => {
    if (bdd["message-bienvenue"]) {
        bot.channels.cache.get('744968725513502810').send(bdd["message-bienvenue "]);
    }
    else {
        bot.channels.cache.get('744968725513502810').send("Bienvenue sur le serveur");
    }

    member.roles.add('745265266291900416');

})

// Commande 
bot.on("message", async message => {

    if (message.author.bot) return;

    if (message.content.startsWith("/clear")) {
        message.delete();
        if (message.member.hasPermission('MANAGE_MESSAGES')) {

            let args = message.content.trim().split(/ +/g);

            if (args[1]) {
                if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99) {

                    message.channel.bulkDelete(args[1])
                    const embedclear = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .addFields(
                            { name: 'Clear : ', value: `vous avez suprimé ${args[1]} message(s)`, inline: false },
                        )

                    message.channel.send(embedclear);
                    message.channel.bulkDelete(1)


                } else {
                    message.channel.send('Le clear doit être compris entre 1 et 99 message(s) !')
                }
            }
            else {
                message.channel.send('Après !clear vous devez renter le nombres entre 1 et 99 !')
            }
        } else {
            message.channel.send('Tu n\'as pas le permission de faire cette commande')
        }
    }
    if (message.content.startsWith("/mb")) {
        message.delete()
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            if (message.content.length > 5) {
                message_bienvenue = message.content.slice(4)
                console.log(message_bienvenue)
                bdd["message-bienvenue"] = message_bienvenue
                Savebdd()
                message.channel.send('Le nouveau message des arrivants est défini')

            }
        }

    }
    if (message.content.startsWith("/warn")) {
        if (message.member.hasPermission('BAN_MEMBERS')) {
            if (!message.mentions.users.first()) return;
            utilisateur = message.mentions.users.first().id

            if (bdd["warn"][utilisateur] == 2) {
                delete bdd["warn"][utilisateur]
                Savebdd()
                message.guild.members.ban(utilisateur)
            }

            else {
                if (!bdd["warn"][utilisateur]) {
                    bdd["warn"][utilisateur] = 1
                    Savebdd();
                    message.channel.send("Tu as pris un warn tu as maintenant " + bdd["warn"][utilisateur] + " warn ");
                }
                else {
                    bdd["warn"][utilisateur]++
                    Savebdd();
                    message.channel.send("Tu as pris un warn tu as maintenant " + bdd["warn"][utilisateur] + " warn ");
                }
            }



        }
    }
    if (message.content.startsWith("/stats")) {
        message.delete();
        let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
        let totalmembers = message.guild.members.cache.size;
        let totalserveurs = bot.guilds.cache.size;
        let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
        let totalhommes = message.guild.roles.cache.get('744976837595234318').members.map(member => member.user.tag).length;
        let totalfemmes = message.guild.roles.cache.get('744977273869959309').members.map(member => member.user.tag).length;
        let onlineplayer = onlines - totalbots

        const embedstats = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Statistiques')
            .setAuthor('Eli')
            .setDescription('Voici les statistiques du serveur et du bot Eli')
            .addFields(
                { name: 'Nombres de membres total', value: totalmembers, inline: true },
                { name: 'Membres connecté', value: onlines, inline: true },
                { name: 'Serveur total (ou je suis(Eli))', value: totalserveurs, inline: true },
                { name: 'Nombres total de bots', value: totalbots, inline: true },
                { name: 'Nombres total d\'hommes', value: totalhommes, inline: true },
                { name: 'Nombres total de femmes', value: totalfemmes, inline: true },
                { name: 'Nombres Total d\'humain Conecté ', value: onlineplayer, inline: true },
            )
            .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqYEpEZfD9ZEmNkrCIxm5kRvYe4H86B1gOTQ&usqp=CAU')
            .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqYEpEZfD9ZEmNkrCIxm5kRvYe4H86B1gOTQ&usqp=CAU')
            .setTimestamp()
            .setFooter('tu est beau', 'https://static.wikia.nocookie.net/tokyoghoul/images/9/98/Faucheur_Noir_-_Anime.jpg/revision/latest?cb=20180625144608&path-prefix=fr');

        message.channel.send(embedstats);

        console.log("Joueurs Onlines : " + onlines + "\nMembres totaux : " + totalmembers + "\nServeur total (où je suis(Eli)) : " + totalserveurs + "\nBots totaux : " + totalbots + "\nTotal de visiteurs : " + totalvisiteurs + "\nTotal Owner : " + totalOwner + "\nTotal de joueurs online (sans les bots) : " + onlineplayer)
    }
    if (message.content.startsWith("/help")) {
        message.delete();
        const embedhelp = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help : ')
            .setAuthor('Commande de Eli')
            .addFields(
                { name: 'Commande pour les stats', value: "!stats", inline: false },
                { name: 'Commande d\'avertissement (warn) : ', value: "!warn @user", inline: false },
                { name: 'Clear de message : ', value: "!clear + nombres de messages à suprimer", inline: false },
                { name: 'Ban : ', value: "/ban + @user + durée en jours + raison (mettre la raison en 1 mots ou séparer les mots par des tirets) ", inline: false }
            )
            .setTimestamp()
            .setFooter('J\'aime bien tokyo ghoul', 'https://cdn.shopify.com/s/files/1/0250/9933/7824/articles/Kaneki-Ken-Featured-Image_1200x1200.jpg?v=1582565944');

        message.channel.send(embedhelp);
    }
    if (message.content.startsWith('/tempban')) {
        message.delete()
        if (message.member.hasPermission('BAN_MEMBERS')) {
            let args = message.content.trim().split(/ +/g);
            let utilisateur = message.mentions.members.first()
            temps = args[2];
            raison = args[3]
            if (!utilisateur) return message.channel.send('Vous devez mentionner un utilisateur !');
            if (!temps || isNaN(temps)) return message.channel.send('Vous devez indiquer un temps en jours !');
            if (!raison) return message.channel.send('Vous devez indiquer une raison du ban !');
            message.guild.members.ban(utilisateur.id);
            setTimeout(function () {
                message.guild.members.unban(utilisateur.id);
            }, temps * 86400000);
            const embedtempban = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .addFields(
                    { name: 'Utilisateur ban : ', value: utilisateur, inline: false },
                    { name: 'Temps (jours) : ', value: temps, inline: false },
                    { name: 'Raison : ', value: raison, inline: false }
                )
                .setTimestamp()
                .setFooter('J\'aime bien tokyo ghoul');

            bot.channels.cache.get('789982269313384538').send(embedtempban)
            const embedtempban2 = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .addFields(
                    { name: 'Utilisateur ban : ', value: utilisateur, inline: false },
                    { name: 'Temps (jours): ', value: temps, inline: false },
                    { name: 'Raison : ', value: raison, inline: false }
                )
                .setTimestamp()
                .setFooter('J\'aime bien tokyo ghoul');

            bot.channels.cache.get('789982269313384538').send(embedtempban2)



        } else {
            return message.reply('Tu n\'as pas les permissions de ban')
        }
    }
    if (message.content.startsWith('/ban')) {
        message.delete()
        if (message.member.hasPermission('BAN_MEMBERS')) {
            let args = message.content.trim().split(/ +/g);
            let utilisateur = message.mentions.members.first()
            raison = args[2]
            if (!utilisateur) return message.channel.send('Vous devez mentionner un utilisateur !');
            if (!raison) return message.channel.send('Vous devez indiquer une raison du ban !');
            message.guild.members.ban(utilisateur.id);
            const embedban = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .addFields(
                    { name: 'Utilisateur ban : ', value: utilisateur, inline: false },
                    { name: 'Raison : ', value: raison, inline: false }
                )
                .setTimestamp()
                .setFooter('J\'aime bien tokyo ghoul');

            bot.channels.cache.get('789982269313384538').send(embedban)



        } else {
            return message.reply('Tu n\'as pas les permissions de ban')
        }
    }
});

    // Musique
    const serverQueue = queue.get(message.guild.id);
    if (message.content.startsWith('/play')) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith('/skip')) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith('/stop')) {
        stop(message, serverQueue);
        return;
    } else if (message.content.startsWith('/pause')) {
        pause(message, serverQueue, args);
        return;
    } else {
        message.channel.send('tu dois entrer une commande valid !')
    }



// logs messages
bot.on('message', message => {
    if (message.author.bot) return
    if (!message.content.startsWith("/")) {
        if (!message.content.startsWith("!")) {
            if (!message.content.startsWith("/ban")) {
                const embedlogmessage = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .addFields(
                        { name: 'Contenu du message :', value: `${message.content}`, inline: false },
                        { name: 'Créé le', value: `${message.createdAt}`, inline: false }
                    )
                    .setTimestamp()
                    .setFooter('J\'aime bien tokyo ghoul', 'https://cdn.shopify.com/s/files/1/0250/9933/7824/articles/Kaneki-Ken-Featured-Image_1200x1200.jpg?v=1582565944');

                bot.channels.cache.get('789513783713464390').send(embedlogmessage)
            }
        }
    }
})

// logs commandes
bot.on('message', message => {
    if (message.content.startsWith("/")) {
        const embedlogcommande = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .addFields(
                { name: 'Contenu de la commande', value: `${message.content}`, inline: false },
                { name: 'Créé le', value: `${message.createdAt}`, inline: false }
            )
            .setTimestamp()
            .setFooter('J\'aime bien tokyo ghoul', 'https://cdn.shopify.com/s/files/1/0250/9933/7824/articles/Kaneki-Ken-Featured-Image_1200x1200.jpg?v=1582565944');

        bot.channels.cache.get('789824823059939389').send(embedlogcommande)
    }
})

// logs MessageUpdates
bot.on('messageUpdate', async (oldMessage, newMessage) => {
    if (!message.content.startsWith("/")) {
        const embedUpdate = new Discord.MessageEmbed()
            .setColor('Couleur')
            .addFields(
                { name: 'Ancien message', value: `${oldMessage.content}` },
                { name: 'Nouveau message', value: `${newMessage.content}` }
            )
            .setTimestamp()
            .setFooter('J\'aime bien tokyo ghoul', 'https://cdn.shopify.com/s/files/1/0250/9933/7824/articles/Kaneki-Ken-Featured-Image_1200x1200.jpg?v=1582565944%27');

        bot.channels.cache.get('789910609789059103').send(embedUpdate)
    }
})

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    })
}

//Fonctions musique
async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music !"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function skip(message, serverQueue, args) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue, args) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function pause(message, serverQueue, args) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (serverQueue.connection.dispatcher.paused) {
        serverQueue.connection.dispatcher.resume();
    } else {
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.pause();
    }
}

function play(guild, song) {
    const serverQueue = queue.get(message.guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
bot.login(process.env.TOKEN);

// Events:

// Ban: guildBanAdd
// Unban: guildBanRemove
// Message envoyé: message
// Message supprimé: messageDelete
// Bulkdelete: messageDeleteBulk
// Message modifié: messageUpdate