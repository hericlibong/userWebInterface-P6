/**
 * Permet d'afficher ou de masquer des films supplémentaires dans une section.
 * @param {string} sectionId - L'ID de la section contenant les films.
 * @param {string} buttonId - L'ID du bouton qui déclenche l'affichage/masquage.
 */
function toggleMovies(sectionId, buttonId) {
    const section = document.getElementById(sectionId);
    const button = document.getElementById(buttonId);
    const extraMovies = section.querySelectorAll('.movie-card.extra');

    button.addEventListener('click', function() {
        extraMovies.forEach(movie => {
            if (movie.style.display === 'none' || movie.style.display === '') {
                movie.style.display = 'block';
            } else {
                movie.style.display = 'none';
            }
        });

        // Changer le texte du bouton en fonction de l'état
        if (button.textContent === 'Voir plus') {
            button.textContent = 'Voir moins';
        } else {
            button.textContent = 'Voir plus';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://127.0.0.1:8000/api/v1/titles/';


        /**
     * Récupère les détails du film ayant le score IMDb le plus élevé selon les paramètres de requête.
     * @param {string} queryParams - Les paramètres de requête pour filtrer les films.
     * @returns {Promise<object>} - Une promesse qui résout avec les détails du film.
     */
    function fetchTopMovie(queryParams) {
        return fetch(`${baseUrl}${queryParams}`)
            .then(response => response.json())
            .then(data => data.results[0])
            .then(movie => fetch(movie.url).then(response => response.json()))
            .catch(error => console.error('Error fetching top movie:', error));
    }

    
    /**
 * Récupère une liste de films selon des critères de recherche avec gestion de pagination.
 * @param {string} queryParams - Les paramètres de requête pour filtrer les films.
 * @param {number} limit - Le nombre maximal de films à récupérer.
 * @returns {Promise<object[]>} - Une promesse qui résout avec une liste de films.
 */
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

    /**
     * Affiche les cartes de films dans un conteneur spécifié.
     * @param {object[]} movies - La liste des films à afficher.
     * @param {string} containerId - L'ID du conteneur où afficher les films.
     */
    function displayMovies(movies, containerId) {
        const container = document.getElementById(containerId);
        const mediaQuery = window.matchMedia('(max-width: 767.98px)');
        const initialDisplayCount = mediaQuery.matches ? 2 : 4; // 2 films pour mobile, 4 films pour tablette
    
        container.innerHTML = movies.map((movie, index) => 
            `<div class="movie-card ${index >= initialDisplayCount ? 'extra' : ''}">` + createMovieCard(movie) + `</div>`
        ).join('');
    }

        /**
     * Affiche le film ayant le score IMDb le plus élevé dans la section Meilleur Film.
     */
    function displayBestMovie() {
        fetchTopMovie('?sort_by=-votes')
            .then(movie => {
                const container = document.getElementById('best-movie-content');
                container.innerHTML = createBestMovieCard(movie);  // Utiliser la fonction createBestMovieCard
            });
    }

        /**
     * Affiche les films les mieux notés dans la section correspondante.
     */
    function displayTopRatedMovies() {
        fetchMovies('?sort_by=-imdb_score', 6)
            .then(movies => {
                displayMovies(movies, 'top-rated-movies-content');
                toggleMovies('top-rated-movies-content', 'toggle-top-rated');
            })
            .catch(error => console.error('Error fetching movies:', error));
    }

        /**
     * Affiche les films d'une catégorie spécifique dans une section correspondante.
     * @param {string} category - Le nom de la catégorie de films.
     * @param {string} containerId - L'ID du conteneur où afficher les films.
     * @param {string} titleId - L'ID de l'élément où afficher le titre de la catégorie.
     */
    function displayCategoryMovies(category, containerId, titleId) {
        fetchMovies(`?genre=${category}&sort_by=-imdb_score`, 6)
            .then(movies => {
                displayMovies(movies, containerId);
                document.getElementById(titleId).textContent = category;
                toggleMovies(containerId, 'toggle-' + containerId);
            })
            .catch(error => console.error('Error fetching category movies:', error));
    }

        /**
     * Affiche les films de la catégorie sélectionnée par l'utilisateur dans la section Catégorie libre.
     */
    function displayCustomCategoryMovies() {
        const selectedCategory = document.getElementById('categories').value;
        fetchMovies(`?genre=${selectedCategory}&sort_by=-imdb_score`, 6)
            .then(movies => {
                displayMovies(movies, 'custom-category-content');
                toggleMovies('custom-category-content', 'toggle-custom-category-content');
            })
            .catch(error => console.error('Error fetching custom category movies:', error));
    }

        /**
     * Charge toutes les catégories disponibles dans un menu déroulant et affiche les films de la première catégorie par défaut.
     */
    function loadCategories() {
        const genreUrl = 'http://127.0.0.1:8000/api/v1/genres/';
        let nextUrl = genreUrl;
        let firstCategory = null;

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
                    data.results.forEach((category, index) => {
                        const option = document.createElement('option');
                        option.value = category.name;
                        option.textContent = category.name;
                        categorySelect.appendChild(option);

                        if (!firstCategory) {
                            firstCategory = category.name;
                        }
                    });
                    if (data.next) {
                        fetchNextPage(data.next);
                    } else {
                        categorySelect.addEventListener('change', function() {
                            displayCustomCategoryMovies();
                            updateSelectedOptionStyle(categorySelect);
                        });
                        if (firstCategory) {
                            categorySelect.value = firstCategory;
                            displayCustomCategoryMovies();
                            updateSelectedOptionStyle(categorySelect);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error loading categories:', error);
                    alert('Failed to load categories from the API. Please check the console for more details.');
                });
        }

        fetchNextPage(nextUrl);
    }

        /**
     * Met à jour le style de l'option sélectionnée dans un menu déroulant.
     * @param {HTMLSelectElement} selectElement - L'élément select dont le style des options doit être mis à jour.
     */
    function updateSelectedOptionStyle(selectElement) {
        // Parcours toutes les options et supprime le marqueur
        for (let option of selectElement.options) {
            option.text = option.text.replace(' ✅', ''); // Assurez-vous que le caractère utilisé ici ne se trouve pas déjà dans vos noms de catégorie.
        }
        // Ajoute un marqueur à l'option sélectionnée
        selectElement.options[selectElement.selectedIndex].text += ' ✅';
    }

    document.getElementById('categories').addEventListener('change', function() {
        updateSelectedOptionStyle(this);
    });


        /**
     * Ferme la fenêtre modale.
     */
    function closeModal() {
        document.getElementById('modal').style.display = 'none';
    }


        /**
     * Affiche les détails d'un film dans une fenêtre modale.
     * @param {string} movieId - L'ID du film dont les détails doivent être affichés.
     */
    window.showModal = function(movieId) {
        fetch(`${baseUrl}${movieId}`)
            .then(response => response.json())
            .then(movie => {
                document.getElementById('modal-title').textContent = movie.title;
                document.getElementById('modal-image').src = movie.image_url;
                document.getElementById('modal-tablet-image').src = movie.image_url;
                document.getElementById('modal-genre').textContent = movie.genres.join(', ');
                document.getElementById('modal-year').textContent = movie.year;
                document.getElementById('modal-rating').textContent = 'IMDB Rating: ' + movie.imdb_score + '/10';
                document.getElementById('modal-rated').textContent = movie.rated;
                document.getElementById('modal-director').textContent = movie.directors.join(', ');
                document.getElementById('modal-cast').textContent = movie.actors.join(', ');
                document.getElementById('modal-duration').textContent = movie.duration + ' minutes';
                document.getElementById('modal-country').textContent = movie.countries.join(', ');
                document.getElementById('modal-summary').textContent = movie.long_description;
                document.getElementById('modal').style.display = 'block';
            

            
            })
            .catch(error => console.error('Error fetching movie details:', error));
    };

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', closeModal);
    });

    /**
     * Masque le titre "Autres" sur les appareils mobiles.
     */
    function hideTitleOnMobile() {
        const titleElement = document.querySelector("#custom-category h2");
        if (window.innerWidth <= 767.98) {
            if (titleElement) {
                titleElement.style.display = "none";
            }
        } else {
            if (titleElement) {
                titleElement.style.display = "block";
            }
        }
    }

    /**
     * Initialise le menu déroulant et ajoute l'écouteur d'événements pour les changements de catégorie.
     */
    function initializeCategoryDropdown() {
        const categorySelect = document.getElementById('categories');
        if (categorySelect) {
            categorySelect.addEventListener('change', function() {
                displayCustomCategoryMovies();
                updateSelectedOptionStyle(categorySelect);
            });
        }
    }

    // Initialiser l'affichage des sections
    document.querySelector('.modal-footer button').addEventListener('click', closeModal);
    document.querySelector('.close-cross').addEventListener('click', closeModal);


    displayBestMovie();
    displayTopRatedMovies();
    displayCategoryMovies('Biography', 'category1-content', 'category1-title');
    displayCategoryMovies('Thriller', 'category2-content', 'category2-title');
    loadCategories();

    // Appel initial pour masquer le titre sur mobile et initialiser le menu déroulant
    hideTitleOnMobile();
    initializeCategoryDropdown();
    
    // Ajouter un écouteur pour les événements de redimensionnement de la fenêtre
    window.addEventListener('resize', hideTitleOnMobile);
});
