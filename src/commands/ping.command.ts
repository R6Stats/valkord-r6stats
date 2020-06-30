import { ClientCommand, CommandContext, Injectable } from '@r6stats/valkord'
import { Message } from 'discord.js'

@Injectable()
export class PingCommand extends ClientCommand {
  public readonly command = 'ping'
  public readonly name = 'Ping'
  public readonly group = 'Other'
  public readonly shortHelp = 'r6s ping'

  public async handle (ctx: CommandContext): Promise<Message | Message[] | void> {
    return ctx.reply('Pong!')
  }
}
