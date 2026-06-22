let firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';

let books = {};
let authors = {};
let reviews = {};
let users = {};

let urlParams = new URLSearchParams(window.location.search);

let bookId = urlParams.get('id');

Promise.all([
    fetch(firebaseUrl + '/knjige.json'),
    fetch(firebaseUrl + '/autori.json'),
    fetch(firebaseUrl + '/recenzije.json'),
    fetch(firebaseUrl + '/korisnici.json')
])
.then(responses => Promise.all(
    responses.map(r => r.json())
))
.then(data => {
    books = data[0];
    authors = data[1];
    reviews = data[2] || {};
    users = data[3] || {};

    prikaziKnjigu();
    prikaziRecenzije();
});

function prikaziKnjigu() {

    let knjiga = books[bookId];

    if (!knjiga) {

        document.body.innerHTML =
        "<h1>Књига није пронађена</h1>";

        return;
    }

    document.getElementById('book-title').innerText =
        knjiga.naziv;

    document.getElementById('book-image').src =
        knjiga.slike[0];

    document.getElementById('book-genre').innerText =
        knjiga.zanr;

    document.getElementById('book-format').innerText =
        knjiga.format;

    document.getElementById('book-price').innerText =
        knjiga.cena + " РСД";

    document.getElementById('book-pages').innerText =
        knjiga.brojStrana;

    document.getElementById('book-isbn').innerText =
        knjiga.isbn;

    document.getElementById('book-description').innerText =
        knjiga.opis;

    let autor = authors[knjiga.idAutora];

    let authorLink =
        document.getElementById('book-author');

    authorLink.innerText =
        autor.ime + " " + autor.prezime;

    authorLink.href =
        "autor.html?id=" + knjiga.idAutora;
}

function prikaziRecenzije() {
    let container =  document.getElementById('reviews-container');
    container.innerHTML = '';
    let brojRecenzija = 0;

    for(let id in reviews){
        let review = reviews[id];

        if(review.idKnjige != bookId){
            continue;
        }

        brojRecenzija++;

        let korisnik = users[review.idKorisnika];

        let imeKorisnika = korisnik ? korisnik.ime + ' ' + korisnik.prezime : 'Непознат корисник';

        container.innerHTML += `
            <div class="card p-3 mb-3">

                <h6>
                    ${imeKorisnika}
                </h6>

                <small class="text-muted">
                    ${review.datum}
                </small>

                <p class="mt-2 mb-0">
                    ${review.tekst}
                </p>

            </div>
        `;
    }

    if(brojRecenzija == 0){

        container.innerHTML = `<p>Још увек нема рецензија за ову књигу.</p>`;
    }
}

document.getElementById('review-form').addEventListener('submit',
    function(e){
        e.preventDefault();

        let text =document.getElementById('review-text').value.trim();
        let error = document.getElementById('review-error');
        error.innerHTML = '';
        let korisnikId = localStorage.getItem('ulogovanKorisnik');
        if(!korisnikId){
            error.innerHTML = 'Морате бити пријављени.';
            return;
        }

        if(text.length < 10){
            error.innerHTML = 'Рецензија мора имати најмање 10 карактера.';
            return;
        }

        let noviId = generisiNoviReviewId();
        let novaRecenzija = {
            datum: new Date().toISOString().split('T')[0],
            idKnjige: bookId,
            idKorisnika: korisnikId,
            tekst: text
        };

        fetch(
            firebaseUrl + '/recenzije/' + noviId + '.json',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    novaRecenzija
                )
            }
        )
        .then(() => {
            location.reload();
        })
        .catch(error => {
            console.log(error);
        });
    }
);

function generisiNoviReviewId(){
    let maxBroj = 0;

    for(let id in reviews){
        let broj = parseInt(id.replace('rec', ''));

        if(broj > maxBroj){
            maxBroj = broj;
        }
    }
    maxBroj++;
    return 'rec' + String(maxBroj).padStart(3, '0');
}