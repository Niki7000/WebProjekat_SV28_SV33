let params=new URLSearchParams(window.location.search);
let id=params.get('id');
var firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';
var autor = {};
let zbir=0
var request = new XMLHttpRequest();

request.open('GET', firebaseUrl + '/autori/'+id+'.json');
request.send();

request.onload = function () {
    if (this.readyState == 4) {
        if (this.status == 200) {
            autor = JSON.parse(request.responseText);
            autorOpis(); 
        }
    }
}
var orequest= new XMLHttpRequest();
orequest.open('GET', firebaseUrl + '/ocene.json');
orequest.send();
ocene={};

orequest.onload = function () {
    if (this.readyState == 4) {
        if (this.status == 200) {
            ocene = JSON.parse(orequest.responseText);
            duzina=0
            for(var ocena in ocene)
            {
                if(ocene[ocena]["idAutora"]==id)
                {   
                    duzina++;
                    zbir+=parseInt(ocene[ocena]["vrednost"])
                }
            }
            KreirajOcenu(parseInt(zbir/duzina));
        }}}
var krequest= new XMLHttpRequest();
krequest.open('GET', firebaseUrl + '/knjige.json');
krequest.send();
var knjigId = [];
knjige={};
krequest.onload = function () {
    if (this.readyState == 4) {
        if (this.status == 200) {
            knjige = JSON.parse(krequest.responseText);
            var knjigeAutora = [];
            for(var knjiga in knjige)
            {
                if(knjige[knjiga]["idAutora"]==id)
                {   
                    knjigId.push(knjiga);
                    knjigeAutora.push(knjige[knjiga]);
                }   
            }
            prikaziKnjige(knjigeAutora);
        }
    }
}
function autorOpis() {
    var slika = document.getElementsByClassName('autor-image')[0];
    slika.innerHTML +=  `<img src=${autor['slike'][0]} alt="Orwel" class="img-fluid" style="width:100%; height:auto;">`
    var container = document.getElementsByClassName('autor-bio')[0];
    container.innerHTML +=`<div class="col-md-10">
                        <h1 class="text-center">${autor['ime']} ${autor['prezime']}</h1>
                        <p class="text-center">${autor['biografija']}</p>
                    </div>`;
}
function KreirajOcenu(zvezdice)
{
    var zvezde = document.getElementsByClassName('ocena-autor')[0]
    for(let i=0;i<5;i++)
    {
        if(i<zvezdice)
        {
            zvezde.innerHTML += `<i class="fa-solid fa-star"></i>`
        }
        else zvezde.innerHTML += `<i class="far fa-star"></i>`
    }
}
function prikaziKnjige(knjigeAutora)
{
    var container = document.getElementsByClassName('autor-knjige')[0];
    for(let i=0;i<knjigeAutora.length;i++)
    {
        container.innerHTML += `<tr>
                                <td>${knjigeAutora[i]['naziv']}</td>
                                <td>${knjigeAutora[i]['zanr']}</td>
                                <td><a href="../pages/knjiga.html?id=${knjigId[i]}" class="btn btn-sm">Погледај</a></td>
                            </tr>`
    }
}