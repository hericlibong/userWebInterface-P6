
// document.addEventListener('DOMContentLoaded', function() {
//     const baseUrl = 'http://127.0.0.1:8000/api/v1/titles/';

//     // Fonction pour récupérer le film ayant le score IMDb le plus élevé et obtenir ses détails
//     function fetchTopMovie(queryParams) {
//         return fetch(`${baseUrl}${queryParams}`)
//             .then(response => response.json())
//             .then(data => data.results[0])
//             .then(movie => fetch(movie.url).then(response => response.json()))
//             .catch(error => console.error('Error fetching top movie:', error));
//     }

//     // Fonction pour récupérer une liste de films selon des critères de recherche avec gestion de pagination
//     function fetchMovies(queryParams, limit = 6) {
//         let collectedMovies = [];
//         let currentPage = 1;

//         function fetchPage() {
//             return fetch(`${baseUrl}${queryParams}&page=${currentPage}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     collectedMovies = collectedMovies.concat(data.results);
//                     if (collectedMovies.length < limit && data.next) {
//                         currentPage++;
//                         return fetchPage();  // Récursion pour charger la page suivante
//                     } else {
//                         return collectedMovies.slice(0, limit);  // Retourne uniquement le nombre requis de films
//                     }
//                 });
//         }

//         return fetchPage();
//     }

//     // Fonction pour afficher le meilleur film
//     function displayBestMovie() {
//         fetchTopMovie('?sort_by=-votes')
//             .then(movie => {
//                 const container = document.getElementById('best-movie-content');
//                 container.innerHTML = createMovieCard(movie);  // Utiliser la fonction createMovieCard
//                 /* container.innerHTML = `
//                     <div>
//                         <img src="${movie.image_url}" alt="${movie.title}">
//                         <h3>${movie.title}</h3>
//                         <p>${movie.long_description}</p>
//                         <button onclick="showModal('${movie.id}')">Détails</button>
//                     </div>
//                 `; */
//             });
//     }

//     // Fonction pour afficher les films les mieux notés
//     function displayTopRatedMovies() {
//         fetchMovies('?sort_by=-imdb_score', 6)
//             .then(movies => {
//                 displayMovies(movies, 'top-rated-movies-content');
//                 const container = document.getElementById('top-rated-movies-content');
//                 container.innerHTML = movies.map(movie => `
//                     <div>
//                         <img src="${movie.image_url}" alt="${movie.title}">
//                         <h3>${movie.title}</h3>
//                         <button onclick="showModal('${movie.id}')">Détails</button>
//                     </div>
//                 `).join('');
//             })
//             .catch(error => console.error('Error fetching movies:', error));
//     }

//     // Fonction pour afficher les films d'une catégorie spécifique
//     function displayCategoryMovies(category, containerId, titleId) {
//         fetchMovies(`?genre=${category}&sort_by=-imdb_score`, 6)
//             .then(movies => {
//                 displayMovies(movies, containerId);
//                 const container = document.getElementById(containerId);
//                 container.innerHTML = movies.map(movie => `
//                     <div>
//                         <img src="${movie.image_url}" alt="${movie.title}">
//                         <h3>${movie.title}</h3>
//                         <button onclick="showModal('${movie.id}')">Détails</button>
//                     </div>
//                 `).join('');
//                 // Mettre à jour le titre de la section
//                 document.getElementById(titleId).textContent = category;
//             })
//             .catch(error => console.error('Error fetching category movies:', error));
//     }

//     // Fonction pour afficher les films de la catégorie sélectionnée par l'utilisateur
//     function displayCustomCategoryMovies() {
//         const selectedCategory = document.getElementById('categories').value;
//         displayCategoryMovies(selectedCategory, 'custom-category-content');
//     }

//     // Fonction pour charger toutes les catégories disponibles dans un menu déroulant
//     function loadCategories() {
//         const genreUrl = 'http://127.0.0.1:8000/api/v1/genres/';
//         let nextUrl = genreUrl;
//         let firstCategory = null;  // Initialiser la première catégorie en dehors de la fonction fetchNextPage
    
//         function fetchNextPage(url) {
//             fetch(url)
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error(`HTTP error! status: ${response.status}`);
//                     }
//                     return response.json();
//                 })
//                 .then(data => {
//                     const categorySelect = document.getElementById('categories');
//                     data.results.forEach((category, index) => {
//                         const option = document.createElement('option');
//                         option.value = category.name;
//                         option.textContent = category.name;
//                         categorySelect.appendChild(option);
    
//                         // Définir la première catégorie globale si elle n'est pas encore définie
//                         if (!firstCategory) {
//                             firstCategory = category.name;
//                         }
//                     });
//                     if (data.next) {
//                         fetchNextPage(data.next);
//                     } else {
//                         categorySelect.addEventListener('change', displayCustomCategoryMovies);
    
//                         // Afficher la première catégorie par défaut
//                         if (firstCategory) {
//                             categorySelect.value = firstCategory;
//                             displayCategoryMovies(firstCategory, 'custom-category-content');
//                         }
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error loading categories:', error);
//                     alert('Failed to load categories from the API. Please check the console for more details.');
//                 });
//         }
    
