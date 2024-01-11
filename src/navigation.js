let newPathID = "";
let newPathName = "";
let query = "";

const homeLogo = document.querySelector("#logo");
const seachingInput = document.querySelector("#searching");
const seachingForm = document.querySelector("#search-form");

function scrollSet(){
    window.scroll({
        top:0,
    })
}

window.addEventListener("scroll", async () => {

    if(window.location.hash.startsWith("#home")){
      const activeScroll = document.documentElement.scrollTop;
      const scrollViewport = document.documentElement.clientHeight;
      const scrollTotalSize = document.documentElement.scrollHeight;

      let scrollMove = activeScroll + scrollViewport;

      if(scrollMove >= scrollTotalSize - 15){
        
        if(scrollChargedOnce){
            scrollChargedOnce = false
            console.log("carga")
            await getMoreMovies();
        }
      } 
    }
})

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

window.addEventListener("DOMContentLoaded", ()=>{
    scrollSet();
    window.location.hash = "home";
    initCharged();
})

window.addEventListener("hashchange",()=>{
    const hash = window.location.hash;
    if(hash.startsWith("#category=")){
        trendingSection.classList.add("inactive");
        moviesByCategoriesSection.classList.remove("inactive");
        movieDetailsSection.classList.add("inactive");
        allMoviesSection.classList.add("inactive");
        getMoviesByCategories(newPathID, newPathName);
    }else if(hash.startsWith("#?searching=")){
        trendingSection.classList.add("inactive");
        moviesByCategoriesSection.classList.add("inactive");
        seachingMovieSection.classList.remove("inactive");
        movieDetailsSection.classList.add("inactive");
        allMoviesSection.classList.add("inactive");
    }else if(hash.startsWith("#movie")){
        
        trendingSection.classList.add("inactive");
        moviesByCategoriesSection.classList.add("inactive");
        seachingMovieSection.classList.add("inactive");
        movieDetailsSection.classList.remove("inactive");
        allMoviesSection.classList.add("inactive");
    }else{
        trendingSection.classList.remove("inactive");
        allMoviesSection.classList.remove("inactive");
        moviesByCategoriesSection.classList.add("inactive");
        seachingMovieSection.classList.add("inactive");
        movieDetailsSection.classList.add("inactive");
    }
})

seachingInput.addEventListener("beforeinput", (e)=>{
    query = e.target.value
    //console.log(query)
})

seachingForm.addEventListener("submit", ()=>{
    event.preventDefault();
    window.location.hash = "#?searching="+ query;
    if(query.length > 0){
        getMovieSearching(query);
    } 
    seachingInput.value = "";
    scrollSet()
})

homeLogo.addEventListener("click",()=>{
    window.location.hash = "#home";
    scrollSet();
    getTrendingMoviesPrev();
    getMovies();
})

function changeHashPath(ele){
    const targetPath = ele.target.dataset.id;

    let objectPath = categories.find(element => {
       return element.id == targetPath;
    })

    newPathID = targetPath;
    newPathName = objectPath.name;
    newPath = `category=${newPathName}-${objectPath.id}`;

    window.location.hash = newPath;
    scrollSet();
}

