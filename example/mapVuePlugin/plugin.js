import LeafletMapView from './LeafletMapView';

function MapVuePlugin() {
    'use strict';
    return function install(openmct) {
	console.log("ZSK:install");
	openmct.objectViews.addProvider({
	    name: "Leaflet Map",
	    key: "plugin.leafletmap",
	    cssClass: "icon-object",
	    canView: function (domainObject) {
		console.log("ZSK:canview:"+(domainObject.type === 'plugin.leafletmap'));
		return domainObject.type === 'plugin.leafletmap';
	    },
	    view: function (domainObject) {
		console.log("ZSK:view");
		return new LeafletMapView(domainObject, openmct, document);
	    }
	});

	openmct.types.addType('plugin.leafletmap', {
	    name: 'Leaflet Map',
	    key: 'plugin.leafletmap',
	    cssClass: "icon-box-round-corners",
	    description: 'Geopositioning for an object with latitude, longitude',
	    creatable: true,
	    initialize(domainObject) {
		domainObject.composition = [];
		domainObject.configuration = {
		    mapController: {
			lon: 49.1193089,
			lat: 6.1757156
		    }
		};
	    },
	    form: [
		{
		    name: "Latitude Center of Map",
		    control: "textfield",
		    cssClass: "l-input-lg",
		    key: "init.lat",
		    property: [
			"configuration", 
			"mapController",
			"lat"
		    ]
		},
		{
		    name: "Longitude Center of Map",
		    control: "textfield",
		    cssClass: "l-input-lg",
		    key: "init.lon",
		    property: [
			"configuration", 
			"mapController",
			"lon"
		    ]
		},
		{
		    key: "lon",
		    name: "Longitude",
		    control: "textfield",
		    required: true
		},
		{
		    key: "lat",
		    name: "Latitude",
		    control: "textfield",
		    required: true
		},
		{
		    key: "namespace",
		    name: "Namespace",
		    control: "textfield",
		    required: true
		},
	    ]
	});
    };
}

export default MapVuePlugin;