//         fetchNextPage(nextUrl);
//     }
    
    
    

//     // Fonction pour afficher la modale avec les détails du film
//     window.showModal = function(movieId) {
//         fetch(`${baseUrl}${movieId}`)
//             .then(response => response.json())
//             .then(movie => {
//                 document.getElementById('modal-title').textContent = movie.title;
//                 document.getElementById('modal-image').src = movie.image_url;
//                 document.getElementById('modal-genre').textContent = 'Genre: ' + movie.genres.join(', ');
//                 document.getElementById('modal-release-date').textContent = 'Release Date: ' + movie.date_published;
//                 document.getElementById('modal-rating').textContent = 'IMDB Rating: ' + movie.imdb_score;
//                 document.getElementById('modal-director').textContent = 'Director: ' + movie.directors.join(', ');
//                 document.getElementById('modal-cast').textContent = 'Cast: ' + movie.actors.join(', ');
//                 document.getElementById('modal-duration').textContent = 'Duration: ' + movie.duration + ' minutes';
//                 document.getElementById('modal-country').textContent = 'Country: ' + movie.countries.join(', ');
//                 document.getElementById('modal-box-office').textContent = 'Box Office: ' + movie.worldwide_gross_income;
//                 document.getElementById('modal-summary').textContent = movie.long_description;
//                 document.getElementById('modal').style.display = 'block';
//             })
//             .catch(error => console.error('Error fetching movie details:', error));
//     }

//     function closeModal() {
//         document.getElementById('modal').style.display = 'none';
//     }

//     document.querySelector('.close-button').addEventListener('click', closeModal);



//     function createMovieCard(movie) {
//         return `
//             <div class="col-md-4 col-sm-6 col-xs-12 movie-card">
//                 <div class="card">
//                     <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}">
//                     <div class="card-body">
//                         <h5 class="card-title">${movie.title}</h5>
//                         <button class="btn btn-primary" onclick="showModal('${movie.id}')">Détails</button>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }
    
//     function displayMovies(movies, containerId) {
//         const container = document.getElementById(containerId);
//         container.innerHTML = movies.map(createMovieCard).join('');
//     }
    

//     // Initialiser l'affichage des sections
//     displayBestMovie();
//     displayTopRatedMovies();
//     displayCategoryMovies('Biography', 'category1-content', 'category1-title');
//     displayCategoryMovies('Thriller', 'category2-content', 'category2-title');
//     loadCategories();
// });


// document.addEventListener('DOMContentLoaded', function() {
//     const baseUrl = 'http://127.0.0.1:8000/api/v1/titles/';

//     function fetchTopMovie(queryParams) {
//         return fetch(`${baseUrl}${queryParams}`)
//             .then(response => response.json())
//             .then(data => data.results[0])
//             .then(movie => fetch(movie.url).then(response => response.json()))
//             .catch(error => console.error('Error fetching top movie:', error));
//     }

//     function fetchMovies(queryParams, limit = 6) {
//         let collectedMovies = [];
//         let currentPage = 1;

//         function fetchPage() {
//             return fetch(`${baseUrl}${queryParams}&page=${currentPage}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     collectedMovies = collectedMovies.concat(data.results);
//                     if (collectedMovies.length < limit && data.next) {
//                         currentPage++;
//                         return fetchPage();  // Récursion pour charger la page suivante
//                     } else {
//                         return collectedMovies.slice(0, limit);  // Retourne uniquement le nombre requis de films
//                     }
//                 });
//         }

//         return fetchPage();
//     }

//     function createMovieCard(movie) {
//         return `
//             <div class="col-md-4 col-sm-6 col-xs-12 movie-card">
//                 <div class="card">
//                     <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}">
//                     <div class="card-body">
//                         <h5 class="card-title">${movie.title}</h5>
//                         <button class="btn btn-primary" onclick="showModal('${movie.id}')">Détails</button>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }

//     function createBestMovieCard(movie) {
//         return `
//             <div class="col-12 movie-card">
//                 <div class="card">
//                     <img src="${movie.image_url}" class="card-img-top" alt="${movie.title}">
//                     <div class="card-body">
//                         <h5 class="card-title">${movie.title}</h5>
//                         <p class="card-text">${movie.long_description}</p>
//                         <button class="btn btn-primary" onclick="showModal('${movie.id}')">Détails</button>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }

//     function displayMovies(movies, containerId) {
//         const container = document.getElementById(containerId);
//         container.innerHTML = movies.map(createMovieCard).join('');
//     }

//     function displayBestMovie() {
//         fetchTopMovie('?sort_by=-votes')
//             .then(movie => {
//                 const container = document.getElementById('best-movie-content');
//                 container.innerHTML = createBestMovieCard(movie);  // Utiliser la fonction createBestMovieCard
//             });
//     }

//     function displayTopRatedMovies() {
//         fetchMovies('?sort_by=-imdb_score', 6)
//             .then(movies => {
//                 displayMovies(movies, 'top-rated-movies-content');
//             })
//             .catch(error => console.error('Error fetching movies:', error));
//     }

