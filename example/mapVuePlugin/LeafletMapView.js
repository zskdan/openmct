import App from './LeafletMap.vue';
import Vue from 'vue';

export default class LeafletMapView {
    Vue = Vue.default || Vue;
    let component;
    function LeafletMapView(domainObject, openmct, document) {
	this.domainObject = domainObject;
	this.openmct = openmct;
        this.objectAPI = openmct.objects;
	this.document = document;
    }

    LeafletMapView.prototype.show = function (domainObject) {
    	console.log("ZSK:show");
	component = new Vue({
	    el: domainObject,
	    components: {
		LeafletMap
	    },
	    provide: {
		openmct,
		domainObject,
		composition: openmct.composition.get(domainObject)
	    }
	});
    };

    LeafletMapView.prototype.destroy = function () {
	component.$destroy();
	component = undefined;
    };
    return LeafletMapView;
}
