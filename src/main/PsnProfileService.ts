
import {PsnProfileParser} from './PsnProfileParser'
import {PsnProfileEntry} from './interfaces/PsnProfileEntry'

export default class PsnProfileService {
  public static BASE_URL: string = 'https://psnprofiles.com';
  public static SEARCH_URL: string = '/search/games?q=';

  static async profile(name: string): Promise<PsnProfileEntry> {
    let html = await PsnProfileService.loadProfilePage(name, 1)
    let entry = PsnProfileParser.parseProfile(html, name);

    return entry;
  }

  static async getGame(link: string): Promise<any> {
    let data  = await fetch(`${PsnProfileService.BASE_URL}${link}`);

    return PsnProfileParser.parseGameDetail(data.text() + "");
  }

  static async loadProfilePage(name:string, page:number): Promise<string> {
    let data = await fetch(`${PsnProfileService.BASE_URL}/${name}?ajax=1&completion=all&order=last-played&pf=all&page=${page}`);

    return data.text() + "";
  }

  static async searchGame(game: string): Promise<any> {
    let data = await fetch(`${PsnProfileService.BASE_URL}${PsnProfileService.SEARCH_URL}${PsnProfileParser.prepareGameForSearch(game)}`);
    let link = PsnProfileParser.parseSearchResult((await data.text()).toString(), game);

    if(!link) {
      throw new Error('Game not found');
    }
    return link;
  }

  static async getGameByName(game: string): Promise<any> {
    const link = await PsnProfileService.searchGame(game);
    return PsnProfileService.getGame(link);
  }
}