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
const Http = new XMLHttpRequest();
const url = "http://localhost:3000/api/diseases";
Http.open("GET", url);
Http.send();

Http.onreadystatechange = e => {
  console.log(Http.responseText);
};

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
//TODO TODO TODO

// Add a polygon
var polygonLayer = new WorldWind.RenderableLayer();
wwd.addLayer(polygonLayer);

var polygonAttributes = new WorldWind.ShapeAttributes(null);
polygonAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.75);
polygonAttributes.outlineColor = WorldWind.Color.BLUE;
polygonAttributes.drawOutline = true;
polygonAttributes.applyLighting = true;

var boundaries = [];
boundaries.push(new WorldWind.Position(20.0, -75.0, 700000.0));
boundaries.push(new WorldWind.Position(25.0, -85.0, 700000.0));
boundaries.push(new WorldWind.Position(20.0, -95.0, 700000.0));

var polygon = new WorldWind.Polygon(boundaries, polygonAttributes);
polygon.extrude = true;
polygonLayer.addRenderable(polygon);

// Add a COLLADA model
var modelLayer = new WorldWind.RenderableLayer();
wwd.addLayer(modelLayer);

var position = new WorldWind.Position(10.0, -125.0, 800000.0);
var config = {
  dirPath: WorldWind.configuration.baseUrl + "examples/collada_models/duck/"
};

var colladaLoader = new WorldWind.ColladaLoader(position, config);
colladaLoader.load("duck.dae", function(colladaModel) {
  colladaModel.scale = 9000;
  modelLayer.addRenderable(colladaModel);
});

// Add WMS imagery
var serviceAddress =
  "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
var layerName = "MOD_LSTD_CLIM_M";

var createLayer = function(xmlDom) {
  var wms = new WorldWind.WmsCapabilities(xmlDom);
  var wmsLayerCapabilities = wms.getNamedLayer(layerName);
  var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(
    wmsLayerCapabilities
  );
  var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
  wwd.addLayer(wmsLayer);
};

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

function createPlacemark() {
  const placemarkLayer = new WorldWind.RenderableLayer();
  wwd.addLayer(placemarkLayer);
  const placemarkAttributes = genericPlaceMarkAttributes();

  const position = new WorldWind.Position(-12.96962, -38.513074, 100.0);
  const position2 = new WorldWind.Position(-12.949055, -38.410343, 50.0);
  const placemark = new WorldWind.Placemark(
    position,
    false,
    placemarkAttributes
  );
  const placemark2 = new WorldWind.Placemark(
    position2,
    false,
    placemarkAttributes
  );

  placemark2.label =
    "Casa de Geruso: \n" +
    "Lat " +
    placemark.position.latitude.toPrecision(4).toString() +
    "\n" +
    "Lon " +
    placemark.position.longitude.toPrecision(5).toString();

  placemark.label =
    "Nossa localização: \n" +
    "Lat " +
    placemark.position.latitude.toPrecision(4).toString() +
    "\n" +
    "Lon " +
    placemark.position.longitude.toPrecision(5).toString();
  placemark.alwaysOnTop = true;
  placemark2.alwaysOnTop = true;
  placemarkLayer.addRenderable(placemark2);
  placemarkLayer.addRenderable(placemark);
  const neuPlaceMark = addPlacemark("Teste", -10, -20);
  const neu2PlaceMark = addPlacemark("UCSAL", -12.948226, -38.413164);
  placemarkLayer.addRenderable(neu2PlaceMark);
  placemarkLayer.addRenderable(neuPlaceMark);
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
function addPlacemark(nome, lat, lng) {
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
    placemarkn.position.longitude.toPrecision(5).toString();
  placemarkn.alwaysOnTop = true;
  return placemarkn;
}
