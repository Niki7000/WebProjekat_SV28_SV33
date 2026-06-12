let firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';

let users = {};

fetch(firebaseUrl + '/korisnici.json')
.then(response => response.json())
.then(data => {
    users = data;
});

document.getElementById('login-form')
.addEventListener('submit', function(e){

    e.preventDefault();

    let username =
        document.getElementById('login-username').value;

    let password =
        document.getElementById('login-password').value;

    let pronadjenId = null;

    for(let id in users){

        let korisnik = users[id];

        if(
            korisnik.korisnickoIme === username &&
            korisnik.lozinka === password
        ){
            pronadjenId = id;
            break;
        }
    }

    if(pronadjenId){

        localStorage.setItem(
            'ulogovanKorisnik',
            pronadjenId
        );

        window.location.href = 'korisnicki_profil.html';

    }else{

        alert('Погрешно корисничко име или лозинка');
    }
});

document.getElementById('register-form')
.addEventListener('submit', function(e){

    e.preventDefault();

    let novoIme =
        document.getElementById('reg-ime').value;

    let novoPrezime =
        document.getElementById('reg-prezime').value;

    let korisnickoIme =
        document.getElementById('reg-username').value;

    let email =
        document.getElementById('reg-email').value;

    let korisnik = {

        ime: novoIme,
        prezime: novoPrezime,
        korisnickoIme: korisnickoIme,
        email: email
    };

    localStorage.setItem(
        'ulogovanKorisnik',
        JSON.stringify(korisnik)
    );

    alert('Регистрација успешна');
});
function isValidRegistration() {
    let validno = true;
    let ime = document.getElementById('Ime');
    let prezime = document.getElementById('Prezime');
    let korisnickoIme = document.getElementById('username');
    let email = document.getElementById('email');
    let lozinka = document.getElementById('password');
    let datumRodjenja = document.getElementById('datumRodjenja');
    let adresa = document.getElementById('adresa');
    let zanimanje = document.getElementById('zanimanje');

    let polja = [ime, prezime, korisnickoIme, email, lozinka, datumRodjenja, adresa, zanimanje];
    polja.forEach(polje => {
        if (!polje || polje.value.trim() === '') {
            if (polje) polje.classList.add('is-invalid');
            validno = false;
        } else {
            polje.classList.remove('is-invalid');
            polje.classList.add('is-valid');
        }
    });

    if (korisnickoIme && korisnickoIme.value.trim() !== '') {
        for (let id in users) {
            if (users[id] && users[id].korisnickoIme === korisnickoIme.value.trim()) {
                korisnickoIme.classList.add('is-invalid');
                validno = false;
                break;
            }
        }
    }

    return validno;
}

function Validacija() {
    let forma = document.getElementById('register-form');
    forma.addEventListener('submit', function(event) {
        event.preventDefault();
        if (isValidRegistration()) {
             forma.submit();
        }
    });
}
Validacija();