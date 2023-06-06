<template>
  <l-map
    :center="[lon,lat]"
    :zoom="zoom"
    class="map"
    ref="map"
    @update:zoom="zoomUpdated"
    @update:center="centerUpdated"
  >
    <l-tile-layer :url="url" />
    <l-marker :lat-lng="[lon,lat]" :icon="icon"/>
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet';
import { icon } from 'leaflet';
import myIcon from './images/rocket.png';

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
  inject: ['openmct', 'domainObject', 'composition'],
  data () {
      let mapController = this.domainObject.configuration.mapController;
    return {
      zoom: 20,
      lon: mapController.lon,
      lat: mapController.lat,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      icon: icon({
	iconUrl: myIcon,
	iconSize: [64, 64],
	})
    };
  },
  watch: {
    curVal(newCurValue) {
	if (this.digits < newCurValue.toString().length) {
	    this.digits = newCurValue.toString().length;
	}
    }
  },
  mounted() {
      this.composition.on('add', this.addedToComposition);
      this.composition.on('remove', this.removeTelemetryObject);

      this.composition.load();

      this.openmct.time.on('bounds', this.refreshData);
      this.openmct.time.on('timeSystem', this.setTimeSystem);
  },
  destroyed() {
      this.composition.off('add', this.addedToComposition);
      this.composition.off('remove', this.removeTelemetryObject);

      if (this.unsubscribe) {
	  this.unsubscribe();
      }

      this.openmct.time.off('bounds', this.refreshData);
      this.openmct.time.off('timeSystem', this.setTimeSystem);
  },
  methods: {
        addTelemetryObjectAndSubscribe(domainObject) {
            this.telemetryObject = domainObject;
            this.request();
            this.subscribe();
        },
        addedToComposition(domainObject) {
            if (this.telemetryObject) {
                this.confirmRemoval(domainObject);
            } else {
                this.addTelemetryObjectAndSubscribe(domainObject);
            }
        },
	confirmRemoval(domainObject) {
	    const dialog = this.openmct.overlays.dialog({
		    iconClass: 'alert',
		    message: 'This action will replace the current telemetry source. Do you want to continue?',
			buttons: [
			{
			    label: 'Ok',
			    emphasis: true,
			    callback: () => {
				this.removeFromComposition();
				this.removeTelemetryObject();
				this.addTelemetryObjectAndSubscribe(domainObject);
				dialog.dismiss();
			    }
			},
			{
			    label: 'Cancel',
			    callback: () => {
				this.removeFromComposition(domainObject);
				dialog.dismiss();
			    }
			}
			]
		    });
	    },
        removeFromComposition(telemetryObject = this.telemetryObject) {
	    let composition = this.domainObject.composition.filter(id =>
		!this.openmct.objects.areIdsEqual(id, telemetryObject.identifier)
	    );

	    this.openmct.objects.mutate(this.domainObject, 'composition', composition);
        },
        refreshData(bounds, isTick) {
	    if (!isTick) {
                this.request();
            }
        },
        removeTelemetryObject() {
            if (this.unsubscribe) {
                this.unsubscribe();
                this.unsubscribe = null;
            }
        },
        request(domainObject = this.telemetryObject) {
            this.metadata = this.openmct.telemetry.getMetadata(domainObject);
            this.formats = this.openmct.telemetry.getFormatMap(this.metadata);
            const LimitEvaluator = this.openmct.telemetry.getLimits(domainObject);
            LimitEvaluator.limits().then(this.updateLimits);

            this.valueKey = this
                .metadata
                .valuesForHints(['range'])[0].source;

            this.openmct
                .telemetry
                .request(domainObject, { strategy: 'latest' })
                .then(values => {
                    const length = values.length;
                    this.updateValue(values[length - 1]);
                });

            this.units = this.metadata.value(this.valueKey).unit || '';
        },
        setTimeSystem(timeSystem) {
            this.activeTimeSystem = timeSystem;
        },
        subscribe(domainObject = this.telemetryObject) {
            this.unsubscribe = this.openmct
                .telemetry
                .subscribe(domainObject, this.updateValue.bind(this));
        },
	zoomUpdated (zoom) {
	    this.zoom = zoom;
	},
	centerUpdated (center) {
	    this.center = center;
	}
    }
}
</script>

