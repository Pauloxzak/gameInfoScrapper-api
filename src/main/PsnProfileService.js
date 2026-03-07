
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
    try {
      let data = await fetch(`${PsnProfileService.BASE_URL}${PsnProfileService.SEARCH_URL}${PsnProfileParser.prepareGameForSearch(game)}`,
      {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      let link = PsnProfileParser.parseSearchResult((await data.text()).toString(), game);
  
      if(!link) {
        throw new Error('Game not found');
      }
    } catch (error) {
      console.error("Falha no Scraping:", error);
      throw error;
    }
    return link;
  }

  static async getGameByName(game) {
    const link = await PsnProfileService.searchGame(game);
    return PsnProfileService.getGame(link);
  }
}

module.exports = PsnProfileService;