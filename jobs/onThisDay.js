import axios from 'axios'
// import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js' // for future use
import { MessageEmbed } from 'discord.js'

const urlTemplate = 'https://byabbe.se/on-this-day/MONTH/DAY/events.json'

const OnThisDay = {
  cronPattern: '0 12 * * *', // every day at 12:00
  channel: 'random',
  async execute(channel) {
    const d = new Date()
    const url = urlTemplate.replace('MONTH', d.getUTCMonth() + 1).replace('DAY', d.getUTCDate())
    const res = await axios.get(url)
  
    if (res.status !== 200) {
      console.error('Error getting on this day.')
      return
    }
  
    // select random event from list
    const event = res.data.events[Math.floor(Math.random() * res.data.events.length)]

    const onThisDayEmbed = new MessageEmbed()
      .setColor('#4990E2')
      .setTitle(`${d.getUTCMonth() + 1}/${d.getUTCDate()}/${event.year}`)
      .setAuthor('On This Day')
      .setThumbnail('https://i.imgur.com/udziL5c.png')
      .setDescription(`${event.description}\n\n**Wikipedia Links:**`)
      .setTimestamp()

    for (const wiki of event.wikipedia)
      onThisDayEmbed.addField(wiki.title, `[Wiki](${wiki.wikipedia})`, true)

    // future use if normal message sends allow buttons
    /*
    const links = new MessageActionRow()
    for (const wiki of event.wikipedia) {
      links.addComponents(
        new MessageButton()
          .setCustomId(wiki.title)
          .setLabel(wiki.title)
          .setStyle('LINK'),
      )
    }
    */

    channel.send({ embeds: [onThisDayEmbed] })
  }
}

export default OnThisDay