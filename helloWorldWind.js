// Create a WorldWindow for the canvas.
var wwd = new WorldWind.WorldWindow("canvasOne");
console.log("It works!");

//Adding layers
wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

// Add a placemark
createPlacemark();

/**
 * Create placemarks automatically from our local loopback api.
 */
function createPlacemark() {
  const placemarkLayer = new WorldWind.RenderableLayer();
  wwd.addLayer(placemarkLayer);
  const placemarkAttributes = genericPlaceMarkAttributes();
  //Get the data from the api
  request("GET", "http://localhost:3000/api/diseases")
    .then(res => {
      const obj = [];
      const dados = JSON.parse(res["currentTarget"]["response"]);
      if (dados && dados != "" && !dados["error"]) {
        const keys = Object.keys(dados);
        for (const key of keys) {
          obj.push(dados[key]);
        }
        for (const disease of Object.keys(obj)) {
          const countries = Object.keys(obj[disease]["countries"]);
          for (const country of countries) {
            const name = obj[disease]["name"];
            const lat = obj[disease]["countries"][country]["lat"];
            const countryName = obj[disease]["countries"][country]["name"];
            const ltn =
              obj[disease]["countries"][country]["ltn"] ||
              obj[disease]["countries"][country]["ltn"];
            const plac3mark = addPlacemark(name, lat, ltn, countryName);
            //add placemark to the map
            placemarkLayer.addRenderable(plac3mark);
          }
        }
      }
    })
    .catch(err => {
      // console.error(new Error(err));
    });
}
/**
 * Create a generic placeMarkAttribute.
 */
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
/**
 * Add the placemark with the followings params
 * @param {string} nome is the name of the disease
 * @param {number} lat is the latitude of the disease
 * @param {number} lng is the longitude of the disease
 * @param {string} countryName is the name of the country in which the disease has occurred;
 */
function addPlacemark(nome, lat, lng, countryName) {
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
/**
 * Simple HTTP request, with the followings params:
 * @param {string} method  for the method type
 * @param {string} url  for the api's url
 */
function request(method, url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = resolve;
    xhr.onerror = reject;
    xhr.send();
  });
}
