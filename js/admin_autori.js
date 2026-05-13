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
                    <button class="btn btn-danger btn-sm" onclick="obrisiAutora('${authorIds[i]}')" title="Обриши"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        }
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
        {status.checked = true;}
       datumSmrti.value = authors[id]['datumSmrti'];
       brojNagrada.value = authors[id]['brojOsvojenihNagrada'];
       brojKnjiga.value = authors[id]['brojProdatihPrimeraka'];
       telefon.value = authors[id]['kontaktTelefonMenadzera'];
}