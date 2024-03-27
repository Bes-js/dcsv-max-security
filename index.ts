import { Client, TextChannel, Message, MessageActionRowComponent } from 'discord.js-selfbot-v13';
import { createWorker } from 'tesseract.js';
import { ProxyAgent } from 'proxy-agent';

const tokens: string[] = [""]; // Tokenler
const channelId: string = ""; // Kanal Id
const messageId: string = ""; // DCSV'nin Message Id'si

for (let i = 0; i < tokens.length; i++) {
    try {
        const token = tokens[i];
        const client = new Client({
            http: {
                agent: new ProxyAgent()
            },
            ws: {
                agent: new ProxyAgent()
            },
        });
        client.login(token);
        client.on('ready', async () => {
            await voteVolkanDemirel(client, channelId, messageId);
        });
    } catch (err) {
        console.error((err as Error).message);
    };
};



/**
 * @param {Client} client
 * @param {string} channelId
 * @param {string} messageId
 * @returns {Promise<void>}
 * @example voteVolkanDemirel(client, channelId, messageId);
 * @description Vote Volkan Demirel
 * @name voteVolkanDemirel
 * @type {Promise<void>}
 */
async function voteVolkanDemirel(client: Client, channelId: string, messageId: string): Promise<void> {
    try {
        var channel = await client.channels.fetch(channelId) as TextChannel;
        if (!channel) return;
        var fetchMessage = await channel?.messages?.fetch(messageId) as Message;
        if (!fetchMessage) return;
        var message = fetchMessage;
        var response = await message.clickButton({ X: 0, Y: 0 });
        if (!response) return;
        client.on('messageUpdate', async (oldMessage, newMessage) => {
            if (!oldMessage.flags.has('EPHEMERAL') && !newMessage.flags.has('EPHEMERAL')) return;
            var msg = newMessage;
            if (msg.content !== '' && !msg.content?.includes('8')) {
                await client.authorizeURL(`https://discord.com/oauth2/authorize?client_id=868528396261543936&redirect_uri=https%3A%2F%2Fdiscordsunucu.com%2Fdiscord-callback.php&response_type=code&scope=identify+guilds+email&permissions=17&prompt=none`,
                    {
                        permissions:"17",
                        authorize: true
                    });
                var channel = await client.channels.fetch(channelId) as TextChannel;
                if (!channel) return;
                var fetchMessage = await channel?.messages?.fetch(messageId)
                if (!fetchMessage) return;
                var message = fetchMessage as Message;
                if (!message || message.embeds.length == 0) return;
                var response = await message.clickButton({ X: 0, Y: 0 }) as Message;
                if (!response) return;
            }
            var worker = await createWorker();
            if (!worker) return;
            if (!msg || msg.embeds.length == 0) return;
            var text = await worker.recognize(`${msg.embeds[0].image?.url}`);
            if (!text) return;
            if (!text.data.text.includes('+')) return;
            var result:number = parseInt(text.data.text.split('+')[0]) + parseInt(text.data.text.split('+')[1]);
            var buttonsResponse:MessageActionRowComponent|undefined = msg.components[0].components.find((btn) => btn.type == "BUTTON" && btn.label == result.toString());
            if (!buttonsResponse) return;
            await msg.clickButton(buttonsResponse.customId as string);
        });
    } catch (err) { };

};
