document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://127.0.0.1:8000/api/v1/titles/';

    // Fonction pour récupérer le film ayant le score IMDb le plus élevé et obtenir ses détails
    function fetchTopMovie(queryParams) {
        return fetch(`${baseUrl}${queryParams}`)
            .then(response => response.json())
            .then(data => data.results[0])
            .then(movie => fetch(movie.url).then(response => response.json()))  // Récupérer les détails du film
            .catch(error => console.error('Error fetching top movie:', error));
    }

    // Fonction pour récupérer une liste de films selon des critères de recherche
    function fetchMovies(queryParams) {
        return fetch(`${baseUrl}${queryParams}`)
            .then(response => response.json())
            .then(data => data.results)
            .catch(error => console.error('Error fetching movies:', error));
    }

    // Fonction pour afficher le meilleur film
    function displayBestMovie() {
        fetchTopMovie('?sort_by=-votes')
            .then(movie => {
                const container = document.getElementById('best-movie-content');
                container.innerHTML = `
                    <div>
                        <img src="${movie.image_url}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                        <p>${movie.long_description}</p>
                        <button onclick="alert('More details')">Détails</button>
                    </div>
                `;
            });
    }

    // Fonction pour afficher les films les mieux notés
    function displayTopRatedMovies() {
        fetchMovies('?sort_by=-imdb_score&limit=5&offset=1')
            .then(movies => {
                const container = document.getElementById('top-rated-movies-content');
                container.innerHTML = movies.map(movie => `
                    <div>
                        <img src="${movie.image_url}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                        <p>${movie.description}</p>
                    </div>
                `).join('');
            });
    }

    // Fonction pour afficher les films d'une catégorie spécifique
    function displayCategoryMovies(category, containerId) {
        fetchMovies(`?genre=${category}&sort_by=-imdb_score&limit=5`)
            .then(movies => {
                const container = document.getElementById(containerId);
                container.innerHTML = movies.map(movie => `
                    <div>
                        <img src="${movie.image_url}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                        <p>${movie.description}</p>
                    </div>
                `).join('');
            });
    }

    // Fonction pour afficher les films de la catégorie sélectionnée par l'utilisateur
    function displayCustomCategoryMovies() {
        const selectedCategory = document.getElementById('categories').value;
        displayCategoryMovies(selectedCategory, 'custom-category-content');
    }

    // Fonction pour charger toutes les catégories disponibles dans un menu déroulant
    function loadCategories() {
        const genreUrl = 'http://127.0.0.1:8000/api/v1/genres/';  // URL correcte des genres
        fetch(genreUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const categorySelect = document.getElementById('categories');
                // Assure que data.results existe et contient les données des genres
                if (data.results) {
                    categorySelect.innerHTML = data.results.map(category => `
                        <option value="${category.name}">${category.name}</option>
                    `).join('');
                    categorySelect.addEventListener('change', displayCustomCategoryMovies);
                } else {
                    console.error("No genre data found:", data);
                }
            })
            .catch(error => {
                console.error('Error loading categories:', error);
                alert('Failed to load categories from the API. Please check the console for more details.');
            });
    }
    

    // Initialiser l'affichage des sections
    displayBestMovie();
    displayTopRatedMovies();
    displayCategoryMovies('Action', 'category1-content');
    displayCategoryMovies('Drama', 'category2-content');
    loadCategories();
});
