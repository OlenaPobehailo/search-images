import getRefs from './get-refs';
const refs = getRefs();

interface Image {
  largeImageURL: string;
  webformatURL: string;
  tags: string;
  likes: number;
  views: number;
  comments: number;
  downloads: number;
}

export default function renderGallery(images: Image[]) {
  return images
    .map((image: Image) => {
      return `
          <div class="photo-card">
          <a class="gallery__item" href="${image.largeImageURL}" width='320'>
              <img class='gallery-img'src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
              </a>
              <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    <span>${image.likes}</span>   
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <span>${image.views}</span>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <span>${image.comments}</span>
    
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <span>${image.downloads}</span>
                </p>
              </div>
        
          </div>
         
        `;
    })
    .join('');
}
