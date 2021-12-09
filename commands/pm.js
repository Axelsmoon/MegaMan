import { SlashCommandBuilder } from '@discordjs/builders'

const Pm = {
  builder: new SlashCommandBuilder()
    .setName('pm')
    .setDescription('Add or remove members from the PM Committee.')
    .addSubcommand(subcommand =>
      subcommand.setName('add').setDescription('Add a member.')
        .addUserOption(option => 
          option.setName('user')
            .setDescription('User to add.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand.setName('remove').setDescription('Remove a member.')
        .addUserOption(option => 
          option.setName('user')
            .setDescription('User to remove.')
            .setRequired(true)
        )
    ),
  channels: ['pm-committee'],
  members: ['539252421961187358'], // Kate Majewski
  async execute(interaction) {
    await interaction.deferReply()

    const target = interaction.options.getMember('user')
    const role = await interaction.guild.roles.cache.find(role => role.name === 'PM Committee')

    switch(interaction.options.getSubcommand()) {
    case 'add': {
      await target.roles.add(role)
      await interaction.editReply(`${target.nickname} has been added to the PM Committee.`)
      break
    }
    case 'remove': {
      await target.roles.remove(role)
      await interaction.editReply(`${target.nickname} has been removed from the PM Committee.`)
      break
    }
    default:
      await interaction.editReply({ content: 'Invalid subcommand.', ephemeral: true })
    }
  }
}

export default Pm
