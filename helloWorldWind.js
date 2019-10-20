// Create a WorldWindow for the canvas.
var wwd = new WorldWind.WorldWindow("canvasOne");
/*
const Http = new XMLHttpRequest();
Http.open("GET", url);
Http.send();
Http.onreadystatechange = e => {
    console.log(Http.responseText);
};
*/
//getDiseases();

//const http = require("http");
//http.get("https//localhost:3000/diseases", res => {
// console.log(res);
//});
console.log("It works!");

wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

// Add a placemark
createPlacemark();
//addPlacemark("Teste", -12.56962, -38.533074);

var logError = function(jqXhr, text, exception) {
  console.log(
    "There was a failure retrieving the capabilities document: " +
      text +
      " exception: " +
      exception
  );
};

$.get(serviceAddress)
  .done(createLayer)
  .fail(logError);

/**
 * Get the diseases (lmao that's not a good name, but it's the object that comes from our api)
 * Plz nasa approve my project, i love you <3
 */
function getDiseases() {
  const Http = new XMLHttpRequest();
  const url = "http://localhost:3000/api/diseases";
  Http.open("GET", url);
  Http.send();
  const obj = [];
  let done = false;
  Http.onreadystatechange = e => {
    while (!done) {
      const dados = JSON.parse(e["currentTarget"]["response"]);
      if (dados && dados != "") {
        //  console.log("Arquivo total:" + dados);
        const keys = Object.keys(dados);
        for (const key of keys) {
          obj.push(dados[key]);
        }
        // console.log("Dados recebidos: " + obj);
        return obj;
        done = true;
      } else {
        //Treating errors;
        done = false;
      }
    }
  };
}

function createPlacemark() {
  const placemarkLayer = new WorldWind.RenderableLayer();
  wwd.addLayer(placemarkLayer);
  const placemarkAttributes = genericPlaceMarkAttributes();
  //  const obj = getDiseases();
  request("GET", "http://localhost:3000/api/diseases")
    .then(res => {
      // console.log("Promise is strong", res);
      const obj = [];
      const dados = JSON.parse(res["currentTarget"]["response"]);
      if (dados && dados != "" && !dados["error"]) {
        // console.log("Arquivo total:" + dados);
        const keys = Object.keys(dados);
        for (const key of keys) {
          obj.push(dados[key]);
        }
        // console.log("Dados recebidos: " + obj);
        for (const disease of Object.keys(obj)) {
          //  console.log("Resultado: " + disease);
          const countries = Object.keys(obj[disease]["countries"]);
          for (const country of countries) {
            const name = obj[disease]["name"];
            const lat = obj[disease]["countries"][country]["lat"];
            const countryName = obj[disease]["countries"][country]["name"];
            const ltn =
              obj[disease]["countries"][country]["ltn"] ||
              obj[disease]["countries"][country]["ltn"];
            const plac3mark = addPlacemark(name, lat, ltn, countryName);
            placemarkLayer.addRenderable(plac3mark);
          }
        }
      }
    })
    .catch(err => {
      // console.error(new Error(err));
    });
  return position;
}

function genericPlaceMarkAttributes() {
  const placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
  placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION,
    0.3,
    WorldWind.OFFSET_FRACTION,
    0.0
  );
  placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION,
    0.5,
    WorldWind.OFFSET_FRACTION,
    1.0
  );
  placemarkAttributes.imageSource =
    WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";
  return placemarkAttributes;
}
function addPlacemark(nome, lat, lng, countryName) {
  // console.log(
  //  "Adicionando placemark. Nome: " + nome + "lat e ltn:" + lat + " " + lng
  //);
  const posicao = new WorldWind.Position(lat, lng, 100.0);
  const placeMarkAttribute = genericPlaceMarkAttributes();
  const placemarkn = new WorldWind.Placemark(
    posicao,
    false,
    placeMarkAttribute
  );

  placemarkn.label =
    nome +
    +"\n" +
    "Lat " +
    placemarkn.position.latitude.toPrecision(4).toString() +
    "\n" +
    "Lon " +
    placemarkn.position.longitude.toPrecision(5).toString() +
    ". Country name: " +
    countryName;
  placemarkn.alwaysOnTop = true;
  return placemarkn;
}

function request(method, url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = resolve;
    xhr.onerror = reject;
    xhr.send();
  });
}
