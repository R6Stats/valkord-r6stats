import { Injectable, ValkordCommand, CommandContext, CommandSignatureArgumentValue, EmbedField } from '@r6stats/valkord'
import { Message, MessageEmbed } from 'discord.js'
import { StatsService } from '../services/stats.service'
import { SeasonalStatsResponse, SeasonalStat, SeasonRegionStat } from '@r6stats/node'
import { formatNumber, round } from '../utils/formatting'
import { getPlatformImage } from '../utils/resolvers'
import { LOGO_URL, REACT_FORWARD, REACT_BACK, REACT_ASIA, REACT_AMERICA, REACT_EUROPE } from '../constants'

export interface RankCommandArguments {
  username: CommandSignatureArgumentValue<string>
  platform: CommandSignatureArgumentValue<string>
  season: CommandSignatureArgumentValue<string>
}

@Injectable()
export class RankCommand extends ValkordCommand {
  public command = 'rank'
  public aliases = ['season']
  public signature = '<username> <platform> {season}'

  private readonly stats: StatsService

  public constructor (stats: StatsService) {
    super()

    this.stats = stats
  }

  private async getStats (username: string, platform: string) {
    try {
      const { data: player } = await this.stats.getSeasonalStats(username, platform)
      return player
    } catch (e) {
      return null
    }
  }

  private async react (message: Message, ...emojis: string[]) {
    const reactable = emojis.filter(e => !!e)

    for (const emoji of reactable) {
      await message.react(emoji)
    }
  }

  private hasNextSeason (current: number, seasons: SeasonalStat[]): boolean {
    return current < seasons[0].season
  }

  private hasPreviousSeason (current: number, seasons: SeasonalStat[]): boolean {
    return current > seasons[seasons.length - 1].season
  }

  private getAllEmojis (regional: string[], nextSeason: boolean, previousSeason: boolean) {
    const copied = []

    if (nextSeason) copied.push(REACT_BACK)

    copied.push(...regional)

    if (previousSeason) copied.push(REACT_FORWARD)

    return copied
  }

  private hasManagePermission (message: Message): boolean {
    if (message.channel.type === 'dm') return false

    const guildPermissions = message.guild.me.permissions
    const hasGuildPermission = guildPermissions ? guildPermissions.has('MANAGE_MESSAGES') : false

    const channelPermissions = message.channel.permissionsFor(message.guild.me)
    const hasChannelPermission = channelPermissions ? channelPermissions.has('MANAGE_MESSAGES') : false

    return hasChannelPermission || hasGuildPermission
  }

  public async handle (ctx: CommandContext): Promise<void | Message | Message[]> {
    const { username: { value: username }, platform: { value: platform }, season: { value: season } } = ctx.signature.get<RankCommandArguments>()

    const player = await this.getStats(username, platform)

    if (!player) {
      return ctx.reply(`Player '${username}' not found on ${platform}!`)
    } else if (player.seasons.length === 0) {
      return ctx.reply(`No seasonal stats found for ${username}!`)
    }

    const canManage = this.hasManagePermission(ctx.message)

    const seasonId = season ? parseInt(season) : player.seasons[0].season

    const mappedSeasons = new Map<number, Map<string, MessageEmbed>>()

    for (const season of player.seasons) {
      const embeds = this.createEmbedsForSeason(player, season)

      const mappedRegions = new Map<string, MessageEmbed>()

      for (const region in embeds) {
        mappedRegions.set(region, embeds[region])
      }

      mappedSeasons.set(season.season, mappedRegions)
    }

    const embeds = mappedSeasons.get(seasonId)

    const first = Array.from(embeds.keys())[0]

    const currentSeason = seasonId

    const embed = embeds.get(first)

    const msg = await ctx.message.channel.send({ embed })

    const emojis = this.getEmojisForSeason(embeds, first)
    const hasNextSeason = this.hasNextSeason(currentSeason, player.seasons)
    const hasPrevSeason = this.hasPreviousSeason(currentSeason, player.seasons)
    const reacts = this.getAllEmojis(emojis, hasNextSeason, hasPrevSeason)

    await this.react(msg, ...reacts)

    await this.createcollector(msg, ctx.message, currentSeason, player, mappedSeasons, canManage)
  }

