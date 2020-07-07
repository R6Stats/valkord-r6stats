# valkord-r6stats

[![Discord](https://discordapp.com/api/guilds/293848587391991836/embed.png)](https://discord.gg/pUdraS3)
[![David](https://img.shields.io/david/r6stats/valkord-r6stats)](https://david-dm.org/r6stats/valkord-discord)
[![David](https://img.shields.io/david/peer/r6stats/valkord-r6stats)](https://david-dm.org/r6stats/valkord-discord)

An [R6Stats](https://r6stats.com) module for the [Valkord](https://github.com/R6Stats/valkord-discord) framework, adding commands focused on Rainbow Six: Siege stats.

## Installing

To use the R6Stats Valkord module in your bot, install it with npm and then load it using Valkord's module loader.

```bash
npm install @r6stats/valkord-r6stats
```

```ts
import { ValkordClient, ValkordFactory } from '@r6stats/valkord'
import R6StatsModule from '@r6stats/valkord-discord'

export class MyClient extends ValkordClient {

}

const run = async () => {
  // instatiate the client from the Container
  const client = await ValkordFactory.create<MyClient>(MyClient)

  // load any modules of your choosing
  const loader = client.getModuleLoader()
  loader.load(R6StatsModule)

  // connect!
  await client.connect()
}

run()

```
