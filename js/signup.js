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

        window.location.href =
            'korisnicki_profil.html';

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
        'noviKorisnik',
        JSON.stringify(korisnik)
    );

    alert('Регистрација успешна');
});