  private async createcollector (message: Message, original: Message, currentSeason: number, player: SeasonalStatsResponse, seasons: Map<number, Map<string, MessageEmbed>>, canManage: boolean, ) {
    const reactionCollector = message.createReactionCollector((react, user) => user.id === original.author.id, { max: 100, time: 60 * 1000 })

    reactionCollector.on('collect', async (react, collector) => {
      const REVERSE_MAP = { [REACT_EUROPE]: 'emea', [REACT_ASIA]: 'apac', [REACT_AMERICA]: 'ncsa' }

      if (react.emoji.name === REACT_FORWARD || react.emoji.name === REACT_BACK) {
        currentSeason = currentSeason + (react.emoji.name === REACT_FORWARD ? -1 : 1)

        const hasNextSeason = this.hasNextSeason(currentSeason, player.seasons)
        const hasPrevSeason = this.hasPreviousSeason(currentSeason, player.seasons)

        const seasonEmbeds = seasons.get(currentSeason)
        const region = Array.from(seasonEmbeds.keys())[0]
        const embed = seasonEmbeds.get(region)

        const emojis = this.getEmojisForSeason(seasonEmbeds, region)
        const reacts = this.getAllEmojis(emojis, hasNextSeason, hasPrevSeason)

        if (canManage) {
          await message.edit({ embed })
          await message.reactions.removeAll()
        } else {
          await message.delete()
          message = await original.channel.send({ embed })
          this.createcollector(message, original, currentSeason, player, seasons, canManage)
        }

        await this.react(message, ...reacts)
      } else if (REVERSE_MAP.hasOwnProperty(react.emoji.name)) {
        react.users.remove(original.author)
        const region = REVERSE_MAP[react.emoji.name]
        const seasonEmbeds = seasons.get(currentSeason)

        if (seasonEmbeds.has(region)) {
          const hasNextSeason = this.hasNextSeason(currentSeason, player.seasons)
          const hasPrevSeason = this.hasPreviousSeason(currentSeason, player.seasons)

          const embed = seasonEmbeds.get(region)
          const emojis = this.getEmojisForSeason(seasonEmbeds, region)
          const reacts = this.getAllEmojis(emojis, hasNextSeason, hasPrevSeason)

          if (canManage) {
            await message.edit({ embed })
            await message.reactions.removeAll()
          } else {
            await message.delete()
            message = await original.channel.send({ embed })
            this.createcollector(message, original, currentSeason, player, seasons, canManage)
          }

          await this.react(message, ...reacts)
        }
      }
    })

    reactionCollector.on('end', async () => {
      if (canManage) {
        message.reactions.removeAll()
      } else {
        const reacts = message.reactions.cache.filter(r => r.users.cache.has(message.author.id))

        for (const react of Array.from(reacts.values())) {
          await react.users.remove(message.author.id)
        }
      }
    })
  }

  public getEmojisForSeason (regions: Map<string, MessageEmbed>, active: string): string[] {
    const EMOJI_MAP = { emea: REACT_EUROPE, apac: REACT_ASIA, ncsa: REACT_AMERICA }

    const keys = Array.from(regions.keys())

    if (keys.length === 1) {
      return []
    }

    const enabled = keys.filter(k => regions.has(k) && active !== k)

    const emojis = []

    for (const key of enabled) {
      emojis.push(EMOJI_MAP[key])
    }

    return emojis
  }

  public createEmbedsForSeason (player: SeasonalStatsResponse, season: SeasonalStat): { [key: string]: MessageEmbed } {
    const isGlobalSeason = season.season >= 18
    const regions = Object.values(season.regions).map(r => r[0])

    if (isGlobalSeason) {
      const embed = this.createEmbedForRegion(player, season, regions[0])

      return { global: embed }
    }

    const embeds = {}

    const sortedRegions = regions.filter(r => r.wins + r.losses > 0).sort((a, b) => b.mmr - a.mmr)
    const usableRegions = sortedRegions.length > 0 ? sortedRegions : [regions[0]]

    for (const region of usableRegions) {
      embeds[region.region] = this.createEmbedForRegion(player, season, region)
    }

    return embeds
  }

  public createEmbedForRegion (player: SeasonalStatsResponse, season: SeasonalStat, region: SeasonRegionStat): MessageEmbed {
    const isGlobalSeason = season.season >= 18
    const seasonRank = season.ranks[region.rank]
    const rankName = seasonRank.champions ? `Champions #${region.champions_rank_position}` : seasonRank.name
    const path = seasonRank.path
    const rankUrl = `https://cdn.r6stats.com/seasons/rank-imgs/${path.replace('svg', 'png')}`
    const statsUrl = `https://r6stats.com/stats/${player.ubisoft_id}/seasons`

    const rank = new EmbedField()
      .name('Rank')
      .line('Current Rank', rankName)
      .line('Current MMR', formatNumber(region.mmr))
      .line('Max MMR', formatNumber(region.max_mmr))
      .line('Skill', `${round(region.skill_mean)} ± ${round(region.skill_standard_deviation)}`)
      .build()

    const progress = new EmbedField()
      .name('Progress')
      .line('Previous Rank MMR', formatNumber(region.prev_rank_mmr))
      .line('Current MMR', formatNumber(region.mmr))
      .line('Next Rank MMR', formatNumber(region.next_rank_mmr))
      .build()

    const matches = new EmbedField()
      .name('Matches')
      .line('Wins', formatNumber(region.wins))
      .line('Losses', formatNumber(region.losses))
      .line('W/L', region.losses > 0 ? round(region.wins / region.losses) : 'n/a')
      .line('Abandons', formatNumber(region.abandons))
      .build()

    const killsDeaths = new EmbedField()
      .name('Kills/Deaths')
      .line('Kills', formatNumber(region.kills))
      .line('Deaths', formatNumber(region.deaths))
      .line('K/D', region.deaths > 0 ? round(region.kills / region.deaths) : 'n/a')
      .build()

    const regionMap = { ncsa: 'America', emea: 'Europe', apac: 'Asia' }

    const title = isGlobalSeason ? `Operation ${season.name} Stats for ${player.username}` : `Operation ${season.name} Stats for ${player.username} in ${regionMap[region.region]}`

    const embed = new MessageEmbed()
      .setTitle(title)
      .setColor(season.primary_color)
      .setAuthor(player.username, getPlatformImage(player.platform), statsUrl)
      .setDescription(`[View Full Stats for ${player.username}](${statsUrl})`)
      .setThumbnail(rankUrl)
      .addFields([rank, progress, matches, killsDeaths])
      .setFooter('Stats Provided by R6Stats.com', LOGO_URL)

    return embed
  }
}
