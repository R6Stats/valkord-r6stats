import { ValkordCommand, CommandContext, Injectable } from '@r6stats/valkord'
import { Message, MessageEmbed } from 'discord.js'
import { INVITE_URL, LOGO_URL, PRIMARY_COLOR } from '../constants'

@Injectable()
export class InviteCommand extends ValkordCommand {
  public readonly command = 'invite'
  public readonly name = 'Invite Link'
  public readonly group = 'Other'
  public readonly shortHelp = 'r6s invite'

  public async handle (ctx: CommandContext): Promise<Message | Message[] | void> {
    const embed = new MessageEmbed()
      .setColor(PRIMARY_COLOR)
      .setTitle('R6Stats Bot Invite')
      .setDescription(`Invite the **R6Stats** bot to your server [here](${INVITE_URL}).`)
      .setThumbnail(LOGO_URL)
      .setFooter('Stats Provided by R6Stats.com', LOGO_URL)

    return ctx.reply(embed)
  }
}
