import { Gamemode, OperatorRole, Platform, Region } from '.'
import { Resolvable } from '../utils/resolvers'

export const OPERATOR_ROLE_MAP: Resolvable<OperatorRole> = [
  {
    value: 'atk',
    aliases: ['atk', 'attack', 'attacker'],
  },
  {
    value: 'def',
    aliases: ['def', 'defense', 'defender', 'defend'],
  },
  {
    value: 'recruit',
    aliases: ['recruit'],
  },
]

export const GAMEMODE_MAP: Resolvable<Gamemode> = [
  {
    value: 'general',
    aliases: ['overall', 'general'],
  },
  {
    value: 'ranked',
    aliases: ['ranked'],
  },
  {
    value: 'casual',
    aliases: ['casual'],
  },
]

export const PLATFORM_MAP: Resolvable<Platform> = [
  {
    value: 'pc',
    aliases: ['pc']
  },
  {
    value: 'xbox',
    aliases: ['xbox', 'xone'],
  },
  {
    value: 'ps4',
    aliases: ['ps4', 'playstation'],
  },
]

export const REGION_MAP: Resolvable<Region> = [
  {
    value: 'ncsa',
    aliases: ['ncsa', 'america', 'americas'],
  },
  {
    value: 'emea',
    aliases: ['emea', 'europe', 'africa'],
  },
  {
    value: 'apac',
    aliases: ['apac', 'asia', 'pacific'],
  },
]
