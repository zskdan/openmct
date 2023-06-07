define([
    './LeafletMap.vue',
    'vue'
], function (
    App,
    Vue
) {
    Vue = Vue.default || Vue;
    let component;
    function LeafletMapView(domainObject, openmct) {
	this.domainObject = domainObject;
	this.openmct = openmct;
        this.objectAPI = openmct.objects;
    }

    LeafletMapView.prototype.show = function (element) {
	component = new Vue({
	    el: element,
	    components: {
		App
	    },
	    provide: {
		openmct,
		element,
		composition: openmct.composition.get(element)
	    },
	    render: h => h(App), 
	    template: '<app></app>'
	});
    };

    LeafletMapView.prototype.destroy = function () {
    	if (component) {
	    component.$destroy();
	    component = undefined;
	}
    };

    LeafletMapView.prototype.render = function () {
    };

    return LeafletMapView;
});
