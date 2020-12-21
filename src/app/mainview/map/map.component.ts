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
