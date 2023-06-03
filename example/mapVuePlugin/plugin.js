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
	
/*		   
			component = new Vue(App);
                        element.appendChild(component.$mount().$el);
			*/
		
			/*
			var init_lat = domain["init.lat"];
			if (typeof (init_lat) === "string") {
			    init_lat = parseFloat(init_lat);
			};
                                
			var init_lng = domain["init.lng"];
			if (typeof (init_lng) === "string") {
			    init_lng = parseFloat(init_lng);
			};
			console.log("init_lng " + init_lng)
			console.log("init_lat " + init_lat)
			component.latlng = [init_lng,init_lat];
			composition.forEach((id, index) => {
			    openmct.objects.get(id).then(function (cDomain) {
				var allTelemetry = [];
				if (cDomain.telemetry && cDomain.telemetry.values) {
				    allTelemetry = cDomain.telemetry.values.filter((value) => value.format === "float");
				}

				var first = (allTelemetry.length > 0) ? allTelemetry[0] : null;

				subscriptions[index] = openmct.telemetry.subscribe(cDomain, function (data) {
				    if (!first) {
					return;
				    }

				    var value = data[first.source || first.key];
				    //console.log(String(id.key).includes("gps"))
				    if (typeof (value) === "string") {
					value = parseFloat(value);
				    }

				    if (typeof (value) === "number" && String(id.key).includes("lat")) {
					component.lat = value;
				    }

				    if (typeof (value) === "number" && String(id.key).includes("lng")) {
					component.lon = value;
				    }

				});
			    });
			});
			*/
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
