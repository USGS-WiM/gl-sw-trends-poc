import { Component, OnInit } from '@angular/core';
import { MapService } from '../../shared/services/map.service';
import { Map } from 'leaflet';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';

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
      console.log(e, "hello")
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

  // When data or map is collapsed or expanded,
  // invalidate size to refresh tiles and center map
  // resizeMap() {
  //   setTimeout(() => {
  //       this._mapService.map.invalidateSize()
  //   }, 150);
  // }
}
