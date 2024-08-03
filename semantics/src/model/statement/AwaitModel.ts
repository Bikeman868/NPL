import { Named } from '#model/Named.js';
import { Model } from '../Model.js';

export type AwaitModel = {
    messageType: string;
} & Model &
    Named;
