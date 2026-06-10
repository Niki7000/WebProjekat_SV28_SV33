var firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';
var authorIds = [];
var authors = {};

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
function Validacija()
{
    let forma = document.getElementById('forma-autor');
    forma.addEventListener('submit', function(event) {
        event.preventDefault();
        proveriValidacijuAutora();
    });
}
Validacija();
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

    })};
function postaviUpdateDugmad(){
    if (!proveriValidacijuAutora()) {
        return;
    }
    let modal =
        new bootstrap.Modal(
            document.getElementById('updateModal')
        );

    modal.show();
}

