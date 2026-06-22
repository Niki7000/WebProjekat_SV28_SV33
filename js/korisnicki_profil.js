let firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';
let korisnikId = localStorage.getItem('ulogovanKorisnik');
let recenzije = {}
let knjige = {}

if(!korisnikId){

    window.location.href =
    'signup.html';
}

Promise.all([
    fetch(firebaseUrl + '/recenzije.json'),
    fetch(firebaseUrl + '/knjige.json')
])
.then(responses =>
    Promise.all(responses.map(r => r.json()))
)
.then(data => {

    recenzije = data[0];
    knjige = data[1];

    prikaziMojeRecenzije();
});

let orequest= new XMLHttpRequest();
orequest.open('GET', firebaseUrl + '/ocene.json');
orequest.send();
let ocene={};

orequest.onload = function () {
    if (this.readyState == 4) {
        if (this.status == 200) {
            let sveOcene = JSON.parse(orequest.responseText);
            for(var ocena in sveOcene)
            {
                if(sveOcene[ocena]["idKorisnika"]==korisnikId)
                {
                    ocene[ocena] = sveOcene[ocena];
                }
            }
            prikaziOcene();
        }
    }
}

fetch(firebaseUrl + '/korisnici.json')
.then(response => response.json())
.then(data => {

    let korisnik = data[korisnikId];

    document.getElementById('ime').innerText =
        korisnik.ime;

    document.getElementById('prezime').innerText =
        korisnik.prezime;

    document.getElementById('korisnickoIme').innerText =
        korisnik.korisnickoIme;

    document.getElementById('email').innerText =
        korisnik.email;

    document.getElementById('adresa').innerText = korisnik.adresa;
    
    document.getElementById('datumRodjenja').innerText =
        korisnik.datumRodjenja;

});

document.getElementById("logout-btn").addEventListener('click', function(){
    localStorage.removeItem('ulogovanKorisnik' );
    window.location.href = '../index.html';
});

function prikaziMojeRecenzije(){
    let container = document.getElementById('recenzije-list');
    container.innerHTML = '';
    let brojRecenzija = 0;

    for(let id in recenzije){
        let recenzija = recenzije[id];
        if(recenzija.idKorisnika != korisnikId){
            continue;
        }
        brojRecenzija++;

        let knjiga = knjige[recenzija.idKnjige];
        if(!knjiga){
            continue;
        }

        container.innerHTML += `
            <div class="col-12 col-md-6">
                <div class="review-card p-3 h-100">
                    <h6>
                        <a href="knjiga.html?id=${recenzija.idKnjige}">
                            ${knjiga.naziv}
                        </a>
                    </h6>

                    <small class="text-muted">
                        ${recenzija.datum}
                    </small>

                    <p class="mt-2 mb-0">
                        ${recenzija.tekst}
                    </p>
                </div>
            </div>
        `;
    }

    if(brojRecenzija === 0){
        container.innerHTML = `
            <div class="col-12">
                <p>
                    Немате ниједну рецензију.
                </p>
            </div>
        `;
    }
}

function prikaziOcene() {
    let red = document.getElementById('ocene-list');
    for (let ocenaId in ocene) {
        let ocena = ocene[ocenaId];
        let autor=null;
        fetch(firebaseUrl + '/autori/' + ocena.idAutora + '.json')
            .then(response => response.json())
            .then(data => {
                red.innerHTML += `<div class="col-12 col-md-6">
                     <div class="review-card p-3 h-100">
                        <div class="d-flex align-items-center gap-3 mb-2">
                            <img src="${data.slike[0]}" class="autor-img" alt="Књига">
                            <h6>
                                <a href="../pages/autor.html?id=${ocena.idAutora}">${data.ime} ${data.prezime}</a>
                            </h6>
                        </div>
                        <small class="text-muted">${ocena.datum}</small>
                        ${ocena.vrednost >= 1 ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'}
                        ${ocena.vrednost >= 2 ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'}
                        ${ocena.vrednost >= 3 ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'}
                        ${ocena.vrednost >= 4 ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'}
                        ${ocena.vrednost == 5 ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'}
                    </div>
                </div>`;
            }); 

    }
}