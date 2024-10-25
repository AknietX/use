const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";




async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },
    })
    const respData = await resp.json()
    showMovies(respData)
}
getMovies(API_URL_POPULAR)



function showMovies(data){
    const moviesEl = document.querySelector(".movies")

    document.querySelector('.movies').innerHTML = "";

    function getClassByRate(rate){
        if(rate === 'null'){
            return "black"
        }
        else if(rate >= 7){
            return "green";
        }
        else if(rate < 7 && rate > 4){
            return "orange";
        }
        else{
            return "red";
        }
    };


    data.films.forEach((TopFilm) => {
        console.log(TopFilm)
        
        const movieEl = document.createElement("div")
        movieEl.setAttribute("class", "movie")
    
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
            <img src="${TopFilm.posterUrlPreview}" class="movie__cover">
            <div class="movie__cover--darkened">
    
            </div>
        </div>
        <div class="movie__info">
            <div class="movie__title">${TopFilm.nameRu}</div>
            <div class="movie__category">${TopFilm.genres.map(genre => `${genre.genre}`)}</div>
            <div class="movie__avarage movie__avarage--${getClassByRate(TopFilm.rating)}">${TopFilm.rating}</div>
        </div> `;
        movieEl.addEventListener('click', () => openModal(TopFilm.filmId))

        moviesEl.appendChild(movieEl)
        
    });
    
        
    
        

   
};
const form = document.querySelector(".search__form")
const search = document.querySelector(".header__search")

form.addEventListener("keydown", (e) =>{

    if(e.key === "Enter"){
        e.preventDefault();
        const searchFilm = `${API_URL_SEARCH}${search.value}`;
        
        if(search.value){
            getMovies(searchFilm)
        }
    };
    
        
})
// modal

const modalEl = document.querySelector(".modal");


async function openModal(id) {
    const resp = await fetch(API_URL_MOVIE_DETAILS+ id, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },
    })
    const respData = await resp.json();

    console.log(respData)
    modalEl.classList.add('modal--show')
    document.body.classList.add('stop-scrolling')


    

    modalEl.innerHTML = `
    <div class="modal__card">
        <img src="${respData.posterUrl}" alt="" class="modal__movie-backdrop">
        <h2>
            <span class="modal__movie-title"> ${respData.nameRu}</span>
            <span class="modal__movie-realese-year">${respData.year}</span>
        </h2>
        <ul class="modal__movie-info">
            <div class="loader"></div>
            <li class="modal__movie-genre">Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`)} </li>
            ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ""}
            <li>Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
            <li class="modal__movie-overview">Описание - ${respData.description}</li>
        </ul>
        <button type="button" class="modal__button-close">Закрыть</button>
    </div>`;

    const BtnCLose = document.querySelector(".modal__button-close");
    BtnCLose.addEventListener('click', closeModal);
}

function closeModal(){
    modalEl.classList.remove('modal--show');
    document.body.classList.remove('stop-scrolling')
}

window.addEventListener('click', (e) =>{
    if(e.target === modalEl){
        closeModal();
    }
})
window.addEventListener("keydown", (e)=>{
    if(e.keyCode === 27){
        closeModal();
    }
})

