var firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';
var authorIds = [];
var authors = {};

var selectedAuthorId = null;
var selectedAuthorImage = '';

var request = new XMLHttpRequest();

request.open('GET', firebaseUrl + '/autori.json');
request.send();

request.onload = function () {
    if (this.readyState == 4) {
        if (this.status == 200) {
            authors = JSON.parse(request.responseText);
            for (var id in authors) {
                authorIds.push(id);
            }
            tabelaAutora();
        }
    }
}

function tabelaAutora()
    {
        var telo = document.getElementsByTagName('tbody')[0];
        for (let i=0; i<authorIds.length; i++)
        {
            telo.innerHTML += 
            `<tr>
                <td>${authors[authorIds[i]]['ime']}</td>
                <td>${authors[authorIds[i]]['prezime']}</td>
                <td>${authors[authorIds[i]]['datumRodjenja']}</td>
                <td>${authors[authorIds[i]]['status']}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="izmeniAutora('${authorIds[i]}')" title="Измени"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button type="button" class="btn btn-danger btn-sm delete-btn" title="Обриши" data-id="${authorIds[i]}"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        }
        postaviDeleteDugmad();
    }
function izmeniAutora(id)
{
    selectedAuthorId = id;
    selectedAuthorImage = authors[id]['slike'] ? authors[id]['slike'][0] : '';
       var ime = document.getElementById('ime');
       var prezime = document.getElementById('prezime');
       var biografija = document.getElementById('Biografija');
       var datumRodjenja = document.getElementById('DatumRodjenja');
       var status = document.querySelector(`input[name="Status"][value="${authors[id]['status']}"]`);
       var datumSmrti = document.getElementById('DatumSmrti');
       var brojNagrada = document.getElementById('brNagrada');
       var brojKnjiga = document.getElementById('brProdanihPrimeraka');
       var telefon = document.getElementById('brTelefona');
       ime.value = authors[id]['ime'];
       prezime.value = authors[id]['prezime'];
       biografija.value = authors[id]['biografija'];
       datumRodjenja.value = authors[id]['datumRodjenja'];
       if(status) 
        {
            status.checked = true;
            if (status.value == 'Преминуо')
                datumSmrti.hidden = false;
            else datumSmrti.hidden = true;
        }
       datumSmrti.value = authors[id]['datumSmrti'];
       brojNagrada.value = authors[id]['brojOsvojenihNagrada'];
       brojKnjiga.value = authors[id]['brojProdatihPrimeraka'];
       telefon.value = authors[id]['kontaktTelefonMenadzera'];

}
function validPhoneNumber(phoneNumber) {
    var phoneRegex = /^\+381 [0-9]{2} [0-9]{3}-[0-9]{4}$/;
    return phoneRegex.test(phoneNumber);
}
function proveriValidacijuAutora()
{
    let ime = document.getElementById('ime');
    let prezime = document.getElementById('prezime');
    let biografija = document.getElementById('Biografija');
    let slika = document.getElementById('Slika');
    let datumRodjenja = document.getElementById('DatumRodjenja');
    let status = document.querySelector('input[name="Status"]:checked');
    let datumSmrti = document.getElementById('DatumSmrti');
    let brojNagrada = document.getElementById('brNagrada');
    let brojKnjiga = document.getElementById('brProdanihPrimeraka');
    let telefon = document.getElementById('brTelefona');
    let validno = true;

    let polja = [ime, prezime, biografija, slika, datumRodjenja, brojNagrada, brojKnjiga, telefon];

    polja.forEach(polje => {
        if (polje.value.trim() === '') {

            polje.classList.add('is-invalid');
            validno = false;
        } else {
            polje.classList.remove('is-invalid');
            polje.classList.add('is-valid');
        }
    });

    if (status) {
        if (status.value === 'Преминуо' && datumSmrti.value.trim() === '') {
            datumSmrti.classList.add('is-invalid');
            validno = false;
        } else {
            datumSmrti.classList.remove('is-invalid');
        }
    } else {
        validno = false;
    }

    if (!validPhoneNumber(telefon.value)) {
        telefon.classList.add('is-invalid');
        validno = false;
    } else {
        telefon.classList.remove('is-invalid');
    }

    document.getElementById("poruka").innerHTML = validno ? "Сви подаци су исправни." : "Подаци нису исправни.";
    return validno;
}
function proveriValidacijuZaAzuriranje()
{
    let ime = document.getElementById('ime');
    let prezime = document.getElementById('prezime');
    let biografija = document.getElementById('Biografija');
    let datumRodjenja = document.getElementById('DatumRodjenja');
    let status = document.querySelector('input[name="Status"]:checked');
    let datumSmrti = document.getElementById('DatumSmrti');
    let brojNagrada = document.getElementById('brNagrada');
    let brojKnjiga = document.getElementById('brProdanihPrimeraka');
    let telefon = document.getElementById('brTelefona');
    let validno = true;

    let polja = [ime, prezime, biografija, datumRodjenja, brojNagrada, brojKnjiga, telefon];

    polja.forEach(polje => {
        if (polje.value.trim() === '') {
            polje.classList.add('is-invalid');
            validno = false;
        } else {
            polje.classList.remove('is-invalid');
            polje.classList.add('is-valid');
        }
    });

    if (status) {
        if (status.value === 'Преминуо' && datumSmrti.value.trim() === '') {
            datumSmrti.classList.add('is-invalid');
            validno = false;
        } else {
            datumSmrti.classList.remove('is-invalid');
        }
    } else {
        validno = false;
    }

    if (!validPhoneNumber(telefon.value)) {
        telefon.classList.add('is-invalid');
        validno = false;
    } else {
        telefon.classList.remove('is-invalid');
    }

    document.getElementById("poruka").innerHTML = validno ? "Сви подаци су исправни." : "Подаци нису исправни.";
    return validno;
}
function uzmiPutanjuSlike(slikaInput)
{
    if (!slikaInput || !slikaInput.value) {
        return selectedAuthorImage;
    }

    let nazivFajla = slikaInput.value.split('\\').pop();
    return '../images/autori/' + nazivFajla;
}
function dodajAutora()
{
    if (!proveriValidacijuAutora()) {
        return;
    }

    let ime = document.getElementById('ime');
    let prezime = document.getElementById('prezime');
    let biografija = document.getElementById('Biografija');
    let slika = document.getElementById('Slika');
    let datumRodjenja = document.getElementById('DatumRodjenja');
    let status = document.querySelector('input[name="Status"]:checked');
    let datumSmrti = document.getElementById('DatumSmrti');
    let brojNagrada = document.getElementById('brNagrada');
    let brojKnjiga = document.getElementById('brProdanihPrimeraka');
    let telefon = document.getElementById('brTelefona');

    let noviAutor = {
        ime: ime.value.trim(),
        prezime: prezime.value.trim(),
        biografija: biografija.value.trim(),
        slike: [uzmiPutanjuSlike(slika)],
        datumRodjenja: datumRodjenja.value,
        status: status.value,
        datumSmrti: datumSmrti.value,
        brojOsvojenihNagrada: Number(brojNagrada.value),
        brojProdatihPrimeraka: Number(brojKnjiga.value),
        kontaktTelefonMenadzera: telefon.value.trim()
    };

    fetch(firebaseUrl + '/autori/'+generisiNoviID()+'.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(noviAutor)
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById('poruka').innerHTML = 'Аутор је успешно додат.';
        document.getElementById('forma-autor').reset();
        setTimeout(() => {
            location.reload();
        }, 1000);
    })
    .catch(error => {
        document.getElementById('poruka').innerHTML = 'Грешка приликом додавања аутора.';
        console.log(error);
    });
}
function uzmiAutoraIzForme()
{
    let ime = document.getElementById('ime');
    let prezime = document.getElementById('prezime');
    let biografija = document.getElementById('Biografija');
    let slika = document.getElementById('Slika');
    let datumRodjenja = document.getElementById('DatumRodjenja');
    let status = document.querySelector('input[name="Status"]:checked');
    let datumSmrti = document.getElementById('DatumSmrti');
    let brojNagrada = document.getElementById('brNagrada');
    let brojKnjiga = document.getElementById('brProdanihPrimeraka');
    let telefon = document.getElementById('brTelefona');

    return {
        ime: ime.value.trim(),
        prezime: prezime.value.trim(),
        biografija: biografija.value.trim(),
        slike: [uzmiPutanjuSlike(slika)],
        datumRodjenja: datumRodjenja.value,
        status: status.value,
        datumSmrti: datumSmrti.value,
        brojOsvojenihNagrada: Number(brojNagrada.value),
        brojProdatihPrimeraka: Number(brojKnjiga.value),
        kontaktTelefonMenadzera: telefon.value.trim()
    };
}
function Validacija()
{
    let forma = document.getElementById('forma-autor');
    forma.addEventListener('submit', function(event) {
        event.preventDefault();
        dodajAutora();
    });
}
Validacija();
function postaviDeleteDugmad(){

    let deleteButtons =
        document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {

        button.addEventListener('click', function(){

            selectedAuthorId = this.getAttribute('data-id');

            let modal =
                new bootstrap.Modal(
                    document.getElementById('deleteModal')
                );

            modal.show();
        });

    })};
function postaviUpdateDugmad(){
    if (!proveriValidacijuZaAzuriranje()) {
        return;
    }
    let modal =
        new bootstrap.Modal(
            document.getElementById('updateModal')
        );

    modal.show();
}
function generisiNoviID() {
    let maxBroj = 0;

    for (let id of authorIds) {
        let broj = parseInt(id.replace('aut', ''));

        if (broj > maxBroj) {
            maxBroj = broj;
        }
    }

    maxBroj += 1;
    return 'aut' + String(maxBroj).padStart(3, '0');
}
function obrisiAutora() {
     let confirmBtn = document.getElementById('confirm-delete-btn');

    confirmBtn.addEventListener('click', function(){
        if(!selectedAuthorId) return;

        fetch(firebaseUrl + '/autori/' + selectedAuthorId + '.json', 
            {
                method: 'DELETE'
            }
        )
        .then(() => location.reload())
        .catch(error => {
            console.log(error);
        })
    });
}
function AzurirajAutora() {
    let confirmBtn = document.getElementById('confirm-update-btn');

    confirmBtn.onclick = function() {
        if(!selectedAuthorId) return;

        if(!proveriValidacijuZaAzuriranje()) {
            return;
        }

        let izmenjeniAutor = uzmiAutoraIzForme();

        fetch(firebaseUrl + '/autori/' + selectedAuthorId + '.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(izmenjeniAutor)
        })
        .then(response => response.json())
        .then(() => {
            document.getElementById('poruka').innerHTML = 'Аутор је успешно ажуриран.';
            document.getElementById('forma-autor').reset();
            setTimeout(() => {
                location.reload();
            }, 1000);
        })
        .catch(error => {
            document.getElementById('poruka').innerHTML = 'Грешка приликом ажурирања аутора.';
            console.log(error);
        });
    }
}
obrisiAutora();
AzurirajAutora();