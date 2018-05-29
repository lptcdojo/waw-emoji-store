'use strict';

const errorHandler = (error) => {
  console.error(`Error while fetching the Emojis: ${error.message}`);
};

const formatDesc = (desc) => {
  let formattedWords = desc.split(' ').map(
    w => w.charAt(0).toUpperCase() + w.slice(1, w.length));
  return formattedWords.join(' ');
}

const showEmojis = (emojis) => {
  const resultsDiv = document.querySelector('#emojis-results');

  while (resultsDiv.firstChild) {
    resultsDiv.removeChild(resultsDiv.firstChild);
  }

  if (emojis.length === 0) {
    let emojiInfoDiv = document.createElement('div');
    emojiInfoDiv.className = 'emoji-info';
    emojiInfoDiv.textContent = 'No results found.';
    resultsDiv.appendChild(emojiInfoDiv);
  } else {
    emojis.forEach((emoji) => {
      let emojiInfoDiv = document.createElement('div');
      emojiInfoDiv.className = 'emoji-info';

      let emojiCharCol = document.createElement('span');
      emojiCharCol.textContent = emoji['char'];
      emojiInfoDiv.appendChild(emojiCharCol);

      let emojiDescCol = document.createElement('span');
      emojiDescCol.textContent = formatDesc(emoji['name']);
      emojiInfoDiv.appendChild(emojiDescCol);

      resultsDiv.appendChild(emojiInfoDiv);
    });
  }
}

const searchEmojis = (query) => {
  fetch(`/api/emojis?name=${query}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(showEmojis)
  .catch(errorHandler);
};

const load = () => {
  const searchEmojisForm = document.querySelector('#search-emoji-form');
  searchEmojisForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const query = document.querySelector('#search-query').value.trim();
    if (query) {
      searchEmojis(query);
    }
  });
};
