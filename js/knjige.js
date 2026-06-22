let firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';

let books = {};
let bookIds = [];
let authors = {};
let booksLoaded = false;
let authorsLoaded = false;

let currentTitleQuery = '';
let currentGenreQuery = '';

let searchTitleInput;
let searchGenreInput;
let searchBtn;


let request2 = new XMLHttpRequest();
request2.open('GET', firebaseUrl + '/autori.json')
request2.send()

let request = new XMLHttpRequest();
request.open('GET', firebaseUrl + '/knjige.json');
request.send();

request2.onload = function () {
    if (this.readyState == 4) {

        if (this.status == 200) {
            authors = JSON.parse(request2.responseText);
        }

        authorsLoaded = true;
        proveriUcitavanje();
    }
}

request.onload = function () {

    if (this.readyState == 4) {

        if (this.status == 200) {

            books = JSON.parse(request.responseText);

            for (let id in books) {
                bookIds.push(id);
            }

            booksLoaded = true;
            proveriUcitavanje();
        }
    }
}

function proveriUcitavanje() {
    if (booksLoaded && authorsLoaded) {
        prikaziKnjige();
        setupSearch();
    }
}

function prikaziKnjige(listaKnjiga = bookIds) {

    let container = document.getElementById('books-container');

    container.innerHTML = '';

    for (let id of listaKnjiga) {

        let knjiga = books[id];

        container.innerHTML += `
        
        <div class="col-12 col-md-6 col-lg-4">

            <a href="pages/knjiga.html?id=${id}" class="card-link">

                <div class="flip-card">

                    <div class="flip-card-inner">

                        <div class="flip-card-front">

                            <img src="${knjiga.slike[0]}" alt="${knjiga.naziv}">

                        </div>

                        <div class="flip-card-back">

                            <h5>${oznaciTekst(knjiga.naziv, currentTitleQuery)}</h5>

                            <p><strong>Аутор:</strong> ${authors[knjiga.idAutora].ime} ${authors[knjiga.idAutora].prezime}</p>

                            <p><strong>ИСБН:</strong> ${knjiga.isbn}</p>

                            <p><strong>Жанр:</strong> ${oznaciTekst(knjiga.zanr, currentGenreQuery)}</p>

                        </div>

                    </div>

                </div>

            </a>

        </div>
        `;
    }
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function oznaciTekst(text, query) {
    let safeText = escapeHtml(text);

    let safeQuery = query.trim();

    if(safeQuery === ''){
        return safeText;
    }

    let escapedQuery = safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regex =
        new RegExp(
            '(' + escapedQuery + ')',
            'gi'
        );

    return safeText.replace(
        regex,
        '<mark>$1</mark>'
    );
}

function filtrirajKnjige(){
    let titleQuery = searchTitleInput.value.trim().toLowerCase();
    let genreQuery = searchGenreInput.value.trim().toLowerCase();

    currentTitleQuery = titleQuery;
    currentGenreQuery = genreQuery;

    let searchResults = [];

    for(let id in books){
        let knjiga = books[id];

        let nazivMatch = titleQuery === '' || knjiga.naziv.toLowerCase().includes(titleQuery);

        let genreMatch = genreQuery === '' || knjiga.zanr.toLowerCase().includes(genreQuery);

        if(nazivMatch && genreMatch){
            searchResults.push(id);
        }
    }

    if(searchResults.length === 0){
        document.getElementById('books-container').innerHTML =
        '<p class="text-center">Нема пронађених књига.</p>';
        return;
    }
    prikaziKnjige(searchResults);
}

function setupSearch(){
    searchTitleInput = document.getElementById('search-title');
    searchGenreInput = document.getElementById('search-genre');

    searchBtn = document.getElementById('search-btn');

    searchTitleInput.addEventListener(
            'input',
            filtrirajKnjige
        );

    searchGenreInput.addEventListener(
            'input',
            filtrirajKnjige
        );

    searchBtn.addEventListener(
            'click',
            filtrirajKnjige
        );
}