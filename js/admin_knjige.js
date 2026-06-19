let firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';

let books = {};
let bookIds = [];
let authors = {};

let booksLoaded = false;
let authorsLoaded = false;

function prikaziKnjige() {

    let container = document.getElementById("books-container");

    container.innerHTML = "";

    for(let id of bookIds){

        let knjiga = books[id];

        container.innerHTML += `
        
        <div class="card admin-card mb-4">

            <div class="card-body">

                <div class="row g-4 align-items-start">

                    <div class="col-12 col-md-3 text-center">

                        <img src="${knjiga.slike[0]}" class="book-cover">

                    </div>

                    <div class="col-12 col-md-9">

                        <form class="book-form">

                            <div class="row g-3">

                                <div class="col-md-6">
                                    <label class="form-label">Назив</label>
                                    <input type="text"
                                           class="form-control"
                                           value="${knjiga.naziv}">
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Жанр</label>
                                    <input type="text"
                                           class="form-control"
                                           value="${knjiga.zanr}">
                                </div>

                                <div class="col-12">
                                    <label class="form-label">Опис</label>
                                    <textarea class="form-control">${knjiga.opis}</textarea>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Слика</label>
                                    <input type="text"
                                           class="form-control"
                                           value="${knjiga.slike[0]}">
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Формат</label>
                                    <input type="text"
                                           class="form-control"
                                           value="${knjiga.format}">
                                </div>

                                <div class="col-md-4">
                                    <label class="form-label">Цена</label>
                                    <input type="number"
                                           class="form-control"
                                           value="${knjiga.cena}">
                                </div>

                                <div class="col-md-4">
                                    <label class="form-label">Број страна</label>
                                    <input type="number"
                                           class="form-control"
                                           value="${knjiga.brojStrana}">
                                </div>

                                <div class="col-md-4">
                                    <label class="form-label">Аутор</label>

                                    <input type="text" class="form-control" value="${authors[knjiga.idAutora].ime} ${authors[knjiga.idAutora].prezime}">
                                </div>

                                <div class="col-12">
                                    <label class="form-label">ISBN</label>

                                    <input type="text"
                                           class="form-control isbn-input"
                                           value="${knjiga.isbn}">
                                </div>

                            </div>

                            <button type="button"
                                    class="btn btn-custom mt-3">
                                Ажурирај
                            </button>

                            <button type="button" class="btn btn-danger mt-3 delete-btn"
                                data-id="${id}">
                                Обриши
                             </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>
        `;
    }

    postaviValidaciju();
    postaviDeleteDugmad();
    postaviUpdateValidaciju();
}

let requestBooks = new XMLHttpRequest();

requestBooks.open(
    'GET',
    firebaseUrl + '/knjige.json'
);

requestBooks.send();

requestBooks.onload = function(){

    books = JSON.parse(this.responseText);

    for(let id in books){
        bookIds.push(id);
    }

    booksLoaded = true;

    if(authorsLoaded){
        prikaziKnjige();
    }
};

let requestAuthors = new XMLHttpRequest();

requestAuthors.open(
    'GET',
    firebaseUrl + '/autori.json'
);

requestAuthors.send();

requestAuthors.onload = function(){

    authors = JSON.parse(this.responseText);

    authorsLoaded = true;

    if(booksLoaded){
        prikaziKnjige();
    }
};

function postaviValidaciju(){

    let isbnInputs =
        document.querySelectorAll('.isbn-input');

    isbnInputs.forEach(input => {

        input.addEventListener('blur', function(){

            let regex = /^(97[89])([-]?[0-9]){10}$/;

            if(regex.test(this.value)){

                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
            else{

                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }

        });

    });

}

function postaviDeleteDugmad(){

    let deleteButtons =
        document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {

        button.addEventListener('click', function(){

            let modal =
                new bootstrap.Modal(
                    document.getElementById('deleteModal')
                );

            modal.show();

        });

    });

}

function validirajDodavanje() {

    let forma = document.getElementById('add-book-form');

    forma.addEventListener('submit', function(e){

        e.preventDefault();

        let naziv =
            document.getElementById('naziv');

        let zanr =
            document.getElementById('zanr');

        let opis =
            document.getElementById('opis');

        let slika =
            document.getElementById('slika');

        let format =
            document.getElementById('format');

        let cena =
            document.getElementById('cena');

        let brojStrana =
            document.getElementById('brojStrana');

        let isbn =
            document.getElementById('isbn');

        let validno = true;

        let polja = [
            naziv,
            zanr,
            opis,
            slika,
            format,
            cena,
            brojStrana,
            isbn
        ];

        polja.forEach(polje => {

            if(polje.value.trim() === ''){

                polje.classList.add('is-invalid');
                validno = false;
            }
            else{

                polje.classList.remove('is-invalid');
                polje.classList.add('is-valid');
            }

        });

        let isbnRegex =
        /^(97[89])([-]?[0-9]){10}$/;

        if(!isbnRegex.test(isbn.value)){

            isbn.classList.remove('is-valid');
            isbn.classList.add('is-invalid');

            validno = false;
        }

        if(Number(cena.value) <= 0){

            cena.classList.remove('is-valid');
            cena.classList.add('is-invalid');

            validno = false;
        }

        if(Number(brojStrana.value) <= 0){

            brojStrana.classList.remove('is-valid');
            brojStrana.classList.add('is-invalid');

            validno = false;
        }

        if(validno){
            document.getElementById("poruka").innerHTML = "Сви подаци су исправни.";
            let novaKnjiga = {
                naziv: naziv.value,
                zanr: zanr.value,
                opis: opis.value,
                slike: [ slika.value ],
                format: format.value,
                cena: Number(cena.value),
                brojStrana: Number(brojStrana.value),
                isbn: isbn.value
            };
            dodajNovuKnjigu(novaKnjiga);
        }
        else{
            document.getElementById("poruka").innerHTML = "Подаци нису исправни.";
        }

    });

}

validirajDodavanje();

function postaviUpdateValidaciju(){

    let updateButtons =
        document.querySelectorAll('.btn-custom');

    updateButtons.forEach(button => {

        button.addEventListener('click', function(){

            let form =
                this.closest('.book-form');

            let isbn =
                form.querySelector('.isbn-input');

            let regex =
                /^(97[89])([-]?[0-9]){10}$/;

            if(regex.test(isbn.value)){

                isbn.classList.remove('is-invalid');
                isbn.classList.add('is-valid');

                let poruka = document.getElementById('poruka').innerHTML = "Подаци су исправни.";
            }
            else{

                isbn.classList.remove('is-valid');
                isbn.classList.add('is-invalid');

                let poruka = document.getElementById('poruka').innerHTML = "Подаци нису су исправни.";

            }

        });

    });

}

function dodajNovuKnjigu(novaKnjiga){
    
    let novId = generisiNoviBookId();

    fetch(firebaseUrl + '/knjige/' + novId + '.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaKnjiga)
    })
    .then(response => response.json)
    .then(data => {
        document.getElementById('poruka').innerHTML = 'Књига је успешно додата. ';
        
        document.getElementById('add-book-form').reset();
        setTimeout(() => {
            location.reload();
        }, 1000)
    })
    .catch(error => {
        document.getElementById('poruka').innerHTML = "Грешка приликом додавања.";
        console.log(error);
    })

}

function generisiNoviBookId(){
    let maxBroj = 0;

    for(let id in bookIds){
        let broj = parseInt(id.replace('knj',''));
        
        if(broj > maxBroj) maxBroj = broj;
    }
    
    maxBroj += 1;
    return `knj` + String(maxBroj).padStart(3, '0');
}