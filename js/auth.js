function prikaziAuthDugmad(){
    let authContainer = document.getElementById('auth-buttons');

    if(!authContainer) return;

    let korisnik = localStorage.getItem('ulogovanKorisnik');

    if(korisnik){
        authContainer.innerHTML = `
            <a href="#" id="logout-btn" class="btn btn-light btn-sm btn-1">Одјава</a>
        `;

        document.getElementById("logout-btn").addEventListener("click", function(e){
                e.preventDefault();

                localStorage.removeItem("ulogovanKorisnik");

                window.location.href = "../index.html";
            });
    } else {

        authContainer.innerHTML = `
            <a href="../pages/signup.html" class="btn btn-light btn-sm btn-1">
                Пријава
            </a>

            <a href="../pages/signup.html" class="btn btn-outline-light btn-sm">
                Регистрација
            </a>
        `;
    }

    let profile =
    document.getElementById("profile-nav");

    if(profile){
        if(korisnik){
            profile.style.display = "block";
        }
        else{
            profile.style.display = "none";
        }
    }
}

prikaziAuthDugmad();