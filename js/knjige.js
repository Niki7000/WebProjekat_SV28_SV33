let firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';

let books = {};
let bookIds = [];
let authors = {};
let booksLoaded = false;
let authorsLoaded = false;


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
    }
}

function prikaziKnjige() {

    let container = document.getElementById('books-container');

    container.innerHTML = '';

    for (let id of bookIds) {

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

                            <h5>${knjiga.naziv}</h5>

                            <p><strong>Аутор:</strong> ${authors[knjiga.idAutora].ime} ${authors[knjiga.idAutora].prezime}</p>

                            <p><strong>ИСБН:</strong> ${knjiga.isbn}</p>

                            <p><strong>Жанр:</strong> ${knjiga.zanr}</p>

                        </div>

                    </div>

                </div>

            </a>

        </div>
        `;
    }
}