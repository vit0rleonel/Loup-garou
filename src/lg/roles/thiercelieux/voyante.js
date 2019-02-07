const send = require("../../message_sending");
const EveryOneVote = require("../../lg_vote").EveryOneVote;
const Villageois = require("../baseRole").Villageois;
const salvateur = require("../nouvelle_lune/salvateur").salvateur;
let RichEmbed = require('discord.js').RichEmbed;

class Voyante extends Villageois {

    constructor(guildMember, gameInfo) {
        super(guildMember, gameInfo);

        this.role = "Voyante";

        return this;
    }

    processRole(configuration) {
        return new Promise((resolve, reject) => {

            this.GameConfiguration = configuration;

            this.getDMChannel().then(dmChannel => {

                return new EveryOneVote(
                    "Choisissez une personne pour voir son rôle",
                    this.GameConfiguration,
                    40000, dmChannel, 1
                ).runVote([this.member.id]);

            }).then(outcome => {

                if (!outcome || outcome.length === 0) {
                    this.dmChannel.send("Ton tour est terminé, tu n'as pas joué ton rôle de voyante").catch(console.error);
                    this.GameConfiguration.channelsHandler.sendMessageToVillage(
                        "La **Voyante** se rendort."
                    ).then(() => resolve(this)).catch(err => reject(err));
                    return;
                } else if (outcome.length === 1) {

                    let target = this.GameConfiguration.getPlayerById(outcome[0]);

                    return this.dmChannel.send(new RichEmbed()
                        .setAuthor(target.member.displayName, target.member.user.avatarURL)
                        .setTitle(target.role)
                        .setColor(target.member.displayColor)
                    );

                }

            }).then(() => resolve(this)).catch(err => reject(err));
        });
    }

}
