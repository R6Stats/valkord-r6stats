import { ClientCommand, Constructor, ValkordModule } from '@r6stats/valkord'
import { HelpCommand, InviteCommand, OperatorStatsCommand, PingCommand, StatsCommand } from './commands'

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
