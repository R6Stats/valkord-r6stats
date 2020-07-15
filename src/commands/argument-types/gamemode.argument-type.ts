import { CommandSignatureArgument, CommandSignatureArgumentType, CommandSignatureArgumentValue } from '@r6stats/valkord'
import { GAMEMODE_MAP } from '../../constants'
import { resolve } from '../../utils/resolvers'

export class CommandSignatureArgumentTypeGamemode extends CommandSignatureArgumentType {
  protected readonly key: string = 'gamemode'

  public parse (index: number, args: string[], arg: CommandSignatureArgument): CommandSignatureArgumentValue | null {
    const input = args[index]?.toLowerCase()

    if (!input) {
      return new CommandSignatureArgumentValue(null, 0, arg)
    }

    const gamemode = resolve(input, GAMEMODE_MAP)

    return new CommandSignatureArgumentValue(gamemode, 1, arg)
  }

}
