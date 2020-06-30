import { ValkordClient, ValkordFactory } from '@r6stats/valkord'

export class R6StatsClient extends ValkordClient {

}

export const run = async (): Promise<void> => {
  const client = await ValkordFactory.create(R6StatsClient)

  const modules = client.getModuleLoader()
  modules.load('./modules/r6stats')

  await client.connect()
}

run()
