import { ShardingManager } from 'discord.js'

const manager = new ShardingManager('./bot')

manager.on('shardCreate', shard => console.log(`- Spawned shard ${shard.id} -`))

manager.spawn(2)

