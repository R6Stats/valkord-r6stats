import { Constructor, ValkordCommand, ValkordModule, CommandSignatureArgumentType } from '@r6stats/valkord'
import { HelpCommand, InviteCommand, OperatorStatsCommand, PingCommand, StatsCommand } from './commands'
import { RankCommand } from './commands/rank.command'
import { R6StatsModuleConfig } from './r6stats.module-config'
import { CommandSignatureArgumentTypePlatform, CommandSignatureArgumentTypeGamemode } from './commands/argument-types'

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

  public getArgumentTypes = (): Constructor<CommandSignatureArgumentType>[] => [
    CommandSignatureArgumentTypePlatform,
    CommandSignatureArgumentTypeGamemode,
  ]
}
