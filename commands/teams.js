import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageSelectMenu } from "discord.js";

const options = [
  {
    label: "AGV",
    description: "The AGV Team",
    value: "agv",
  },
  {
    label: "Garduino",
    description: "The Garduino Team",
    value: "garduino",
  },
  {
    label: "Lunar Knights",
    description: "The Lunar Knights (Lunar Robotics) Team",
    value: "lunarknights",
  },
  {
    label: "Sumobots",
    description: "The Sumobot Teams",
    value: "sumobots",
  },
  {
    label: "ARM",
    description: "The Industrial ARM Team",
    value: "arm",
  },
  {
    label: "DAWG",
    description: "The DAWG Team",
    value: "dawg",
  },
  {
    label: "TapeMeasurer",
    description: "The Tape Measure Team",
    value: "tape",
  },
  {
    label: "BOAT",
    description: "The Boat Team",
    value: "boat",
  },
  {
    label: "The Outreach Committee",
    description: "Outreach Committee",
    value: "outreachcommittee",
  },
];

const rolesMap = {
  agv: "AGV Team",
  garduino: "Garduino Team",
  lunarknights: "Lunar Knights Team",
  sumobots: "Sumobot Teams",
  arm: "ARM Team",
  dawg: "DAWG Team",
  tape: "TapeMeasurer Team",
  boat: "BOAT Team",
  outreachcommittee: "Outreach Committee",
};

const rolesSet = new Set(Object.keys(rolesMap));

const Team = {
  builder: new SlashCommandBuilder()
    .setName("teams")
    .setDescription("Join Teams of The Robotics Club.")
    .setDefaultPermission(false),
  channels: ["bot-cmds"],
  roles: ["Members"],
  async execute(interaction) {
    const roles = interaction.guild.roles.cache;

    const memberOptions = options;

    for (const option of memberOptions) {
      const role = roles.find((role) => role.name === rolesMap[option.value]);
      option["default"] = false;
      if (interaction.member.roles.resolve(role.id)) option["default"] = true;
    }

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("team")
        .setPlaceholder("Select teams to join.")
        .setMaxValues(memberOptions.length)
        .addOptions(memberOptions),
    );

    await interaction.reply({
      content: "Select Team(s) to join.",
      components: [row],
      ephemeral: true,
    });
  },
  async onSelect(interaction) {
    const roles = interaction.guild.roles.cache;
    const valueSet = new Set(interaction.values);
    const notSelected = new Set([...rolesSet].filter((x) => !valueSet.has(x)));

    // roles to add
    valueSet.forEach(async (v) => {
      const role = roles.find((role) => role.name === rolesMap[v]);
      await interaction.member.roles.add(role);
    });

    // roles to remove
    notSelected.forEach(async (v) => {
      const role = roles.find((role) => role.name === rolesMap[v]);
      await interaction.member.roles.remove(role);
    });

    await interaction.update({
      content: `You is now part of team(s): ${interaction.values.join(", ")}.`,
      components: [],
      ephemeral: true,
    });
    await interaction.channel.send(
      `**${
        interaction.member.displayName
      }** is now part of team(s): ${interaction.values.join(", ")}.`,
    );
  },
};

export default Team;
