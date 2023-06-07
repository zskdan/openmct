define([
    './LeafletMapView'
], function (
    LeafletMapView 
) {
    return function (openmct) {
	openmct.objectViews.addProvider({
	    key: "leafletmap",
	    name: "Leaflet Map",
	    cssClass: "icon-object",
	    canView: function (domainObject) {
		return domainObject.type === 'leafletmap';
	    },
	    view: function (domainObject) {
	    /*
		let component;

                return {
		    show: function (element) {
			component = new Vue({
			    el: element,
			    components: {
				App
			    },
			    provide: {
				openmct,
				domainObject,
				composition: openmct.composition.get(domainObject)
			    },
			    template: '<app></app>'
			});
                    },
                    destroy: function (element) {
			component.$destroy();
			component = undefined;
                    }
                };
	    */
		return new LeafletMapView(domainObject, openmct);
	    }
	});
	openmct.types.addType('leafletmap', {
	    key: 'leafletmap',
	    name: 'Leaflet Map',
	    creatable: true,
	    description: 'Geopositioning for an object with latitude, longitude',
	    //key: 'plugin.leafletmap',
	    cssClass: "icon-box-round-corners",
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
});

