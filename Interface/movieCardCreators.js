function createMovieCard(movie) {
    return `
        <div class="col-md-4 col-sm-6 col-xs-12 movie-card">
            <div class="card">
                <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <button class="btn btn-primary" onclick="showModal('${movie.id}')">Détails</button>
                </div>
            </div>
        </div>
    `;
}

function createBestMovieCard(movie) {
    return `
        <div class="col-12 movie-card">
            <div class="card">
                <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">${movie.long_description}</p>
                    <button class="btn btn-primary" onclick="showModal('${movie.id}')">Détails</button>
                </div>
            </div>
        </div>
    `;
}
