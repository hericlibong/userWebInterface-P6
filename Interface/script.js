
document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://127.0.0.1:8000/api/v1/titles/';

    // Fonction pour récupérer le film ayant le score IMDb le plus élevé et obtenir ses détails
    function fetchTopMovie(queryParams) {
        return fetch(`${baseUrl}${queryParams}`)
            .then(response => response.json())
            .then(data => data.results[0])
            .then(movie => fetch(movie.url).then(response => response.json()))
            .catch(error => console.error('Error fetching top movie:', error));
    }

    // Fonction pour récupérer une liste de films selon des critères de recherche avec gestion de pagination
    function fetchMovies(queryParams, limit = 6) {
        let collectedMovies = [];
        let currentPage = 1;

        function fetchPage() {
            return fetch(`${baseUrl}${queryParams}&page=${currentPage}`)
                .then(response => response.json())
                .then(data => {
                    collectedMovies = collectedMovies.concat(data.results);
                    if (collectedMovies.length < limit && data.next) {
                        currentPage++;
                        return fetchPage();  // Récursion pour charger la page suivante
                    } else {
                        return collectedMovies.slice(0, limit);  // Retourne uniquement le nombre requis de films
                    }
                });
        }

        return fetchPage();
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
        fetchMovies('?sort_by=-imdb_score', 6)
            .then(movies => {
                const container = document.getElementById('top-rated-movies-content');
                container.innerHTML = movies.map(movie => `
                    <div>
                        <img src="${movie.image_url}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                        <p>${movie.description}</p>
                    </div>
                `).join('');
            })
            .catch(error => console.error('Error fetching movies:', error));
    }

    // Fonction pour afficher les films d'une catégorie spécifique
    function displayCategoryMovies(category, containerId) {
        fetchMovies(`?genre=${category}&sort_by=-imdb_score`, 6)
            .then(movies => {
                const container = document.getElementById(containerId);
                container.innerHTML = movies.map(movie => `
                    <div>
                        <img src="${movie.image_url}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                        <p>${movie.description}</p>
                    </div>
                `).join('');
            })
            .catch(error => console.error('Error fetching category movies:', error));
    }

    // Fonction pour afficher les films de la catégorie sélectionnée par l'utilisateur
    function displayCustomCategoryMovies() {
        const selectedCategory = document.getElementById('categories').value;
        displayCategoryMovies(selectedCategory, 'custom-category-content');
    }

    // Fonction pour charger toutes les catégories disponibles dans un menu déroulant
    function loadCategories() {
        const genreUrl = 'http://127.0.0.1:8000/api/v1/genres/';
        let nextUrl = genreUrl;
    
        function fetchNextPage(url) {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const categorySelect = document.getElementById('categories');
                    data.results.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.name;
                        option.textContent = category.name;
                        categorySelect.appendChild(option);
                    });
                    if (data.next) {
                        fetchNextPage(data.next);
                    } else {
                        categorySelect.addEventListener('change', displayCustomCategoryMovies);
                    }
                })
                .catch(error => {
                    console.error('Error loading categories:', error);
                    alert('Failed to load categories from the API. Please check the console for more details.');
                });
        }
    
        fetchNextPage(nextUrl);
    }
    
    // Initialiser l'affichage des sections
    displayBestMovie();
    displayTopRatedMovies();
    displayCategoryMovies('Biography', 'category1-content');
    displayCategoryMovies('Thriller', 'category2-content');
    loadCategories();
});

