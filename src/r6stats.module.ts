import { ValkordModule, Constructor, ClientCommand } from '@r6stats/valkord'
import { PingCommand, HelpCommand, InviteCommand, StatsCommand, OperatorStatsCommand } from './commands'

export class R6StatsModule extends ValkordModule {
  public getName = (): string => 'R6Stats'

  public getCommands = (): Constructor<ClientCommand>[] => [
    PingCommand,
    HelpCommand,
    InviteCommand,
    StatsCommand,
    OperatorStatsCommand,
  ]
}
