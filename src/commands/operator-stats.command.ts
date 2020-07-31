import { CommandContext, CommandSignatureArgumentValue, EmbedField, Injectable, ValkordCommand, MiddlewareContext, ClientException } from '@r6stats/valkord'
import { Message, MessageEmbed } from 'discord.js'
import { LOGO_URL, PRIMARY_COLOR } from '../constants'
import { StatsService } from '../services/stats.service'
import { formatNumber, playtime, dedent } from '../utils/formatting'
import { getPlatformImage } from '../utils/resolvers'

export interface OperatorStatsCommandArguments {
  username: CommandSignatureArgumentValue<string>
  platform: CommandSignatureArgumentValue<string>
  operator: CommandSignatureArgumentValue<string>
}

@Injectable()
export class OperatorStatsCommand extends ValkordCommand {
  public command = 'operator'
  public signature = '<username> <platform:platform> <operator>'
  public readonly name = 'Operator Stats'
  public readonly group = 'Stats'
  public readonly shortHelp = 'r6s stats <username> <platform> <operator>'

  private readonly stats: StatsService

  public constructor (stats: StatsService) {
    super()

    this.stats = stats
  }

  private async resolvePlayer (username: string, platform: string) {
    try {
      const { data: player } = await this.stats.getOperatorStats(username, platform)

      return player
    } catch (e) {
      return null
    }
  }

  public async handle (ctx: CommandContext): Promise<Message | Message[] | void> {
    const { username: { value: username }, platform: { value: platform }, operator: { value: operatorSearch } } = ctx.signature.get<OperatorStatsCommandArguments>()

    const player = await this.resolvePlayer(username, platform)

    if (!player) {
      return ctx.reply(`we couldn't find a player with the username '${username}' on ${platform}!`)
    }

    const operator = player.operators.find(f => f.name.toLowerCase() === operatorSearch.toLowerCase())

    if (!operator) {
      return ctx.reply(`we couldn't find '${operatorSearch}' for ${username}.`)
    }

    const url = `https://r6stats.com/stats/${player.ubisoft_id}/operators`

    const { name, role, ctu, abilities: abilityList, kills, deaths, kd, wins, losses, wl, playtime: timePlayed } = operator

    const about = new EmbedField()
      .name('About')
      .line('Operator', name)
      .line('Role', role)
      .line('CTU', ctu)
      .line('Playtime', playtime(timePlayed, 'days'))
      .build()

    const killsDeaths = new EmbedField()
      .name('Kills/Deaths')
      .line('Kills', formatNumber(kills))
      .line('Deaths', formatNumber(deaths))
      .line('K/D', kd)
      .build()

    const winsLosses = new EmbedField()
      .name('Wins/Losses')
      .line('Wins', formatNumber(wins))
      .line('Losses', formatNumber(losses))
      .line('W/L', wl)
      .build()

    const builder = new EmbedField()
      .name('Abilities')

    for (const ability of abilityList) {
      // @ts-ignore
      builder.line(ability.title, formatNumber(ability.value))
    }

    const abilities = builder.build()

    const embed = new MessageEmbed()
      .setColor(PRIMARY_COLOR)
      .setAuthor(player.username, getPlatformImage(platform), url)
      .setThumbnail(operator.badge_image)
      .setTitle('Player Stats')
      .setDescription(`[View Full Stats for ${player.username}](${url})`)
      .setFooter('Stats Provided by R6Stats.com', LOGO_URL)
      .addFields([about, killsDeaths, winsLosses, abilities])

    return ctx.reply(embed)
  }

  public help (ctx: MiddlewareContext, ex: ClientException): Promise<void | Message | Message[]> {
    const embed = new MessageEmbed()
      .setColor(PRIMARY_COLOR)
      .setDescription(dedent`
        **Find a Player's Operator Stats**
        \`\`\`r6s operator <username> <platform> <operator>\`\`\`
        **username**: player username, use quotes around names with spaces
        **platform**: pc, xbox or ps4
        **operator**: the name of the operator

        \n**Examples:**
        \`\`\`
        r6s operator KingGeorge pc Ela
        r6s operator MacieJay pc Lion
        \`\`\`
      `)
      .setFooter('Stats Provided by R6Stats.com', LOGO_URL)

    // if (ex instanceof MissingArgumentException) {
    //   return ctx.reply({ embed, content: `specify the ${ex.argument}!` })
    // }

    return ctx.reply({ embed })
  }
}
