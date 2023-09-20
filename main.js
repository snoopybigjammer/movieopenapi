const dailyBoxOffice = document.querySelector(".daily-boxoffice");
const dateArea = document.querySelector(".date-area");
const dateAreaInput = document.querySelector(".date-area input");
const dailyBoxOfficeItems = document.querySelectorAll(
  ".daily-boxoffice .col-3 .list-group a"
);

const resultArea = document.querySelector(".result-area");

const searchArea = document.querySelector(".search-area");
const searchAreaInput = document.querySelector(".search-area input");

const movieDetailArea = document.querySelector(".movie-detail");

const getList = async (event) => {
  event.preventDefault();
  let BoxOfficeDay = dateAreaInput.value.replace(/-/g, "");

  let url = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=8daae1ce88501316923a40ab741636bc&targetDt=${BoxOfficeDay}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < 5; i++) {
        dailyBoxOfficeItems[
          i
        ].innerHTML = `<span onclick="movieDetail(${data.boxOfficeResult.dailyBoxOfficeList[i].movieCd})">${data.boxOfficeResult.dailyBoxOfficeList[i].movieNm}</span>`;
      }
    });
};

dateArea.addEventListener("submit", getList);

let detailUrl;

const movieDetail = (movieCd) => {
  let detailUrl = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=8daae1ce88501316923a40ab741636bc&movieCd=${movieCd}`;
  fetch(detailUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const movieIn = data.movieInfoResult.movieInfo;
      let genres = "";
      for (let i = 0; i < movieIn.genres.length; i++) {
        if (i == movieIn.genres.length - 1) {
          genres += movieIn.genres[i].genreNm;
        } else {
          genres += movieIn.genres[i].genreNm + ", ";
        }
      }
      let actors = "";
      for (let i = 0; i < movieIn.actors.length; i++) {
        if (i == movieIn.actors.length - 1) {
          actors += movieIn.actors[i].peopleNm;
        } else {
          actors += movieIn.actors[i].peopleNm + ", ";
        }
      }

      let directors = "";
      if (movieIn.directors == undefined) {
        directors = "";
      } else {
        directors = movieIn.directors[0].peopleNm;
      }

      let detailHTML = `<div>
      <h2>${movieIn.movieNm}, ${movieIn.movieNmEn}</h2>
      <h5>-${directors} 감독 작품</h5> 
      <div> ${
        actors == null
          ? "내용 없음"
          : movieIn.actors.length > 6
          ? actors.substring(0, 30) + "..."
          : actors
      } 출연</div>
      <div> ${genres} </div>
      <div>${movieIn.openDt} 개봉</div>
  </div>`;

      movieDetailArea.innerHTML = detailHTML;
    });
};

const searchList = async (event) => {
  event.preventDefault();
  let directorKeyword = searchAreaInput.value;
  let url = `http://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=f5eef3421c602c6cb7ea224104795888&directorNm=${directorKeyword}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      let movieLi = data.movieListResult.movieList;

      let searchHTML = "";
      for (let i = 0; i < movieLi.length; i++) {
        searchHTML += `<div class="serached-items">
        <div class="movie-name">${movieLi[i].movieNm}/ </div>
      <div class="genre-name">${movieLi[i].repGenreNm}/ </div>
      <div class="open-date">${movieLi[i].openDt} 개봉</div>
       </div>`;
      }

      resultArea.innerHTML = searchHTML;
    });
};

searchArea.addEventListener("submit", searchList);
