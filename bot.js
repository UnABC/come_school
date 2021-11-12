const Discord = require('discord.js');
const cron = require('node-cron');
const client = new Discord.Client();

const fetch = require('node-fetch');
const {Readable} = require('stream');
const { VoiceText } = require('voice-text');
const voiceText = new VoiceText('Key');

const get_message = "元気か～？";
const reaction_message = get_message;
const come_school = "学校来いよ～";
const version = "1.2";	
var emoji = ['⭕','❌','🔺','🔻','🟦','❓','⛩️','🇩🇪','☢️','📻','🆘','💻','🗡️','🏘️','🏫','📹','🎥','🇳','🔫'];
var server_members = [ユーザーID]
var help_message = "**コマンド一覧**\n```\ntime\n```日本時間(JPN)とイギリス時間(UTC)を返します。\n```\n翻訳 元の言語 翻訳先の言語 翻訳するテキスト\n```でテキストを翻訳して返します。\n```\njoin\n```読み上げを開始します。\n```\nfuck\n```読み上げを終了します。\n```\nversion\n```バージョンを返します。\n```\nhelp\n```ヘルプを表示します。";
var join_sw = 0;

client.on('ready', () => {
   console.log('ログインしました。');
   cron.schedule('0 0 21 * * *', () => {
     console.log("メッセージを送信しました。");
     client.channels.cache.get('チャンネルID').send(get_message);
   })
});

const bufferToStream = (buffer) => {
	const stream = new Readable();
	stream.push(buffer);
	stream.push(null);
	return stream;
};

client.on('message', async(message) => {
	var message_array = (message.content).split(/\s+/);
    if (message.content === reaction_message) {
        console.log('リアクションを付けます。');
        for (var i = 0;i < emoji.length;i++){
	        message.react(emoji[i])
		      .then(message => console.log("リアクション: :"+emoji[i]+":"))
		      .catch(console.error);
		}
	}else if (message_array[0] === "OKbot"){
		if (message_array[1] === "time"){
			console.log("time");
			var times = new Date();
			var Hour = times.getHours();
			var Minutes = times.getMinutes();
			switch (message_array[2]){
				case "UTC":
					Hour = (Hour <= 9)?Hour+24:Hour;
					Hour -= 9;
					message.channel.send(Hour+"時"+Minutes+"分");
					break;
				case "JPN":
					message.channel.send(Hour+"時"+Minutes+"分");
					break;
				default:
					message.channel.send("Japan:"+Hour+"時"+Minutes+"分");
					Hour = (Hour <= 9)?Hour+24:Hour;
					Hour -= 9;
					message.channel.send("U T C:"+Hour+"時"+Minutes+"分");
			}
		}else if (message_array[1] === "version"){
			message.channel.send("ver "+version);
		}else if (message_array[1] === "翻訳"){
			console.log("翻訳");
			message.channel.startTyping();

			const args = message.content.split(' ').slice(2);

			const source = encodeURIComponent(args.shift());
			const target = encodeURIComponent(args.shift());
			const text = encodeURIComponent(args.join(' '));

			const content = await fetch(`https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=${text}&source=${source}&target=${target}`).then(res => res.text());
			message.channel.stopTyping();
			message.channel.send(content);
		}else if (message_array[1] === "join"){
			 const channel = message.member.voice.channel;
			 // コマンドを実行したメンバーがボイスチャンネルに入ってなければ処理を止める
			 if (!channel) return message.reply('先にボイスチャンネルに参加しろ！');
			 connection = await channel.join();
			 join_sw = 1;
			 message.channel.send("joined!");
		}else if (message_array[1] === "fuck"){
			if (join_sw === 0)return;
			 message.member.voice.channel.leave();
			 join_sw = 0;
		}else if (message_array[1] === "help"){
			 message.channel.send(help_message);
		}
	}else if (message_array[0] === "@someone"){
		var get_random = Math.floor( Math.random() * server_members.length );
		message.channel.send('<@!'+server_members[get_random]+'>'+(message.content).substr(9));
	}else if (join_sw){
		message.channel.awaitMessages(() => true, {max: 1,time: 10*1000}).then(async collected => {
			if (!collected.size) return;
			if (collected.first().content === "OKbot fuck") return;
			console.log('メッセージ: ' + collected.first().content);
			voiceText.fetchBuffer(collected.first().content, { format: 'wav' })
			.then((buffer) => {
				const dispatcher = connection.play(bufferToStream(buffer));
			});
			
		})
	}
});
client.login('トークン');
