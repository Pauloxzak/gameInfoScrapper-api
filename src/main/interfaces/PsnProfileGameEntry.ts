import { PsnProfileGameInfo } from "./PsnProfileGameInfo";

export interface PsnProfileGameEntry {
  title: string,
  link: string,
  details: PsnProfileGameInfo,
  trophiesStatus: string,
  lastPlayed: string,
}
