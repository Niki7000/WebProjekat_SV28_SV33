var firebaseUrl = 'https://webprojekat-sv28-sv33-default-rtdb.europe-west1.firebasedatabase.app';
var authorIds = [];
var authors = {};
var searchInput = null;
var searchBtn = null;
var currentSearchQuery = '';

var request = new XMLHttpRequest();

request.open('GET', firebaseUrl + '/autori.json');
request.send();

request.onload = function () {
    if (this.readyState == 4 && this.status == 200) {
        authors = JSON.parse(request.responseText);

        for (var id in authors) {
            authorIds.push(id);
        }

        prikaziAutore(authorIds);
        setupSearch();
    }
};

function prikaziAutore(listaAutorId) {
    var red = document.getElementById('autor-list');
    red.innerHTML = '';

    if (!listaAutorId || listaAutorId.length === 0) {
        red.innerHTML = '<div class="col-12"><p class="text-center mt-4">Нема резултата за претрагу.</p></div>';
        return;
    }

    for (var i = 0; i < listaAutorId.length; i++) {
        var id = listaAutorId[i];
        var autor = authors[id];

        if (!autor) {
            continue;
        }

        red.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="autor">
                    <img src="${autor['slike'][0]}" alt="${autor['ime']} ${autor['prezime']}" class="autor-img">
                    <div class="autor-bio">
                        <h3>${oznaciTekst(autor['ime'], currentSearchQuery)} ${oznaciTekst(autor['prezime'], currentSearchQuery)}</h3>
                        <p>${autor['biografija']}</p>
                        <a href="../pages/autor.html?id=${id}" class="btn btn-light btn-sm btn-1">Више о аутору</a>
                    </div>
                </div>
            </div>`;
    }
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function oznaciTekst(text, query) {
    var safeText = escapeHtml(text);
    var safeQuery = query.trim();

    if (safeQuery === '') {
        return safeText;
    }

    var escapedQuery = safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + escapedQuery + ')', 'gi');

    return safeText.replace(regex, '<mark>$1</mark>');
}

function filtrirajAutore() {
    var query = searchInput.value.trim().toLowerCase();
    currentSearchQuery = query;

    if (query === '') {
        prikaziAutore(authorIds);
        return;
    }

    var searchResults = [];

    for (var id in authors) {
        var autor = authors[id];

        if (
            (autor['ime'] && autor['ime'].toLowerCase().includes(query)) ||
            (autor['prezime'] && autor['prezime'].toLowerCase().includes(query)) ||
            (autor['status'] && autor['status'].toLowerCase().includes(query))
        ) {
            searchResults.push(id);
        }
    }

    prikaziAutore(searchResults);
}

function setupSearch() {
    searchInput = document.getElementById('search-input');
    searchBtn = document.getElementById('search-btn');

    if (!searchInput || !searchBtn) {
        return;
    }

    searchInput.addEventListener('input', filtrirajAutore);
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        filtrirajAutore();
    });
}
