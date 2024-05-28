function loadBestFilm() {
    // URL à modifier selon les besoins réels de l'API
    fetch(`http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score`)
        .then(response => response.json())
        .then(data => {
            displayBestFilm(data.results[0]);
        })
        .catch(error => console.error('Error fetching best film:', error));
}

function displayBestFilm(film) {
    const container = document.getElementById('bestFilmDetails');
    container.innerHTML = `
        <img src="${film.image_url}" alt="${film.title}">
        <h3>${film.title}</h3>
        <p>${film.description}</p>
        <button onclick="showDetails(${film.id})">Détails</button>
    `;
}

function loadFilms() {
    // URL à modifier selon les besoins réels de l'API
    fetch(`http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            displayFilms(data.results);
        })
        .catch(error => console.error('Error fetching films:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    loadBestFilm();
    loadFilms();
});
