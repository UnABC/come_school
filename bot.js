const Discord = require('discord.js');
const cron = require('node-cron');
const client = new Discord.Client();
const get_message = "<ユーザー名> 生きてるか～？";
const come_school = "早く学校来いよ～～";


client.on('ready', () => {
   console.log('ログインしました。');
   //毎日22時にメッセージを送信する
   cron.schedule('0 0 22 * * *', () => {
     console.log("メッセージを送信しました。");
     client.channels.cache.get('チャンネルID').send(get_message);
   })
});

client.on('message', message => {
    if (message.content === get_message) {
        console.log('リアクションを付けます。');
        message.react('⭕')
	      .then(message => console.log("リアクション: :o:"))
	      .catch(console.error);
       message.react('❌')
	      .then(message => console.log("リアクション: :x:"))
	      .catch(console.error);
	   message.awaitReactions(reaction => reaction.emoji.name, { max: 3 })
          .then(collected => {
              console.log(`${collected.first().users.cache.map(user => user.tag).join(', ')} がリアクションを付けました`);
              message.channel.send(come_school);
          });
    }else if (message.content === come_school){
        console.log('リアクションを付けます。');
        message.react('⭕')
	      .then(message => console.log("リアクション: :o:"))
	      .catch(console.error);
       message.react('❌')
	      .then(message => console.log("リアクション: :x:"))
	      .catch(console.error);
    }
});

client.login('トークン');