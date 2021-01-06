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
  //collapsedMap: any;
  //collapsedDataPanel: any;
  //for displaying the lat/lng and zoom level
  mapZoomLevel: any;
  mapScale: any;
  latitude: any;
  longitude: any;
  //most recent zoom level and current zoom level
  previousZoom: any;
  currentZoom: any;

  constructor(public _mapService: MapService) {}

  ngOnInit() {
    //center map on the Great Lakes basin
    this._mapService.map = L.map('map', {
      center: L.latLng(45.522, -82.4846), //[-82.4846, 45.0522] - GL Geo Center
      zoom: 6,
      renderer: L.canvas(),
    });

    //Add default layers: basin outline, gages, and basemap
    this._mapService.map.addLayer(this._mapService.auxLayers['basin']);
    this._mapService.map.addLayer(this._mapService.auxLayers['gageSites']);
    this._mapService.map.addLayer(
      this._mapService.baseMaps[this._mapService.chosenBaseLayer]
    );

    //set up initial features
    this._mapService.expandCollapseDataPanel();
    this.addScale();
    this._mapService.addTrendPoints('Total Phosphorus', 2002);
    this.getZooms();
  }
  /*
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
  */

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

  //convert zoom levels to scale
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

  zoomHome() {
    this._mapService.map.setView(L.latLng(45.522, -82.4846), 6);
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
}
