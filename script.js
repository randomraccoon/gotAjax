const CHAR_BOX = document.querySelector('#character-container');
const HOUSE_BOX = document.querySelector('#house-container');
const TOOL_TIP_TEXT = document.querySelector('.tooltiptext');
const QUERY_TYPE_SELECTOR = document.querySelector('select');
const QUERY_INPUT = document.querySelector('input');

const getCharUrlByID = n => 'https://www.anapioficeandfire.com/api/characters/' + n;
const getCharUrlByName = n => 'https://www.anapioficeandfire.com/api/characters?name=' + n;
const getHouseUrlByID = n => 'https://www.anapioficeandfire.com/api/houses/' + n;
const getIdFromUrl = url => url.slice(url.lastIndexOf('/') + 1);

let startingCharacters = {
  'Tyrion Lannister': 1052,
  'Davos Seaworth': 1319,
  'Tormund': 2024
}
let characters = {};

let startingHouses = {
  'House Mormont of Bear Island': 271,
  'House Tarly of Horn Hill': 379,
  'House Seaworth of Cape Wrath': 340
}

let houses = {};

const houseSearchToolTip = `<div class="title">Some Notable Houses (1-444):</div>House Arryn of the Eyrie:7<br>House Baelish of Harrenhal:10<br>House Baratheon of King's Landing:16<br>House Bolton of the Dreadfort:34<br>House Cerwyn of Cerwyn:66<br>House Dayne of Starfall:99<br>House Dustin of Barrowton:111<br>House Farman of Faircastle:120<br>House Frey of the Crossing:143<br>House Glover of Deepwood Motte:150<br>House Goodbrother of Hammerhorn:155<br>House Grafton of Gulltown:160<br>House Greyjoy of Pyke:169<br>House Harlaw of Harlaw:178<br>House Hayford of Hayford:189<br>House Hightower of the Hightower:195<br>House Lannister of Casterly Rock:229<br>House Nymeros Martell of Sunspear:285<br>House Reed of Greywater Watch:318<br>House Rowan of Goldengrove:326<br>House Royce of Runestone:328<br>House Stark of Winterfell:362<br>House Strickland:368<br>House Sunderland of the Three Sisters:370<br>House Targaryen of King's Landing:378<br>House Tarly of Horn Hill:379<br>House Thenn:385<br>House Tully of Riverrun:395<br>House Tyrell of Highgarden:398<br>House Vance of Wayfarer's Rest:405<br>House Waynwood of Ironoaks:417<br>House Yronwood of Yronwood:444`;

const charSearchToolTip = `<div class="title">Notable Characters (1-2138):</div>Arya Stark:148<br>Brandon Stark:208<br>Brienne of Tarth:216<br>Bronn:217<br>Cersei Lannister:238<br>Daenerys Targaryen:1303<br>Davos Seaworth:1319<br>Drogo:1346<br>Eddard Stark:339<br>Gregor Clegane:1442<br>Jaime Lannister:529<br>Jaqen H'ghar:1532<br>Joffrey Baratheon:565<br>Jon Snow:583<br>Jorah Mormont:1560<br>Margaery Tyrell:16<br>Melisandre:743<br>Missandei:1709<br>Oberyn Nymeros Martell:1770<br>Petyr Baelish:823<br>Ramsay Snow:849<br>Robert I Baratheon:901<br>Samwell Tarly:954<br>Sandor Clegane:955<br>Sansa Stark:957<br>Stannis Baratheon:1963<br>Theon Greyjoy:1022<br>Tommen Baratheon:1029<br>Tyrion Lannister:1052<br>Tywin Lannister:27<br>Varys:2069<br>Viserys Targaryen:1079<br>Walder Frey:1093<br>Wun Weg Wun Dar Wun:2118<br>Ygritte:2126`;

