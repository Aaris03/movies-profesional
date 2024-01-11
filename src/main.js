  const imgBaseUrl = "https://image.tmdb.org/t/p/original"
  const categoriesColors = [
    "#2FF3E0","#F8D210","#FA26A0","#F51720","#BCECE0",
    "#0000FF","#4C5270", "#E56997","#BD97CB","#E7F2F8",
    "#74BDCB","#FFA384", "#EFE7BC","#4EC33D","#353643",
    "#050A30","#36EEE0","#B4F8C8","#41729F","#000C66"]

  const trendingSection = document.querySelector(".trending-section");
  const moviesByCategoriesSection = document.querySelector(".movies-by-categories-section");
  const trendingBox = document.querySelector(".trending-box");
  const categoriesBox = document.querySelector(".categories-box");
  const moviesByCategorySection = document.querySelector(".movies-by-categories-section");
  const seachingMovieSection = document.querySelector(".seaching-movie-section");
  const movieDetailsSection = document.querySelector(".movie-details-section");
  const allMoviesSection = document.querySelector(".all-movies-section");
  const allMoviesBox = document.querySelector(".all-movies-box");

  let categories = [];
  let page = 0;
  let scrollChargedOnce = true;
  let totalPagesMovies = 0;

  const notFoundImg = "https://img.freepik.com/vector-gratis/ups-error-404-ilustracion-concepto-robot-roto_114360-5529.jpg?size=626&ext=jpg"

  const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: {
      Authorization: `Bearer ${API_KEY}` 
    }
  })

  async function getTrendingMoviesPrev(){
    trendingBox.innerHTML = ""
    
    loadingMovies();
    
    const {data} = await api("trending/movie/day")

    const trendingMovies = data.results;
    setTimeout(()=>{
      trendingBox.innerHTML = "",
      
      trendingMovies.forEach((movie, index) => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("trending-movie-ele")
        movieElement.innerHTML = `
        <img data-img="${imgBaseUrl+movie.poster_path}" class="poster-img" alt="${movie.original_title}" data-id="${movie.id}">
        ` 
        trendingBox.appendChild(movieElement)

        lazyObserver.observe(movieElement)

        const clickEvent = document.querySelector(`img[data-id="${movie.id}"]`)
        clickEvent.addEventListener("click", getMovieDetails)
      });
    },2000)
  }

  async function getCategoriesMovies(){

    loadingCategories()
    
    const {data} = await api("genre/movie/list")

    categories = data.genres;

    setTimeout(()=>{
      categoriesBox.innerHTML= "";
      categories.forEach((category, index) => {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("category");

        categoryElement.innerHTML = `
          <div class="category-color" style="background-color:${categoriesColors[index]}" data-id="${category.id}"></div>
          <p data-id="${category.id}">${category.name}</p>
        `
        categoryElement.addEventListener("click", changeHashPath)

        categoriesBox.appendChild(categoryElement)

      });
    },2000)
  }

  async function getMoviesByCategories(categoryID, categoryName){
    moviesByCategorySection.innerHTML = "";

    loadingMovies();
    
    const {data} = await api(`discover/movie?with_genres=${categoryID}`)

    const moviesByCategories = data.results;

    setTimeout(() => {
      moviesByCategorySection.innerHTML = "";

      const subTittleSectionRow = document.createElement("div");
      const moviesByCategoriesBox = document.createElement("div");

      moviesByCategoriesBox.classList.add("movies-by-categoriry-box")

      subTittleSectionRow.innerHTML = `
      <h3>${newPathName}</h3>
      `
      moviesByCategorySection.appendChild(subTittleSectionRow);

      moviesByCategories.forEach(element => {
        const moviesByCategoriesItem = document.createElement("div");
      
        moviesByCategoriesItem.innerHTML = `
        <img data-img="${imgBaseUrl+element.poster_path}" class="poster-img" alt="${element.original_title}" data-id="${element.id}">
        `;
        moviesByCategoriesBox.appendChild(moviesByCategoriesItem);

        lazyObserver.observe(moviesByCategoriesItem)

      })

      moviesByCategorySection.appendChild(moviesByCategoriesBox);

      const imgArray = moviesByCategoriesBox.querySelectorAll("img");

      imgArray.forEach(element => {
        element.addEventListener("click", getMovieDetails)
      })
    }, 2000);

    
  }

  async function getMovieSearching(movie){
    seachingMovieSection.innerHTML = "";

    loadingMovies();

    const {data} = await api(`search/movie?query=${movie}`)

    const queryMovies = data.results;

    setTimeout(()=>{
      seachingMovieSection.innerHTML = "";
      if(queryMovies.length > 0){

        const subTittleSectionRow = document.createElement("div");
        const moviesSeachingBox = document.createElement("div");

        moviesSeachingBox.classList.add("movies-searching-box");

        subTittleSectionRow.innerHTML = `
          <h3>Estas buscando ${movie}</h3>
        `
        seachingMovieSection.appendChild(subTittleSectionRow);

        queryMovies.forEach(element => {
          const moviesSearchingItem = document.createElement("div");

          moviesSearchingItem.innerHTML = `
            <img data-img="${imgBaseUrl+element.poster_path}" class="poster-img" alt="${element.original_title}" data-id="${element.id}">
          `;

          moviesSeachingBox.appendChild(moviesSearchingItem);

          lazyObserver.observe(moviesSearchingItem)
        })

        seachingMovieSection.appendChild(moviesSeachingBox);

        const imgArray = moviesSeachingBox.querySelectorAll("img");

        imgArray.forEach(element => {
        element.addEventListener("click", getMovieDetails)
      })}else{
        const noELement = document.createElement("h2");
        noELement.innerHTML = "No hay coincidencia de la pelicula buscada";

        seachingMovieSection.appendChild(noELement);
      }
    },2000)
  }

  async function getMovieDetails(e){
    
    loadingDetailsMovie();
    
    const movieId = e.target.dataset.id;

    const {data: movie} = await api(`movie/${movieId}`)
    const {data: similar} = await api(`movie/${movieId}/similar`)
    const movieDetails = movie;
    const genresArray = movieDetails.genres;
    const similarArray = similar.results;

    window.location.hash = `movie/${movieId}-${movieDetails.title}`

    setTimeout(()=>{
      movieDetailsSection.innerHTML = "";

      movieDetailsSection.innerHTML = `
        <img src="${imgBaseUrl+movieDetails.poster_path}" alt="Poster de pelicula" class="poster-img">
        <div class="aux-row">
            <h3>${movieDetails.original_title}</h3>
            <p>Polularidad=${movieDetails.popularity}</p>
        </div>
        <p>${movieDetails.overview}</p>
        <ul class="categories-movie">
            <li><h3>categoria</h3></li>
            ${
              genresArray.map(function (element){
                return "<li>"+element.name+"</li>"
              }).join("")
            }
        </ul>
        <div class="similar-movies-box">
            <h3>Peliculas similares</h3>
            <div class="aux-similar-movies-box">
              <div class="carousel-box">
                ${
                  similarArray.map(function(element){
                    if(element.poster_path === null){
                      return "<img src="+(notFoundImg)+" alt="+element.original_title+" class='poster-img' data-id="+element.id+">"
                    }else{
                      return "<img src="+(imgBaseUrl+element.poster_path)+" alt="+element.original_title+" class='poster-img' data-id="+element.id+">"
                    }
                  }).join("")
                }
              </div>
            </div>
            
        </div>
      `
      const auxSimilarMoviesBox = document.querySelector(".aux-similar-movies-box");
      const auxSimilarMovieItem = auxSimilarMoviesBox.querySelectorAll("img");

      auxSimilarMovieItem.forEach(element => {
        element.addEventListener("click", getMovieDetails)
      })
    },2000)
    
  }

  async function getMovies(){
    allMoviesBox.innerHTML = "";

    page = 1;

    loadingMovies();
    
    const {data} = await api(`discover/movie`, {
      params:{
        page
      }
    })

    totalPagesMovies = data.total_pages;

    const allMovies = data.results;

    setTimeout(() => {
      allMoviesBox.innerHTML = "";

      allMovies.forEach(element => {
        const movie = document.createElement("div");

        movie.classList.add("movie-item");
      
        movie.innerHTML = `
        <img data-img="${imgBaseUrl+element.poster_path}" class="poster-img" alt="${element.original_title}" data-id="${element.id}">
        `;
        allMoviesBox.appendChild(movie);

        lazyObserver.observe(movie)

      })

      const imgArray = allMoviesBox.querySelectorAll("img");

      imgArray.forEach(element => {
        element.addEventListener("click", getMovieDetails)
      })
    }, 2000);
  }

  async function getMoreMovies(){

    page++
    
    const {data} = await api(`discover/movie`, {
      params:{
        page
      }
    })

    if(page < totalPagesMovies){
      
      const allMovies = data.results;

      allMovies.forEach(element => {
        const movie = document.createElement("div");

        movie.classList.add("movie-item");
      
        movie.innerHTML = `
        <img data-img="${imgBaseUrl+element.poster_path}" class="poster-img" alt="${element.original_title}" data-id="${element.id}">
        `;
        allMoviesBox.appendChild(movie);

        lazyObserver.observe(movie);
      })

      const imgArray = allMoviesBox.querySelectorAll("img");

      imgArray.forEach(element => {
        element.addEventListener("click", getMovieDetails)
      })  
      scrollChargedOnce = true
    }
  }

  function initCharged(){
    getTrendingMoviesPrev();
    getCategoriesMovies();
    getMovies();
  }

  function loadingCategories(lengthCategories = 20){
    for (let index = 0; index < lengthCategories; index++) {
      const loadingCategoryItem = document.createElement("div");
      const loadingCategoryColor = document.createElement("div");
      const loadingCategory = document.createElement("div");
      
      loadingCategoryItem.classList.add("loading-category-item");
      loadingCategoryColor.classList.add("loading-category-color");
      loadingCategory.classList.add("loading-category");

      loadingCategoryItem.appendChild(loadingCategoryColor);
      loadingCategoryItem.appendChild(loadingCategory);
      categoriesBox.appendChild(loadingCategoryItem)
    } 
  }
  
  function loadingMovies(lengthMovies = 20){

    for (let index = 0; index < lengthMovies; index++) {
      const loadingMovie = document.createElement("div");
      const loadingMovie2 = document.createElement("div");
      loadingMovie.classList.add("loading-movie");
      loadingMovie2.classList.add("loading-movie");
      if(window.location.hash.startsWith("#category=")){
        moviesByCategorySection.appendChild(loadingMovie)
      }else if(window.location.hash.startsWith("#?searching=")){
        seachingMovieSection.appendChild(loadingMovie)
      }else{
        trendingBox.appendChild(loadingMovie2);
        allMoviesBox.appendChild(loadingMovie)
      }
    }
  }

  function loadingDetailsMovie(){
    movieDetailsSection.innerHTML = "";
    const loadingDetailsBox = document.createElement("div");
    const loadingSimilarBox = document.createElement("div");

    loadingDetailsBox.classList.add("loading-details-box");
    loadingSimilarBox.classList.add("loading-similar-box");

    movieDetailsSection.appendChild(loadingDetailsBox);
    movieDetailsSection.appendChild(loadingSimilarBox);
  }
  
  let lazyObserver = new IntersectionObserver((entries)=>{
    entries.forEach((movie)=>{
      if(movie.isIntersecting){
        const url = movie.target.children[0].dataset.img;
        if(url.endsWith("null")){
          movie.target.children[0].setAttribute("src", notFoundImg);
        }else{
          movie.target.children[0].setAttribute("src", url);
        }
      }
    })
  });


  
