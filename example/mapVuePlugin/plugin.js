import Vue from 'vue';
import App from './App.vue';

function MapVuePlugin() {
    return function install(openmct) {
	openmct.objectViews.addProvider({
	    key: "map",
	    name: "map-provider",
	    cssClass: "icon-box",
	    canView: function (domainObject) {
		return domainObject.type === 'map';
	    },
	    view: function (domainObject) {
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

	    },
	    priority: function () {
		return 1;
	    }
	});
	openmct.types.addType('map', {
	    name: 'Map',
	    creatable: true,
	    description: 'Geopositioning for an object with latitude, longitude',
	    
	    cssClass: "icon-box-round-corners",
	    initialize(domainObject) {
		domainObject.composition = [];
		domainObject.configuration = {
		    mapController: {
			lat: 6.1757156,
			lon: 49.1193089
		    }
		};
	    },
	    form: [
		{
		    name: "Latitude Center of Map",
		    control: "textfield",
		    cssClass: "l-input-lg",
		    key: "lat",
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
		    key: "lon",
		    property: [
			"configuration", 
			"mapController",
			"lon"
		    ]
		}
	    ]
	});
    };
}

export default MapVuePlugin;
