const $urlDisplay = $('.url-list');
const host = window.location.origin;
let mostPopularAreOnTop = true;
let mostRecentAreOnTop = false;

$('.submit-button').on('click', (e) => {
  e.preventDefault();
  let longUrl = $('.long-url').val();
  let data = {
    longUrl: longUrl
  };
  $.post('/urls', data)
    .then(turnUrlsIntoElements)
    .then(displayUserUrl)
    .catch((err) => console.error(err));
  $('.long-url').val('');
});

$('.long-url').on('keyup', () => {
  let longUrl = $('.long-url').val();
  $('.submit-button').attr('disabled', !longUrl);
});

const displayUserUrl = (arr) => {
  let userURL = arr[arr.length - 1];
  $('.tiny-url').html(userURL);
};

$('.sort-by-clicks-button').on('click', () => {
  mostPopularAreOnTop = !mostPopularAreOnTop;
  displayByPopularity();
});

$('.sort-by-time-button').on('click', ()=>{
  mostRecentAreOnTop = !mostRecentAreOnTop;
  displayByTimestamp();
});

$('.search-input').on('keyup', function() {
  let filter = $(this).val();
  $('.link-row').each(function() {
    if($(this).text().search(new RegExp(filter, 'i')) < 0) {
      $(this).fadeOut();
    } else {
      $(this).fadeIn();
    }
  });
});

const displayByPopularity = () => {
  $.getJSON('/urls')
    .then(sortByClicks)
    .then(turnUrlsIntoElements)
    .then(putUrlOnPage)
    .catch((err) => console.error(err));
};

const sortByClicks = (response) => {
  return mostPopularAreOnTop ? response.sort((a, b) => b.clicks - a.clicks) : response.sort((a, b) => a.clicks - b.clicks);
};

const sortByTimestamp = (response) => {
  return mostRecentAreOnTop ? response.sort((a, b) => b.timestamp - a.timestamp) : response.sort((a, b) => a.timestamp - b.timestamp);
};

const displayByTimestamp = () => {
  $.getJSON('/urls')
  .then(sortByTimestamp)
  .then(turnUrlsIntoElements)
  .then(putUrlOnPage)
  .catch((err) => console.error(err));
};

const turnUrlsIntoElements = (response) => {
  return response.map((link) => $(`<tr class='link-row'>
    <td><a href='${link.id}' target='_blank'>${host}/${link.id}</a></td>
    <td>Links to: ${link.longUrl}</td>
    <td>Clicks: ${link.clicks}</td>
    <td>Created: ${new Date(link.timestamp)}</td></tr>`) );
};

const putUrlOnPage = (element) => {
  $urlDisplay.html(element);
};

displayByPopularity();
