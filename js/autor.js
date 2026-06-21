let params=new URLSearchParams(window.location.search);
let id=params.get('id');
var firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';
var autor = {};
let zbir=0
var request = new XMLHttpRequest();
let korisnikId = localStorage.getItem('ulogovanKorisnik');

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
function oceniAutora(vrednost)
{
    let kljucevi = Object.keys(ocene);
    let poslednji = kljucevi[kljucevi.length-1];
    let noviKljuc = parseInt(poslednji.replace("oce",""))+1;
    noviKljuc = "oce"+String(noviKljuc).padStart(3,'0');
    let ocena={
        "datum":new Date().toISOString().split('T')[0],
        "idAutora":id,
        "idKorisnika":korisnikId,
        "vrednost":vrednost
    }
    fetch(firebaseUrl + '/ocene/'+noviKljuc+'.json',{
        method:'PUT',
        body:JSON.stringify(ocena)
    }).then(response => response.json())
    .then(data => {
        alert("Успешно сте оценили аутора!");
        window.location.reload();
    }).catch(error => {
        console.error('Грешка при слању података:', error);
    })
}
function prikazOcnea()
{
    let zvezde = document.getElementsByClassName('korisnik-ocena-autor')[0];
    if(!korisnikId)
    {
        zvezde.innerHTML = '<p class="text-center">Молимо вас да се пријавите да бисте оценили аутора.</p>';
        return;
    }
    zvezde.innerHTML = `<i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>`;
    let zvezdice = zvezde.children;
    for(let star of zvezdice)
    {
        star.addEventListener('mouseover', function() {
            for(let i=0;i<zvezdice.length;i++)
            {
                zvezdice[i].classList.add('fa-solid');
                zvezdice[i].classList.remove('far');
                if(star==zvezdice[i]) break;
            }
        });
        star.addEventListener("mouseout",function() {
            for(let i=0;i<zvezdice.length;i++)
            {
                zvezdice[i].classList.remove('fa-solid');
                zvezdice[i].classList.add('far');
            }
        });
        star.addEventListener("click",function() {
            for(let i=0;i<zvezdice.length;i++)
            {
                if(star==zvezdice[i])
                {
                    oceniAutora(i+1);
                    break;
                }
            }
        });
    }

}
prikazOcnea();