import { Component, OnInit } from '@angular/core';
import { MapService } from '../../shared/services/map.service';
import { Map } from 'leaflet';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { polygon, point } from '@turf/helpers';

@Component({
  selector: 'app-mainview-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less'],
})
export class MapComponent implements OnInit {
  collapsedMap: any;
  collapsedDataPanel: any;
  legendExpanded = true;
  mapZoomLevel: any;
  mapScale: any;
  latitude: any;
  longitude: any;
  layerNames: any[] = [];
  previousZoom: any;
  currentZoom: any;

  constructor(private _mapService: MapService) {}

  ngOnInit() {
    this.expandCollapseDataPanel();
    //init map
    this._mapService.map = L.map('map', {
      center: L.latLng(45.522, -82.4846), //[-82.4846, 45.0522] - GL Geo Center
      zoom: 6,
      renderer: L.canvas(),
    });
    //basemaps
    this._mapService.map.addLayer(
      this._mapService.baseMaps[this._mapService.chosenBaseLayer]
    );
    //add legend/scale
    this.addLegend();
    this.addScale();
    this.addTrendPoints();
    this.getZooms();

    //add aux layers
    this._mapService.map.addLayer(
      this._mapService.auxLayers[this._mapService.chosenAuxLayer[0]]
    );
    this._mapService.map.addLayer(
      this._mapService.auxLayers[this._mapService.chosenAuxLayer[1]]
    );
    //console.log(this._mapService.auxLayers)
  }

  expandCollapseDataPanel() {
    this._mapService.DataPanelCollapse.subscribe((collapse: any) => {
      this.collapsedDataPanel = collapse;
    });

    this._mapService.dataPanelCollapseSubject.next(!this.collapsedDataPanel);

    // When data or map is collapsed or expanded,
    // invalidate size to refresh tiles and center map
    setTimeout(() => {
      this._mapService.map.invalidateSize();
    }, 150);
  }

  addScale() {
    this._mapService.map.whenReady(() => {
      //get the initial zoom of the map, should load on 6
      this.mapZoomLevel = this._mapService.map.getZoom();
      this.mapScale = this.scaleLookup(this.mapZoomLevel);
      //get the lat/lng coodinates of the center of the map
      const initMapCenter = this._mapService.map.getCenter();
      //round to 4 decimal places
      this.latitude = initMapCenter.lat.toFixed(4);
      this.longitude = initMapCenter.lng.toFixed(4);
    });

    //after zooming in/out, the zoom level/scale update
    this._mapService.map.on('zoomend', () => {
      const mapZoom = this._mapService.map.getZoom();
      const mapScale = this.scaleLookup(mapZoom);
      this.mapScale = mapScale;
      this.mapZoomLevel = mapZoom;
    });

    //lat/lng should updates as your mouse moves around
    this._mapService.map.on('mousemove', (cursorPosition) => {
      if ((cursorPosition as L.LeafletMouseEvent).latlng !== null) {
        this.latitude = (cursorPosition as L.LeafletMouseEvent).latlng.lat.toFixed(
          4
        );
        this.longitude = (cursorPosition as L.LeafletMouseEvent).latlng.lng.toFixed(
          4
        );
      }
    });
  }

  scaleLookup(mapZoom: any): any {
    switch (mapZoom) {
      case 19:
        return '1,128';
      case 18:
        return '2,256';
      case 17:
        return '4,513';
      case 16:
        return '9,027';
      case 15:
        return '18,055';
      case 14:
        return '36,111';
      case 13:
        return '72,223';
      case 12:
        return '144,447';
      case 11:
        return '288,895';
      case 10:
        return '577,790';
      case 9:
        return '1,155,581';
      case 8:
        return '2,311,162';
      case 7:
        return '4,622,324';
      case 6:
        return '9,244,649';
      case 5:
        return '18,489,298';
      case 4:
        return '36,978,596';
      case 3:
        return '73,957,193';
      case 2:
        return '147,914,387';
      case 1:
        return '295,828,775';
      case 0:
        return '591,657,550';
    }
  }
  
  getActiveLayers() {
    //this.layerNames = [];
    this._mapService.map.on('layeradd', e => {
      //console.log(e, "hello")
      if(e.layer._leaflet_id === this._mapService.auxLayers.basin._leaflet_id || 
        e.layer._leaflet_id === this._mapService.auxLayers.basinArea._leaflet_id ||
        e.layer._leaflet_id === this._mapService.auxLayers.watersheds._leaflet_id ||
        e.layer._leaflet_id === this._mapService.auxLayers.gageSites._leaflet_id ||
        e.layer._leaflet_id === this._mapService.auxLayers.majorStreamlines._leaflet_id) {
        console.log("true")
        const layerNames: string | any[] = [];
        if("sidebarAuxLayers") {
          const children = document.getElementsByTagName('input');
          for (let i=0; i<children.length; i++) {
            if(children[i].checked) {
              layerNames.push((children[i].nextSibling as HTMLInputElement).nodeValue);
            }
          }
        }
        console.log(layerNames)
      }
    })
  }
  
