'use strict';
// Api
const api_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f47adfdd316816b8422a963b3184134e';
const img_path = 'https://image.tmdb.org/t/p/w500';
const search_api = 'https://api.themoviedb.org/3/search/movie?api_key=f47adfdd316816b8422a963b3184134e&query="';

// header
const logo = document.querySelector('header img');
const btnHeaderFavoriteMovies = document.querySelector('.favorites-menu')
const form = document.querySelector('.form');
const search = document.querySelector('.search');

// body
const container = document.querySelector('.container');
const movieContainer = document.querySelector('.movies-list');
const btnAddtoFavorite = document.querySelectorAll('.movie__btn');
const paginationContainer = document.querySelector('.pagination');
const paginationNumber = document.querySelector('.pagination-page-number');
const allPagination = document.querySelectorAll('.pagin');
const blackBackground = document.querySelector('.black-background');

// favorite
const favoriteContainer = document.querySelector('.added-favorites-movies');

// sidebar
const genderList = document.querySelector('.genres-list');
const sidebarBtn = document.querySelector('.icon');
const sidebar = document.querySelector('.sidebar');
const genres = [];
let genresAllItems = [];

const favoriteMoviesarr = [];
movieContainer.innerHTML = "";

let data, currentHeight;
let currentGenreId = null;
let currentPage = 1;

// Rendering first movies
getMovies(api_url);

const getApiUrl = function(genreId, page = '1') {
    if (genreId === null) return `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f47adfdd316816b8422a963b3184134e&page=${page}`;
    else return `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f47adfdd316816b8422a963b3184134e&with_genres=${genreId}&page=${page}`
}

// Function rendering movies on page
async function getMovies(url) {
    currentHeight = document.querySelector('.main').scrollHeight;
    document.querySelector('.content').style.opacity = '0';
    setTimeout(() => {
        movieContainer.innerHTML = ""
        setTimeout(() => window.scrollTo(0, 0), 1000);
    }, 1000);

    const res = await fetch(url);
    const data1 = await res.json();
    data = data1.results;

    setTimeout(() => {
        data.forEach((movie, idx) => renderMovies(movieContainer, movie))
        setTimeout(() => document.querySelector('.content').style.opacity = '1', 100);
        insertPagination(currentPage);
    }, 1000);

}

// Get genres from API and render in sidebar
async function renderGenres() {
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=f47adfdd316816b8422a963b3184134e&language=en-US');
    const data = await res.json();

    // render in sidebar
    data.genres.forEach(movie => genres.unshift(movie.name, movie.id));
    genres.forEach(genre => {
        if (typeof genre === 'string') genderList.insertAdjacentHTML('afterbegin', `<li class="genres-list__item">${genre}</li>`)
    })
    genresAllItems = document.querySelectorAll('.genres-list__item')
}
renderGenres();

function renderMovies(container, data) {
    return container.insertAdjacentHTML('afterbegin', `
    <li class="movie">
    <img src="${img_path + data.poster_path}" alt="${data.title}'s poster">
        <div class="movie__info">
            <p class="movie__title">${data.title}</p>
            <span class="rating ${getRatingColor(data.vote_average)}">${data.vote_average}</span>
        </div>
        <div class="movie__overview">
            <button type="button" class="movie__btn">${container === favoriteContainer ? "❤️" : "🤍"}</button>
            <p class="movie__overview-title">Overview</p>
            <p>${data.overview}</p>
        </div>
    </li>
`)
}

function getRatingColor(data) {
    let rating;
    if (data >= 8) rating = 'green';
    else if (data > 5 && data < 8) rating = 'orange';
    else rating = 'red';
    return rating;
}

function removeMovie(item) {
    const findMovie = favoriteMoviesarr.findIndex(movie => movie.title === item);
    favoriteMoviesarr.splice(findMovie, 1);
}

// Pagination HTML injection function
function insertPagination(page) {
    paginationContainer.innerHTML = '';
    if (page < 4) {
        paginationContainer.insertAdjacentHTML('afterbegin', `
        <span class="pagin active">1</span>
        <span class="pagin">2</span>
        <span class="pagin">3</span>
        <span class="pagin">4</span>
        <span class="pagin">5</span>
        <span class="pagin">6</span>
        <span class="pagin">7</span>
        <span class="pagin">...</span>
        <span class="pagin">500</span>
        `)
    } else if (page >= 4 && page < 497) {
        paginationContainer.insertAdjacentHTML('afterbegin', `
        <span class="pagin">1</span>
        <span class="pagin">...</span>
        <span class="pagin">${+page - 2}</span>
        <span class="pagin">${+page - 1}</span>
        <span class="pagin active">${+page}</span>
        <span class="pagin">${+page + 1}</span>
        <span class="pagin">${+page + 2}</span>
        <span class="pagin">${+page + 3}</span>
        <span class="pagin">...</span>
        <span class="pagin">500</span>
    `)
    } else {
        paginationContainer.insertAdjacentHTML('afterbegin', `
        <span class="pagin">1</span>
        <span class="pagin">...</span>
        <span class="pagin">493</span>
        <span class="pagin">494</span>
        <span class="pagin">495</span>
        <span class="pagin">496</span>
        <span class="pagin">497</span>
        <span class="pagin">498</span>
        <span class="pagin">499</span>
        <span class="pagin">500</span>
    `)}
    // add active class
    const paginationItems = document.querySelectorAll('.pagin');
    paginationItems.forEach((pag) => {
        pag.classList.remove('active');
        if (Number(pag.innerText) === Number(currentPage)) pag.classList.add('active');
    })
}

