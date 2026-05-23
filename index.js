const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

const LOG_CHANNEL_ID = '1506663388351037462';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {

    // Trigger when user joins ANY voice or stage channel
    if (!oldState.channelId && newState.channelId) {

        try {
            const channel = await client.channels.fetch(LOG_CHANNEL_ID);
            if (!channel) return;

            const member = newState.member;
            if (!member || member.user.bot) return;

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
                    }
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            channel.send({
                content: '@everyone',
                embeds: [embed]
            });

        } catch (err) {
            console.log('Error:', err);
        }
    }
});

client.login(process.env.TOKEN);