  addLegend() {
    this.getActiveLayers();
    
    this._mapService.legend = new L.Control({ position: 'topright'});
    this._mapService.legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      L.DomEvent.on(div, 'click', function() {
        //if click is in Explanation title, collapse/expand it.
        if("legendHeader") {
          const classes = document.getElementById("legendDiv")?.classList;
          if (classes?.contains("legendDiv-collapsed")) {
            classes.remove("legendDiv-collapsed");
          } else {
            classes?.add("legendDiv-collapsed");
          }
        }
      });
      const sidebar = L.DomUtil.get('sidebarAuxLayers');
      console.log(sidebar)
      // L.DomEvent.on(sidebar, 'click', function() {

      // })

      //Get layer names for legend
      console.log(this.layerNames)    
      const activeLayers = this.layerNames;
      console.log(activeLayers)
      //const layerNames: string | any[] = [];
      let item = '';

      item += '<div id="legendHeader"><i class="fa fa-list"></i>Explanation</div>' +
      '<div id="legendDiv">';

      // if("sidebarAuxLayers") {
      //   const children = document.getElementsByTagName('input');
      //   for (let i=0; i<children.length; i++) {
      //     if(children[i].checked) {
      //       layerNames.push((children[i].nextSibling as HTMLInputElement).nodeValue);
      //     }
      //   }
      // }

      // for (let i=0; i<activeLayers.length; i++) {
      //   item += activeLayers[i] + '<br>';
      // }
      div.innerHTML = item;
      div.id = 'legend';

      return div;
    };
    this._mapService.legend.addTo(this._mapService.map);
  }

  addTrendPoints() {
    let wrtdsTrendsBasin = esri.featureLayer({
      url:
        'https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/swTrendSites/MapServer/2',
      onEachFeature: function (feature: any, layer: any) {
        //Create very simplified outline of basin
        let simpBasin = polygon([
          [
            [51.19, -90.9],
            [50.31, -90.79],
            [48.69, -90.85],
            [47.72, -93.27],
            [46, -93.27],
            [45.98, -89.05],
            [43.72, -89.41],
            [42.51, -87.51],
            [41.53, -87.05],
            [40.38, -84.38],
            [41.26, -80.86],
            [41.76, -80.57],
            [42.42, -79.05],
            [42.21, -76.83],
            [42.33, -75.97],
            [43.02, -76.0],
            [51.19, -90.9],
          ],
        ]);
        //feature coordinates
        let coords = point([
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
        ]);
        //is the feature inside the basin?
        let pointInBasin = booleanPointInPolygon(coords, simpBasin);
        //if the feature is inside of the basin, plot it
        if (pointInBasin) {
          if (feature.properties['wrtds_trends_wm_new.likeC'] <= -0.8500001) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-inverse-triangle wmm-black wmm-icon-inverse-triangle wmm-size-20 ',
              })
            );
          } else if (
            feature.properties['wrtds_trends_wm_new.likeC'] > -0.8500001 &&
            feature.properties['wrtds_trends_wm_new.likeC'] <= -0.700001
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-inverse-triangle wmm-white wmm-icon-inverse-triangle wmm-size-20 ',
              })
            );
          } else if (
            feature.properties['wrtds_trends_wm_new.likeC'] > -0.700001 &&
            feature.properties['wrtds_trends_wm_new.likeC'] <= 0.7
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-circle wmm-yellow wmm-icon-circle wmm-icon-black wmm-size-20',
              })
            );
          } else if (
            feature.properties['wrtds_trends_wm_new.likeC'] > 0.7 &&
            feature.properties['wrtds_trends_wm_new.likeC'] <= 0.849999
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-triangle wmm-red-hollow wmm-icon-triangle wmm-size-20',
              })
            );
          } else if (
            feature.properties['wrtds_trends_wm_new.likeC'] > 0.849999
          ) {
            layer.setIcon(
              L.divIcon({
                className: 'wmm-triangle wmm-red wmm-icon-triangle wmm-size-20',
              })
            );
            //There are lots of sites that don't have a 'wrtds_trends_wm_new.likeC', but they do have
            //'likeCDown' and 'likeCUp'. Not sure what to do with these, so skipping them for now.
          } else {
            layer.setIcon(
              L.divIcon({
                className: 'wmm-triangle',
              })
            );
            /* There are so many of these that, for now, I'm not flagging them
            console.log(
              'Skipped site ' +
                feature.properties['wrtds_trends_wm_new.likeC'] +
                ' due to null wrtds_trends_wm_new.likeC'
            );
            */
          }
        } else {
          //If point is outside of the basin, plot an invisible marker
          //There is probably a way to skip this feature instead of adding a blank one
          layer.setIcon(
            L.divIcon({
              className: 'wmm-triangle',
            })
          );
        }
      },
    });
    let allEcoTrendsBasin = esri.featureLayer({
      url:
        'https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/swTrendSites/MapServer/1',
      onEachFeature: function (feature: any, layer: any) {
        let simpBasin = polygon([
          [
            [51.19, -90.9],
            [50.31, -90.79],
            [48.69, -90.85],
            [47.72, -93.27],
            [46, -93.27],
            [45.98, -89.05],
            [43.72, -89.41],
            [42.51, -87.51],
            [41.53, -87.05],
            [40.38, -84.38],
            [41.26, -80.86],
            [41.76, -80.57],
            [42.42, -79.05],
            [42.21, -76.83],
            [42.33, -75.97],
            [43.02, -76.0],
            [51.19, -90.9],
          ],
        ]);
        //feature coordinates
        let coords = point([
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
        ]);
        //is the feature inside the basin?
        let pointInBasin = booleanPointInPolygon(coords, simpBasin);
        //if the feature is inside of the basin, plot it
        if (pointInBasin) {
          if (feature.properties.EcoTrendResults_likelihood <= -0.8500001) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-inverse-triangle wmm-black wmm-icon-inverse-triangle wmm-size-20 ',
              })
            );
          } else if (
            feature.properties.EcoTrendResults_likelihood > -0.8500001 &&
            feature.properties.EcoTrendResults_likelihood <= -0.700001
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-inverse-triangle wmm-white wmm-icon-inverse-triangle wmm-size-20 ',
              })
            );
          } else if (
            feature.properties.EcoTrendResults_likelihood > -0.700001 &&
            feature.properties.EcoTrendResults_likelihood <= 0.7
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-circle wmm-yellow wmm-icon-circle wmm-icon-black wmm-size-20',
              })
            );
          } else if (
            feature.properties.EcoTrendResults_likelihood > 0.7 &&
            feature.properties.EcoTrendResults_likelihood <= 0.849999
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-triangle wmm-red-hollow wmm-icon-triangle wmm-size-20',
              })
            );
          } else if (feature.properties.EcoTrendResults_likelihood > 0.849999) {
            layer.setIcon(
              L.divIcon({
                className: 'wmm-triangle wmm-red wmm-icon-triangle wmm-size-20',
              })
            );
          } else {
            layer.setIcon(
              L.divIcon({
                className: 'wmm-triangle',
              })
            );
            console.log(
              'Skipped site ' +
                feature.properties
                  .EcoSiteSummary_no_headers_csv_Ecology_site_ID +
                ' due to null EcoTrendResults_likelihood'
            );
          }
        } else {
          //If point is outside of the basin, plot an invisible marker
          //There is probably a way to skip this feature instead of adding a blank one
          layer.setIcon(
            L.divIcon({
              className: 'wmm-triangle',
            })
          );
        }
      },
    });
    //Add the trend points that are inside of the basin to the map on load
    wrtdsTrendsBasin.addTo(this._mapService.map);
    allEcoTrendsBasin.addTo(this._mapService.map);
  }

  getZooms() {
    //Get the value of the previous zoom
    this._mapService.map.on('zoomstart', () => {
      this.previousZoom = this._mapService.map.getZoom();
    });
    let riverID = document.getElementById('streamRiver') as HTMLInputElement;
    //Get the value of the current zoom
    this._mapService.map.on('zoomend', () => {
      this.currentZoom = this._mapService.map.getZoom();
      //when zoom greater than 12, enable rivers and streams checkbox
      //add the layer if the checkbox is checked
      if (this.currentZoom >= 12) {
        riverID.disabled = false;
        if (
          riverID.checked === true &&
          this._mapService.map.hasLayer(
            this._mapService.auxLayers['majorStreamlines']
          ) === false
        ) {
          this._mapService.map.addLayer(
            this._mapService.auxLayers['majorStreamlines']
          );
        }
      }
      //if zoom is less than 12, rivers and streams checkbox is disabled
      //layer is removed
      if (this.currentZoom < 12) {
        riverID.disabled = true;
        this._mapService.map.removeLayer(
          this._mapService.auxLayers['majorStreamlines']
        );
      }
      if (
        this.previousZoom == 12 &&
        this.currentZoom == 11 &&
        riverID.checked === true
      ) {
        console.log('Rivers and Streams layer removed');
      }
    });
  }

  // When data or map is collapsed or expanded,
  // invalidate size to refresh tiles and center map
  // resizeMap() {
  //   setTimeout(() => {
  //       this._mapService.map.invalidateSize()
  //   }, 150);
  // }
}