// Add to favorites functionality 
movieContainer.addEventListener('click', e => {
    const movieTitle = e.target.closest('.movie__overview').previousElementSibling.firstElementChild.textContent;
    // find movie in fetch data
    const findMovie = data.find(movie => movie.title === movieTitle);

    if (e.target.closest('.movie__btn')) {
        // If movie wasn't added earlier - push into array. Otherwise remove and change icon.
        if (e.target.innerText === "🤍") {
            e.target.innerText = "❤️";
            favoriteMoviesarr.some(el => el.title === movieTitle) ? null : favoriteMoviesarr.push(findMovie);
        } else if (e.target.innerText === "❤️") {
            e.target.innerText = "🤍";
            removeMovie(movieTitle);
        }

        // Rerender favorite films
        favoriteContainer.innerHTML = '';
        favoriteMoviesarr.forEach(data => renderMovies(favoriteContainer, data));
    }
})

// Remove movie from favorites
favoriteContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('movie__btn')) {
        const movieTitle = e.target.closest('.movie__overview').previousElementSibling.firstElementChild.textContent;
        removeMovie(movieTitle);

        // Rerender list of favorites
        favoriteContainer.innerHTML = '';
        favoriteMoviesarr.forEach(data => renderMovies(favoriteContainer, data));
    }
})

// Show favorite movies and black background
btnHeaderFavoriteMovies.addEventListener('click', () => {
    document.querySelector('.added-favorites').style.height = `${container.scrollHeight}px`;
    blackBackground.classList.toggle('activated')
    blackBackground.style.height = `${document.querySelector('.content').scrollHeight}px`;
    container.classList.toggle('with-favorites');
})

// Pagination functiinallity, remove bounce on page and pin at the bottom
paginationContainer.addEventListener('click', function(e) {
    if (e.target.textContent !== '...' && e.target.classList.contains('pagin')) {
        currentHeight = document.querySelector('.main').scrollHeight
        const pageNumber = e.target.textContent;

        getMovies(getApiUrl(currentGenreId, pageNumber));
        currentPage = pageNumber;

        // Add number of page at the top
        paginationNumber.style.display = 'block';
        paginationNumber.textContent = `Page ${pageNumber} of 500`;

        // Scroll to top
        setTimeout(() => window.scrollTo({left: 0, top: 0, behavior: 'smooth'}), 1000)
    };
})

// Click logo - go to top of page
logo.addEventListener('click', () => {
    currentPage = 1;
    setTimeout(() => paginationNumber.style.display = 'none', 1000);
    genresAllItems.forEach(genre => genre.classList.remove('active'));
    getMovies(api_url);
});

// Render new list of films depending on genres
genderList.addEventListener('click', (e) => {
    if (e.target.classList.contains('genres-list__item')) {
        const pickedGenre = e.target.innerText;
        const index = genres.findIndex((genre) => genre === pickedGenre) + 1;
        currentGenreId = genres[index];
        getMovies(getApiUrl(currentGenreId))
        setTimeout(() => paginationNumber.style.display = 'none', 1000)
        currentPage = 1;
        setTimeout(() => window.scrollTo(0, 0), 1000);
        container.classList.remove('open-sidebar');

        genresAllItems.forEach(genre => genre.classList.remove('active'));
        e.target.classList.add('active')
    }
})

// Show sidebar
sidebarBtn.addEventListener('click', () => {
    if (!container.classList.contains('open-sidebar')) {
        container.classList.add('open-sidebar');
    } else container.classList.remove('open-sidebar');
})

blackBackground.addEventListener('click', (e) => {
    if (blackBackground.classList.contains('activated')) {
        blackBackground.classList.remove('activated');
        blackBackground.style.height = `0px`;
        container.classList.remove('with-favorites');
    }
})

// search form
form.addEventListener('submit', e => {
    e.preventDefault()
    const searchMovie = search.value;
    if (searchMovie && searchMovie !== "") {
        movieContainer.innerHTML = "";
        setTimeout(() => paginationNumber.style.display = 'none', 1000)
        getMovies(search_api + searchMovie)
    } else window.location.reload();
        genresAllItems.forEach(genre => genre.classList.remove('active'));
})