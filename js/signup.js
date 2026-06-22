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
            let novoIme = document.getElementById('Ime').value;
            let novoPrezime = document.getElementById('Prezime').value;
            let korisnickoIme = document.getElementById('username').value;
            let email = document.getElementById('email').value;
            let lozinka = document.getElementById('password').value;
            let datumRodjenja = document.getElementById('datumRodjenja').value;
            let adresa = document.getElementById('adresa').value;
            let zanimanje = document.getElementById('zanimanje').value;
            let korisnik = {
                "adresa": adresa,
                "datumRodjenja": datumRodjenja,
                "email": email,
                "ime": novoIme,
                "korisnickoIme": korisnickoIme,
                "lozinka": lozinka,
                "prezime": novoPrezime,
                "zanimanje": zanimanje
            };
            let noviKorisnikId = getNoviKorisnikId();
            fetch(firebaseUrl + '/korisnici/'+noviKorisnikId+'.json', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(korisnik)
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('ulogovanKorisnik', JSON.stringify(data));
                window.location.href = '../pages/korisnicki_profil.html';
            })
            .catch(error => {
                console.error('Грешка при регистрацији:', error);
                alert('Грешка при регистрацији');
            });
        }
    });
}
Validacija();

function getNoviKorisnikId() {
    let kljucevi = Object.keys(users);
    let poslednjiKljuc = kljucevi[kljucevi.length - 1];
    let poslednjiId = parseInt(poslednjiKljuc.replace('kor', ''));
    let noviId = 'kor' + String((poslednjiId + 1)).padStart(3, '0');
    return noviId;
}
