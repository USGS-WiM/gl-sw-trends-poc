import { Component, OnInit } from '@angular/core';
import {MapService} from '../../shared/services/map.service';
import {Map} from 'leaflet';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';

@Component({
  selector: 'app-mainview-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  collapsedMap: any;
  collapsedDataPanel: any;
  legendExpanded = true;

  constructor(private _mapService: MapService,) {}

  ngOnInit() {
    
    this._mapService.map = L.map('map', {
      center: L.latLng(45.0522, -82.4846), //[-82.4846, 45.0522] - GL Geo Center
      zoom: 6,
      renderer: L.canvas()
    });

    this._mapService.map.addLayer(this._mapService.baseMaps[this._mapService.chosenBaseLayer]);

    //this._mapService.legend = new L.Control({position: 'bottomright'});
    //this._mapService.map.addLayer(this._mapService.auxLayers['basinArea']);

    //this._mapService.legend.addTo(this._mapService.map);
    this.expandCollapseDataPanel();

  }

  expandCollapseDataPanel() {
    this._mapService.DataPanelCollapse.subscribe((collapse: any) => {
      this.collapsedDataPanel = collapse;
    });

    this._mapService.dataPanelCollapseSubject.next(!this.collapsedDataPanel);

    // When data or map is collapsed or expanded,
    // invalidate size to refresh tiles and center map

    setTimeout(() => {
        this._mapService.map.invalidateSize()
    }, 150);

  }

// When data or map is collapsed or expanded,
// invalidate size to refresh tiles and center map
  // resizeMap() {
  //   setTimeout(() => {
  //       this._mapService.map.invalidateSize()
  //   }, 150);
  // }

}