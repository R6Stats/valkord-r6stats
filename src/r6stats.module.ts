import { ValkordCommand, ValkordModule, Constructor } from '@r6stats/valkord'
import { HelpCommand, InviteCommand, OperatorStatsCommand, PingCommand, StatsCommand } from './commands'
import { R6StatsModuleConfig } from './r6stats.module-config'
import { RankCommand } from './commands/rank.command'

export class R6StatsModule extends ValkordModule<R6StatsModuleConfig> {
  public getName = (): string => 'R6Stats'

  public getConfig = (): Constructor<R6StatsModuleConfig> => R6StatsModuleConfig

  public getCommands = (): Constructor<ValkordCommand>[] => [
    PingCommand,
    HelpCommand,
    InviteCommand,
    StatsCommand,
    RankCommand,
    OperatorStatsCommand,
  ]
}