//     function displayCategoryMovies(category, containerId, titleId) {
//         fetchMovies(`?genre=${category}&sort_by=-imdb_score`, 6)
//             .then(movies => {
//                 displayMovies(movies, containerId);
//                 document.getElementById(titleId).textContent = category;
//             })
//             .catch(error => console.error('Error fetching category movies:', error));
//     }

//     function displayCustomCategoryMovies() {
//         const selectedCategory = document.getElementById('categories').value;
//         displayCategoryMovies(selectedCategory, 'custom-category-content', 'custom-category-title');
//     }

//     function loadCategories() {
//         const genreUrl = 'http://127.0.0.1:8000/api/v1/genres/';
//         let nextUrl = genreUrl;
//         let firstCategory = null;

//         function fetchNextPage(url) {
//             fetch(url)
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error(`HTTP error! status: ${response.status}`);
//                     }
//                     return response.json();
//                 })
//                 .then(data => {
//                     const categorySelect = document.getElementById('categories');
//                     data.results.forEach((category, index) => {
//                         const option = document.createElement('option');
//                         option.value = category.name;
//                         option.textContent = category.name;
//                         categorySelect.appendChild(option);

//                         if (!firstCategory) {
//                             firstCategory = category.name;
//                         }
//                     });
//                     if (data.next) {
//                         fetchNextPage(data.next);
//                     } else {
//                         categorySelect.addEventListener('change', displayCustomCategoryMovies);
//                         if (firstCategory) {
//                             categorySelect.value = firstCategory;
//                             displayCategoryMovies(firstCategory, 'custom-category-content', 'custom-category-title');
//                         }
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error loading categories:', error);
//                     alert('Failed to load categories from the API. Please check the console for more details.');
//                 });
//         }

//         fetchNextPage(nextUrl);
//     }

//     window.showModal = function(movieId) {
//         fetch(`${baseUrl}${movieId}`)
//             .then(response => response.json())
//             .then(movie => {
//                 document.getElementById('modal-title').textContent = movie.title;
//                 document.getElementById('modal-image').src = movie.image_url;
//                 document.getElementById('modal-genre').textContent = 'Genre: ' + movie.genres.join(', ');
//                 document.getElementById('modal-release-date').textContent = 'Release Date: ' + movie.date_published;
//                 document.getElementById('modal-rating').textContent = 'IMDB Rating: ' + movie.imdb_score;
//                 document.getElementById('modal-director').textContent = 'Director: ' + movie.directors.join(', ');
//                 document.getElementById('modal-cast').textContent = 'Cast: ' + movie.actors.join(', ');
//                 document.getElementById('modal-duration').textContent = 'Duration: ' + movie.duration + ' minutes';
//                 document.getElementById('modal-country').textContent = 'Country: ' + movie.countries.join(', ');
//                 document.getElementById('modal-box-office').textContent = 'Box Office: ' + movie.worldwide_gross_income;
//                 document.getElementById('modal-summary').textContent = movie.long_description;
//                 document.getElementById('modal').style.display = 'block';
//             })
//             .catch(error => console.error('Error fetching movie details:', error));
//     }

//     function closeModal() {
//         document.getElementById('modal').style.display = 'none';
//     }

//     document.querySelector('.close-button').addEventListener('click', closeModal);

//     displayBestMovie();
//     displayTopRatedMovies();
//     displayCategoryMovies('Biography', 'category1-content', 'category1-title');
//     displayCategoryMovies('Thriller', 'category2-content', 'category2-title');
//     loadCategories();
// });



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

    window.showModal = function(movieId) {
        fetch(`${baseUrl}${movieId}`)
            .then(response => response.json())
            .then(movie => {
                document.getElementById('modal-title').textContent = movie.title;
                document.getElementById('modal-image').src = movie.image_url;
                document.getElementById('modal-genre').textContent = 'Genre: ' + movie.genres.join(', ');
                document.getElementById('modal-release-date').textContent = 'Release Date: ' + movie.date_published;
                document.getElementById('modal-rating').textContent = 'IMDB Rating: ' + movie.imdb_score;
                document.getElementById('modal-director').textContent = 'Director: ' + movie.directors.join(', ');
                document.getElementById('modal-cast').textContent = 'Cast: ' + movie.actors.join(', ');
                document.getElementById('modal-duration').textContent = 'Duration: ' + movie.duration + ' minutes';
                document.getElementById('modal-country').textContent = 'Country: ' + movie.countries.join(', ');
                document.getElementById('modal-box-office').textContent = 'Box Office: ' + movie.worldwide_gross_income;
                document.getElementById('modal-summary').textContent = movie.long_description;
                document.getElementById('modal').style.display = 'block';
            })
            .catch(error => console.error('Error fetching movie details:', error));
    }

    function closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    document.querySelector('.close-button').addEventListener('click', closeModal);

    displayBestMovie();
    displayTopRatedMovies();
    displayCategoryMovies('Biography', 'category1-content', 'category1-title');
    displayCategoryMovies('Thriller', 'category2-content', 'category2-title');
    loadCategories();
});




