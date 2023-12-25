import axios from 'axios';
import { Image } from './render';
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '32179167-903c9e169edcad7e661a9574c';

export class ImagesApiService {
  private searchQuery: string;
  public page: number;
  public per_page: number;
  private image_type: string;
  private orientation: string;
  private safesearch: boolean;
  private total: number;
  public maxPages: number;

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    this.image_type = 'photo';
    this.orientation = 'horizontal';
    this.safesearch = true;
    this.total = 0;
    this.maxPages = 0;
  }

  async fetchImages(): Promise<Image[]> {
    const searchParams = new URLSearchParams({
      image_type: this.image_type,
      orientation: this.orientation,
      safesearch: this.safesearch.toString(),
      page: this.page.toString(),
      per_page: this.per_page.toString(),
      total: this.total.toString(),
    });

    const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${searchParams}`;

    const response = await axios.get(url);

    try {
      this.maxPages = response.data.totalHits;
      const images: Image[] = await response.data.hits;
      this.total = response.data.totalHits;
      this.incrementPage();
      return images;
    } catch (error) {
      throw new Error(response.statusText);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
