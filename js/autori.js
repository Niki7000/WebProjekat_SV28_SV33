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
            dodajAutora();
        }
    }
}

function dodajAutora() {
    var red = document.getElementById('autor-list');
    var container = document.getElementsByClassName('autor-container')[0];
    for (var i=0; i < authorIds.length; i+=3) {
        for (let j=0;j<3;j++)
        {
            red.innerHTML += 
            ` <div class="col-12 col-md-6 col-lg-4">
                <div class="autor">
                        <img src="${authors[authorIds[j+i]]['slike'][0]}" alt="Автор 1" class="autor-img">
                        <div class="autor-bio">
                            <h3>${authors[authorIds[j+i]]['ime']} ${authors[authorIds[j+i]]['prezime']}</h3>
                            <p>${authors[authorIds[j+i]]['biografija']}</p>
                            <a href="../pages/autor.html?id=${authorIds[j+i]}" class="btn btn-light btn-sm btn-1">Више о аутору</a>
                        </div>
                </div>
                </div>`;
        }
        container.appendChild(red);
    }
    
}
