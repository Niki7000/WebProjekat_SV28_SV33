let firebaseUrl =
'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';

let korisnikId =
localStorage.getItem('ulogovanKorisnik');

if(!korisnikId){

    window.location.href =
    'signup.html';
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