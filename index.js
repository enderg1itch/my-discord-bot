const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

const LOG_CHANNEL_ID = '1506663388351037462';

// 🔧 CHANGE THIS NUMBER TO CONTROL WHO GETS LOGGED
// higher number = higher role required
const MIN_ROLE_POSITION = 10;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {

    if (!oldState.channelId && newState.channelId) {

        try {
            const channel = await client.channels.fetch(LOG_CHANNEL_ID);
            if (!channel) return;

            const member = newState.member;
            if (!member || member.user.bot) return;

            // 🔒 ROLE FILTER (only upper roles)
            if (member.roles.highest.position < MIN_ROLE_POSITION) return;

            const embed = new EmbedBuilder()
                .setColor('#a855f7')
                .setTitle('🎙️ Voice Channel Joined')
                .addFields(
                    {
                        name: 'Member',
                        value: `${member}`,
                        inline: true
                    },
                    {
                        name: 'Role',
                        value: member.roles.highest.name,
                        inline: true
                    },
                    {
                        name: 'Channel',
                        value: newState.channel.name,
                        inline: true
                    },
                    {
                        name: 'Server',
                        value: newState.guild.name,
                        inline: false
                    }
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({
                    text: `User ID: ${member.id}`
                });

            channel.send({
                embeds: [embed]
            });

        } catch (err) {
            console.log('Error:', err);
        }
    }
});

client.login(process.env.TOKEN);
