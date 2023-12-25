interface Refs {
  searchForm: HTMLElement | null;
  gallery: HTMLElement | null;
  loadMoreBtn: HTMLElement | null;
  loadMoreDiv: HTMLElement | null;
}

export default function getRefs(): Refs {
  return {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    loadMoreDiv: document.querySelector('.load-more-div'),
  };
}