window.onload = () => {
  for (let key in startingCharacters) {
    callAPI(getCharUrlByID(startingCharacters[key]), (err, obj) => {
      if (err) throw err;
      displayCharacter(obj);
    });
  }
  for (let key in startingHouses) {
    callAPI(getHouseUrlByID(startingHouses[key]), (err, obj) => {
      if (err) throw err;
      displayHouse(obj);
    });
  }

  TOOL_TIP_TEXT.innerHTML = charSearchToolTip;
  QUERY_INPUT.addEventListener('search', handleSearch);
  QUERY_TYPE_SELECTOR.addEventListener('change', changeInputType);
}

function displayCharacter(obj) {
  if (characters[obj.name]) return;
  characters[obj.name] = getIdFromUrl(obj.url);

  let container = document.createElement('div');
  container.classList.add('card');

  let h3 = document.createElement('h3');
  h3.textContent = obj.name;
  container.appendChild(h3);

  let titles = document.createElement('h4');
  titles.textContent = 'Titles: '
  titles.classList.add('list-label');
  container.appendChild(titles);

  if (obj.titles[0].length) {
    let ul = document.createElement('ul');
    for (let title of obj.titles) {
      let li = document.createElement('li');
      li.textContent = title;
      ul.appendChild(li);
    }
    container.appendChild(ul);
  } else {
    titles.innerHTML += `<span>(None)</span>`
  }

  let spouse = document.createElement('h4');
  spouse.textContent = 'Spouse: ';
  if (obj.spouse.length) {
    callAPI(obj.spouse, (e, o) => {
      if (e) throw e;
      insertName(o.name, spouse);
    });
  } else {
    spouse.innerHTML += `<span>(None)</span>`;
  }
  container.appendChild(spouse);

  CHAR_BOX.appendChild(container);
}

function displayHouse(obj) {
  if (houses[obj.name]) return;
  houses[obj.name] = getIdFromUrl(obj.url);

  let container = document.createElement('div');
  container.classList.add('card');

  let h3 = document.createElement('h3');
  h3.textContent = obj.name;
  container.appendChild(h3);

  let region = document.createElement('h4');
  region.innerHTML = `Region: <span>${obj.region}</span>`
  container.appendChild(region);

  let lord = document.createElement('h4');
  lord.textContent = 'Current Lord: ';
  if (obj.currentLord.length) {
    callAPI(obj.currentLord, (e, o) => {
      if (e) throw e;
      insertName(o.name, lord);
    });
  } else {
    lord.innerHTML += `<span>(None)</span>`
  }
  container.appendChild(lord);

  let heir = document.createElement('h4');
  heir.textContent = 'Heir: ';
  if (obj.heir.length) {
    callAPI(obj.heir, (e, o) => {
      if (e) throw e;
      insertName(o.name, heir);
    });
  } else {
    heir.innerHTML += `<span>(None)</span>`
  }
  container.appendChild(heir);

  HOUSE_BOX.appendChild(container);
}

function callAPI(url, doneFunc) {
  let xhr = new XMLHttpRequest();
  xhr.onload = () => {
    let obj = JSON.parse(xhr.response);
    // console.log(obj);
    doneFunc(null, obj);
  };
  xhr.onerror = () => {
    doneFunc(xhr.response);
  };
  xhr.open('GET', url);
  xhr.send();
}

function changeInputType(ev) {
  let queryType = ev.target.value;
  if (queryType === 'house') {
    TOOL_TIP_TEXT.innerHTML = houseSearchToolTip;
    QUERY_INPUT.placeholder = 'e.g. 16';
  } else {
    TOOL_TIP_TEXT.innerHTML = charSearchToolTip;
    QUERY_INPUT.placeholder = 'e.g. 1319';
  }
}

function handleSearch(ev) {
  let query = ev.target.value;
  let queryType = QUERY_TYPE_SELECTOR.value;
  if (queryType === 'house') {
    callAPI(getHouseUrlByID(query), (err, obj) => {
      if (err) throw err;
      displayHouse(obj);
    });
  } else { //queryType === 'character'
    callAPI(getCharUrlByID(query), (err, obj) => {
      if (err) throw err;
      displayCharacter(obj);
    });
  }
  ev.target.value = "";
}

