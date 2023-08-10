
async function getMovies() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZWYxMDA0YWZiYTE4Y2NjMDVlODM2MDA3ODM1ZWIwMCIsInN1YiI6IjY0ZDUwM2JiZGI0ZWQ2MDExYzRiMDc3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1KaavIxTTo2vnTnKP_OrTRbojT7GU1XEwvZkL5zDqN8'
    }
  };
  try {
    return fetch('https://api.themoviedb.org/3/movie/popular?language=pt-br-US&page=1', options)
    .then(response => response.json())
  } catch (error) {
    console.log(error)
  }
}


// PUXAR INFORMAÇÕES EXTRAS DO FILME
// https://api.themoviedb.org/3/movie/{movie_id}
async function getMoreInfo(id) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZWYxMDA0YWZiYTE4Y2NjMDVlODM2MDA3ODM1ZWIwMCIsInN1YiI6IjY0ZDUwM2JiZGI0ZWQ2MDExYzRiMDc3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1KaavIxTTo2vnTnKP_OrTRbojT7GU1XEwvZkL5zDqN8'
    }
  };

  try {
    const data = await fetch('https://api.themoviedb.org/3/movie/' + id, options)
    .then(response => response.json())

    return data
  } catch (error) {
    console.log(error)
  }
}

// QUANDO CLICAR NO BOTÃO DE ASSISTIR TRAILER
// https://api.themoviedb.org/3/movie/{movie_id}/videos

async function watch(e) {
  const movie_id = e.currentTarget.dataset.id
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZWYxMDA0YWZiYTE4Y2NjMDVlODM2MDA3ODM1ZWIwMCIsInN1YiI6IjY0ZDUwM2JiZGI0ZWQ2MDExYzRiMDc3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1KaavIxTTo2vnTnKP_OrTRbojT7GU1XEwvZkL5zDqN8'
    }
  };

  try {
    const data = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos?language=pt-BR`, options)
    .then(response => response.json())

    const { results } = data

    const youtubeVideo = results.find(video => video.type === "Trailer")

    window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, 'blank')

  } catch (error) {
    console.log(error)
  } 
}

function createMovieLayout({
  id,
  title,
  stars,
  image,
  time,
  year
}) {
  
  return `
  <div class="movie">
          <div class="title">
            <span>${title}</span>

            <div>
              <img src="./assets/icons/Star.svg" alt="">

              <p>${stars}</p>
            </div>
          </div>

          <div class="poster">
            <img src="https://image.tmdb.org/t/p/w500${image}" 
            alt="Imagem de ${title}">
          </div>

          <div class="info">
            <div class="duration">
              <img src="./assets/icons/Clock.svg" alt="">

              <span>${time}</span>
            </div>

            <div class="year">
              <img src="./assets/icons/CalendarBlank.svg" alt="">

              <span>${year}</span>
            </div>
          </div>

          <button onclick="watch(event)" data-id="${id}">
            <img src="./assets/icons/Play.svg" alt="">

            <span>Assistir Trailer</span>
          </button>
        </div>
  `
}

function select3Videos(results) {
  const random = () => Math.floor(Math.random() * results.length);

  let selectedVideos = new Set();
  while (selectedVideos.size < 3 && selectedVideos.size < results.length) {
    selectedVideos.add(results[random()].id);
  }

  return [...selectedVideos];
}

function minutesToHoursMinutesAndSeconds(minutes) {
  const date = new Date(null)
  date.setMinutes(minutes)
  return date.toISOString().slice(11, 19)
}

async function start() {
  const { results } = await getMovies()

  const best3 = select3Videos(results).map(async movie => {
    const info = await getMoreInfo(movie)
    const props = {
      id: info.id,
      title: info.title,
      stars: Number(info.vote_average).toFixed(1),
      image: info.poster_path,
      time: minutesToHoursMinutesAndSeconds(info.runtime),
      year: info.release_date.slice(0, 4)
    }
    
    return createMovieLayout(props)
  })

  const output = await Promise.all(best3)

  document.querySelector('.movies').innerHTML = output.join("")

}

start()
