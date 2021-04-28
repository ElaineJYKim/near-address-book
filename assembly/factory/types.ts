import { u128 } from 'near-sdk-as';

export type AccountId = string
export type tHandle = string

export const ONE_NEAR = u128.from('1000000000000000000000000');
export const XCC_GAS = 20000000000000;
export const MIN_ACCOUNT_BALANCE = u128.mul(ONE_NEAR, u128.from(3));

export const FACTORY_KEY = "state"