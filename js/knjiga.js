let firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';

let books = {};
let authors = {};

let urlParams = new URLSearchParams(window.location.search);

let bookId = urlParams.get('id');

Promise.all([
    fetch(firebaseUrl + '/knjige.json'),
    fetch(firebaseUrl + '/autori.json')
])
.then(responses => Promise.all(
    responses.map(r => r.json())
))
.then(data => {

    books = data[0];
    authors = data[1];

    prikaziKnjigu();

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