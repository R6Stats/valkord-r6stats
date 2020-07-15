import { CommandSignatureArgumentType, CommandSignatureArgumentValue, CommandSignatureArgument } from '@r6stats/valkord'
import { resolve } from '../../utils/resolvers'
import { PLATFORM_MAP } from '../../constants'

export class CommandSignatureArgumentTypePlatform extends CommandSignatureArgumentType {
  protected readonly key: string = 'platform'

  public parse (index: number, args: string[], arg: CommandSignatureArgument): CommandSignatureArgumentValue | null {
    const input = args[index]?.toLowerCase()

    if (!input) {
      return new CommandSignatureArgumentValue(null, 0, arg)
    }

    const platform = resolve(input, PLATFORM_MAP)

    return new CommandSignatureArgumentValue(platform, 1, arg)
  }

}
