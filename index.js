const {
    Client,
    GatewayIntentBits,
    EmbedBuilder
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = 'MTQ1NjE4ODk3NTAzNDEzODcwNw.GC_G3R.5uAqOU5NzHyi1sZK9Fmao68RK_lAXTgv_QA3DM';

const LOG_CHANNEL_ID = '1506663388351037462';
const WATCH_VC_ID = '1498273935685582889';

client.on('voiceStateUpdate', async (oldState, newState) => {

    if (!oldState.channelId && newState.channelId === WATCH_VC_ID) {

        const channel = await client.channels.fetch(LOG_CHANNEL_ID);
        const member = newState.member;

        if (member.user.bot) return;

        const embed = new EmbedBuilder()
            .setColor('#a855f7')
            .setTitle('🎙️ Member Joined Voice Channel')
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
            .setFooter({
                text: `User ID: ${member.id}`
            })
            .setTimestamp();

        channel.send({
            content: '@everyone',
            embeds: [embed]
        });
    }
});

client.login(TOKEN);