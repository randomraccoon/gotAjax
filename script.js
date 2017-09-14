const CHAR_BOX = document.querySelector('#character-container');
const HOUSE_BOX = document.querySelector('#house-container');
const getCharUrlByID = n => 'https://www.anapioficeandfire.com/api/characters/' + n;
const getCharUrlByName = n => 'https://www.anapioficeandfire.com/api/characters?name=' + n;
const getHouseUrlByID = n => 'https://www.anapioficeandfire.com/api/houses/' + n;

let characters = {
  'Tyrion Lannister': 1052,
  'Davos Seaworth': 1319,
  'Tormund': 2024
}

let houses = {
  'House Mormont of Bear Island': 271,
  'House Tarly of Horn Hill': 379,
  'House Seaworth of Cape Wrath': 340
}

const houseSearchToolTip = `<div class="title">Some Notable Houses:</div>House Arryn of the Eyrie:7<br>House Baelish of Harrenhal:10<br>House Baratheon of King's Landing:16<br>House Bolton of the Dreadfort:34<br>House Cerwyn of Cerwyn:66<br>House Dayne of Starfall:99<br>House Dustin of Barrowton:111<br>House Farman of Faircastle:120<br>House Frey of the Crossing:143<br>House Glover of Deepwood Motte:150<br>House Goodbrother of Hammerhorn:155<br>House Grafton of Gulltown:160<br>House Greyjoy of Pyke:169<br>House Harlaw of Harlaw:178<br>House Hayford of Hayford:189<br>House Hightower of the Hightower:195<br>House Lannister of Casterly Rock:229<br>House Nymeros Martell of Sunspear:285<br>House Reed of Greywater Watch:318<br>House Rowan of Goldengrove:326<br>House Royce of Runestone:328<br>House Stark of Winterfell:362<br>House Strickland:368<br>House Sunderland of the Three Sisters:370<br>House Targaryen of King's Landing:378<br>House Tarly of Horn Hill:379<br>House Thenn:385<br>House Tully of Riverrun:395<br>House Tyrell of Highgarden:398<br>House Vance of Wayfarer's Rest:405<br>House Waynwood of Ironoaks:417<br>House Yronwood of Yronwood:444`;



// var overlordIds = [];
// let overlords = {};
// function findMajorHouses() {
//   for (let i = 1; i <= 10; i++) {
//     let url = 'https://www.anapioficeandfire.com/api/houses?pageSize=50&page=' + i;
//     callAPI(url, (e,o) => {
//       if (e) throw e;
//       for (let h of o) {
//         if (!h.overlord.length) {
//           overlordIds.push(getIdFromUrl(h.url));
//         } else {
//           overlordIds.push(getIdFromUrl(h.overlord));
//         }
//       }
//     });
//   }
//   setTimeout(()=>{
//     overlordIds = [...new Set(overlordIds)]
//                   .map(n=>Number(n))
//                   .sort((a,b)=>a-b);
//     console.log(overlordIds);
//
//     for (let id of overlordIds) {
//       let url = getHouseUrlByID(id);
//       callAPI(url, (e,o) => {
//         if (o.currentLord.length) {
//           overlords[o.name] = id;
//         }
//       });
//     }
//   }, 10000);
// }

window.onload = () => {
  for (let key in characters) {
    callAPI(getCharUrlByID(characters[key]), (err, obj) => {
      if (err) throw err;
      displayCharacter(obj);
    });
  }
  for (let key in houses) {
    callAPI(getHouseUrlByID(houses[key]), (err, obj) => {
      if (err) throw err;
      displayHouse(obj);
    });
  }
  let tooltiptext = document.querySelector('.tooltiptext');
  tooltiptext.innerHTML = houseSearchToolTip;
  let input = document.querySelector('input');
  input.addEventListener('search',(ev)=>{
    let query = ev.target.value;
    callAPI(getHouseUrlByID(query), (err, obj) => {
      if (err) throw err;
      displayHouse(obj);
    });
    input.value = "";
  })
}

function displayCharacter(obj) {
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

function findByName(ev) {
  let name = ev.target.textContent;
  if (!characters[name]) {
    callAPI(getCharUrlByName(name), (err, obj) => {
      if (err) throw err;
      displayCharacter(obj[0]);
      characters[name] = getIdFromUrl(obj[0].url);
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

function getIdFromUrl(url) {
  let index = url.lastIndexOf('/') + 1;
  return url.slice(index);
}
