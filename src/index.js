import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { throttle, debounce } from 'lodash';
import { ImagesApiService } from './js/api-service';
import renderGallery from './js/render';
import getRefs from './js/get-refs';

const refs = getRefs();

Notiflix.Notify.init({
  width: '500px',
  position: 'center-top',
  distance: '50px',
  timeout: 5000,
  fontSize: '16px',
  clickToClose: true,
});

const imagesApiService = new ImagesApiService();
let lightbox = null;
refs.searchForm.addEventListener('submit', onSearch);
// refs.loadMoreBtn.hidden = true;
// refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  clearGallery();

  imagesApiService.query = e.currentTarget.searchQuery.value;
  if (imagesApiService.query === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again. Click here to close'
    );
  }

  imagesApiService.resetPage();

  await imagesApiService
    .fetchImages()
    .then(appendGalleryMarkup)
    .then((lightbox = new SimpleLightbox('.gallery a', {})))
    .catch(error => console.log(error));

  if (imagesApiService.maxPages === 0) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again. Click here to close'
    );
  }

  lightbox.refresh();

  Notiflix.Notify.success(
    `Hooray! We found ${imagesApiService.maxPages} images.`
  );

  // refs.loadMoreBtn.hidden = false;
  refs.loadMoreDiv.classList.remove('is-hidden');

  if (
    (imagesApiService.page - 1) * imagesApiService.per_page >
    imagesApiService.maxPages
  ) {
    // refs.loadMoreBtn.hidden = true;
    refs.loadMoreDiv.classList.remove('is-hidden');

    return Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results. Click here to close"
    );
  }
}

// function onLoadMore() {
//     imagesApiService.fetchImages().then(appendGalleryMarkup).then(lightbox = new SimpleLightbox('.gallery a', {})).catch(error=>console.log(error));
//     lightbox.refresh();

//     if (
//         (imagesApiService.page - 1) * imagesApiService.per_page >
//         imagesApiService.maxPages
//     ) {
//         refs.loadMoreBtn.hidden = true;
//         Notiflix.Notify.warning(
//             "We're sorry, but you've reached the end of search results."
//         );
//         imagesApiService.fetchImages().then(appendGalleryMarkup);
//         sal();
//         return;
//     }
// }

function appendGalleryMarkup(images) {
  refs.gallery.insertAdjacentHTML('beforeend', renderGallery(images));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

window.addEventListener('scroll', debounce(throttle(onScroll, 10000), 3000));

async function onScroll() {
  if (
    (imagesApiService.page - 1) * imagesApiService.per_page >
    imagesApiService.maxPages
  ) {
    // refs.loadMoreBtn.hidden = true;
    refs.loadMoreDiv.classList.add('is-hidden');

    imagesApiService
      .fetchImages()
      .then(appendGalleryMarkup)
      .then((lightbox = new SimpleLightbox('.gallery a', {})))
      .then(
        throttle(
          Notiflix.Notify.warning(
            "We're sorry, but you've reached the end of search results."
          )
        ),
        3000
      )
      .catch(error => console.log(error));
    return;
  }

  const galleryRect = refs.gallery.getBoundingClientRect();

  if (galleryRect.bottom < document.documentElement.clientHeight + 350) {
    await imagesApiService.fetchImages().then(appendGalleryMarkup);
    lightbox.refresh();
  }
}
