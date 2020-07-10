import R6StatsAPI, { GenericStatsResponse, OperatorStatsResponse, SeasonalStatsResponse, APIResponse } from '@r6stats/node'
import { OnModuleBoot, Injectable } from '@r6stats/valkord'
import { R6StatsModuleConfig } from '../r6stats.module-config'
import { Platform } from '@r6stats/node/lib/types/stats/meta.type'

@Injectable()
export class StatsService implements OnModuleBoot {
  private readonly config: R6StatsModuleConfig
  private client: R6StatsAPI

  public constructor (config: R6StatsModuleConfig) {
    this.config = config
  }

  public boot (): void {
    const apiKey = this.config.get('r6stats_token')

    const api = new R6StatsAPI({ apiKey })

    this.client = api
  }

  public async getStats (username: string, platform: string): Promise<APIResponse<GenericStatsResponse>> {
    return this.client.playerStats(username, platform as Platform)
  }

  public async getOperatorStats (username: string, platform: string): Promise<APIResponse<OperatorStatsResponse>> {
    return this.client.operatorStats(username, platform as Platform)
  }

  public async getSeasonalStats (username: string, platform: string): Promise<APIResponse<SeasonalStatsResponse>> {
    return this.client.seasonalStats(username, platform as Platform)
  }
}
