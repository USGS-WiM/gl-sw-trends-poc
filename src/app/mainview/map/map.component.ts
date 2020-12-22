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

  constructor(private _mapService: MapService) {}

  ngOnInit() {
    this.expandCollapseDataPanel();

    this._mapService.map = L.map('map', {
      center: L.latLng(45.0522, -82.4846), //[-82.4846, 45.0522] - GL Geo Center
      zoom: 6,
      renderer: L.canvas(),
    });

    this._mapService.map.addLayer(
      this._mapService.baseMaps[this._mapService.chosenBaseLayer]
    );
    this.addLegend();
    this.addScale();

    //this._mapService.map.addLayer(this._mapService.auxLayers);

    //this._mapService.basinLayer.addTo(this._mapService.map);
    this._mapService.map.addLayer(this._mapService.auxLayers['basin']);
    //L.control.layers(this._mapService.overlayLayers).addTo(this._mapService.map)
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

  addLegend() {
    this._mapService.legend = new L.Control({ position: 'bottomright' });
    this._mapService.legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      let item = '';

      item +=
        '<div id="LegendHeader" ><span><i class="fa fa-list"></i>Explanation</span></div>' +
        '<div id="legendDiv"><br>';
      item += '<i class="site multiple-types"></i>Multiple</div>';
      div.innerHTML = item;
      div.id = 'legend';

      //  L.DomEvent.on(div, 'click', (event) => {
      //   // if click is in Explanation title, collapse/expand it.
      //   const id = event.target['id'];
      //   if ('legendHeader') {
      //       const classes = document.getElementById('legendDiv').classList;
      //       if (classes.contains('legendDiv-collapsed')) {
      //           classes.remove('legendDiv-collapsed');
      //       } else {
      //           classes.add('legendDiv-collapsed');
      //       }
      //   }
      // });
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