function findByName(ev, nameStr) {
  let name = ev ? ev.target.textContent : nameStr;
  if (!characters[name]) {
    callAPI(getCharUrlByName(name), (err, obj) => {
      if (err) throw err;
      displayCharacter(obj[0]);
    });
  }
}

function insertName(name, element) {
  let span = document.createElement('span');
  span.addEventListener('click', findByName);
  span.classList.add('link');
  span.textContent = name;
  element.appendChild(span);
}

// This function was used to created the houses tooltip.
// function findMajorHouses() {
//   var overlordIds = [];
//   let overlords = {};
//   let pendingCount = 0;
//   for (let i = 1; i <= 10; i++) {
//     let url = 'https://www.anapioficeandfire.com/api/houses?pageSize=50&page=' + i;
//     callAPI(url, (e, o) => {
//       if (e) throw e;
//       for (let h of o) {
//         if (!h.overlord.length) {
//           overlordIds.push(getIdFromUrl(h.url));
//         } else {
//           overlordIds.push(getIdFromUrl(h.overlord));
//         }
//         pendingCount--;
//       }
//     });
//     pendingCount++;
//   }
//   let timer = setInterval(() => {
//     if (!pendingCount) {
//       overlordIds = [...new Set(overlordIds)]
//         .map(n => Number(n))
//         .sort((a, b) => a - b);
//       console.log(overlordIds);
//
//       for (let id of overlordIds) {
//         let url = getHouseUrlByID(id);
//         callAPI(url, (e, o) => {
//           if (o.currentLord.length) {
//             overlords[o.name] = id;
//           }
//           pendingCount--;
//         });
//         pendingCount++;
//       }
//       clearInterval(timer);
//     }
//   }, 100);
//   timer = setInterval(() => {
//     if (!pendingCount) {
//       console.log(overlords);
//       clearInterval(timer);
//     }
//   }, 100)
// }
//
// This
// function was used to create the character tooltip.
// function getMainCharacters() {
//   const charNameList = ['Daenerys Targaryen', 'Jon Snow', 'Cersei Lannister', 'Walder Frey', 'Wun Weg Wun Dar Wun', 'Jorah Mormont', "Jaqen H'ghar", 'Ygritte', 'Tommen Baratheon', 'Davos Seaworth', 'Bronn', 'Petyr Baelish', 'Robert I Baratheon', 'Gregor Clegane', 'Missandei', 'Drogo', 'Viserys Targaryen', 'Brandon Stark', 'Oberyn Nymeros Martell', 'Stannis Baratheon', 'Theon Greyjoy', 'Melisandre', 'Sandor Clegane', 'Varys', 'Samwell Tarly', 'Margaery Tyrell', 'Jaime Lannister', 'Tywin Lannister', 'Ramsay Snow', 'Brienne of Tarth', 'Arya Stark', 'Eddard Stark', 'Joffrey Baratheon', 'Cersei Lannister', 'Sansa Stark', 'Tyrion Lannister'];
//
//   let majorCharacters = {};
//   let foundNames = [];
//   let pendingCount = 0
//   for (let char of charNameList) {
//     callAPI(getCharUrlByName(char), (err, obj) => {
//       if (obj.length > 1) {
//         if (char === 'Daenerys Targaryen') {
//           foundNames.push(obj[1]);
//         } else if (char === 'Walder Frey') {
//           foundNames.push(obj[4]);
//         } else if (char === 'Brandon Stark') {
//           foundNames.push(obj[2]);
//         }
//       } else {
//         foundNames.push(obj[0]);
//
//       }
//       pendingCount--;
//     });
//     pendingCount++;
//   }
//   let timer = setInterval(() => {
//     if (!pendingCount) {
//       clearInterval(timer);
//       for (let obj of foundNames) {
//         majorCharacters[obj.name] = +getIdFromUrl(obj.url)
//       }
//       console.log(majorCharacters);
//     }
//   }, 100)
// }
