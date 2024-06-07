

document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://127.0.0.1:8000/api/v1/titles/';

    function fetchTopMovie(queryParams) {
        return fetch(`${baseUrl}${queryParams}`)
            .then(response => response.json())
            .then(data => data.results[0])
            .then(movie => fetch(movie.url).then(response => response.json()))
            .catch(error => console.error('Error fetching top movie:', error));
    }

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

    function displayMovies(movies, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = movies.map(createMovieCard).join('');
    }

    function displayBestMovie() {
        fetchTopMovie('?sort_by=-votes')
            .then(movie => {
                const container = document.getElementById('best-movie-content');
                container.innerHTML = createBestMovieCard(movie);  // Utiliser la fonction createBestMovieCard
            });
    }

    function displayTopRatedMovies() {
        fetchMovies('?sort_by=-imdb_score', 6)
            .then(movies => {
                displayMovies(movies, 'top-rated-movies-content');
            })
            .catch(error => console.error('Error fetching movies:', error));
    }

    function displayCategoryMovies(category, containerId, titleId) {
        fetchMovies(`?genre=${category}&sort_by=-imdb_score`, 6)
            .then(movies => {
                displayMovies(movies, containerId);
                document.getElementById(titleId).textContent = category;
            })
            .catch(error => console.error('Error fetching category movies:', error));
    }

    function displayCustomCategoryMovies() {
        const selectedCategory = document.getElementById('categories').value;
        displayCategoryMovies(selectedCategory, 'custom-category-content', 'custom-category-title');
    }

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
                        categorySelect.addEventListener('change', displayCustomCategoryMovies);
                        if (firstCategory) {
                            categorySelect.value = firstCategory;
                            displayCategoryMovies(firstCategory, 'custom-category-content', 'custom-category-title');
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

    


    function closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    window.showModal = function(movieId) {
        fetch(`${baseUrl}${movieId}`)
            .then(response => response.json())
            .then(movie => {
                document.getElementById('modal-title').textContent = movie.title;
                document.getElementById('modal-image').src = movie.image_url;
                document.getElementById('modal-genre').textContent = movie.genres.join(', ');
                document.getElementById('modal-year').textContent = movie.year;
                document.getElementById('modal-rating').textContent = 'IMDB Rating: ' + movie.imdb_score + '/10';
                document.getElementById('modal-company').textContent = movie.company;
                document.getElementById('modal-director').textContent = movie.directors.join(', ');
                document.getElementById('modal-cast').textContent = movie.actors.join(', ');
                document.getElementById('modal-duration').textContent = movie.duration + ' minutes';
                document.getElementById('modal-country').textContent = movie.countries.join(', ');
                document.getElementById('modal-summary').textContent = movie.long_description;
                document.getElementById('modal').style.display = 'block';
            })
            .catch(error => console.error('Error fetching movie details:', error));
    };

    // Assurez-vous que le bouton de fermeture est bien attaché après que le DOM est chargé
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Attach event listener to 'Fermer' button in the modal footer if it's not closing
    document.querySelector('.modal-footer button').addEventListener('click', closeModal);

    

    displayBestMovie();
    displayTopRatedMovies();
    displayCategoryMovies('Biography', 'category1-content', 'category1-title');
    displayCategoryMovies('Thriller', 'category2-content', 'category2-title');
    loadCategories();
});




