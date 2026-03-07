
import {PsnProfileParser} from './PsnProfileParser'
import {PsnProfileEntry} from './interfaces/PsnProfileEntry'

export default class PsnProfileService {
  static BASE_URL = 'https://psnprofiles.com';
  static SEARCH_URL = '/search/games?q=';

  static async profile(name) {
    let html = await PsnProfileService.loadProfilePage(name, 1)
    let entry = PsnProfileParser.parseProfile(html, name);

    return entry;
  }

  static async getGame(link) {
    let data  = await fetch(`${PsnProfileService.BASE_URL}${link}`);

    return PsnProfileParser.parseGameDetail(data.text() + "");
  }

  static async loadProfilePage(name, page) {
    let data = await fetch(`${PsnProfileService.BASE_URL}/${name}?ajax=1&completion=all&order=last-played&pf=all&page=${page}`);

    return data.text() + "";
  }

  static async searchGame(game) {
    let data = await fetch(`${PsnProfileService.BASE_URL}${PsnProfileService.SEARCH_URL}${PsnProfileParser.prepareGameForSearch(game)}`);
    let link = PsnProfileParser.parseSearchResult((await data.text()).toString(), game);

    if(!link) {
      throw new Error('Game not found');
    }
    return link;
  }

  static async getGameByName(game) {
    const link = await PsnProfileService.searchGame(game);
    return PsnProfileService.getGame(link);
  }
}

module.exports = PsnProfileService;