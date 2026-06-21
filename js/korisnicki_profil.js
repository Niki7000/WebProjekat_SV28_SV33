let firebaseUrl =
'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';

let korisnikId =
localStorage.getItem('ulogovanKorisnik');

if(!korisnikId){

    window.location.href =
    'signup.html';
}
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