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

  let emojiInfoList = document.createElement('ul');
  emojiInfoList.className = 'list-group list-group-flush';

  if (emojis.length === 0) {
    let emojiInfoListItem = document.createElement('li');
    emojiInfoListItem.className = 'emoji-info list-group-item';
    emojiInfoListItem.textContent = 'No results found.';
    emojiInfoList.appendChild(emojiInfoListItem);
  } else {
    emojis.forEach((emoji) => {
      let emojiInfoListItem = document.createElement('li');
      emojiInfoListItem.className = 'emoji-info list-group-item';

      let emojiCharCol = document.createElement('span');
      emojiCharCol.textContent = emoji['char'];
      emojiInfoListItem.appendChild(emojiCharCol);

      let emojiDescCol = document.createElement('span');
      emojiDescCol.textContent = formatDesc(emoji['name']);
      emojiInfoListItem.appendChild(emojiDescCol);

      emojiInfoList.appendChild(emojiInfoListItem);
    });
  }
  resultsDiv.appendChild(emojiInfoList);
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
