import { Component, OnInit, Directive, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  selector: 'app-mainview-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
})
export class SidebarComponent implements OnInit {
  expandSidebar: any;
  showBasemaps: any;
  showAuxLayers: any;
  showFilters: any;
  chosenBaseLayer: any;

  constructor(
    private _mapService: MapService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    //this.displayedAuxLayers = [];
    // this.onChanges();
  }
  // called from basemap button click in sidebar
  public toggleLayer(newVal: string) {
    this._mapService.chosenBaseLayer = newVal;
    this._mapService.map.removeLayer(
      this._mapService.baseMaps['OpenStreetMap']
    );
    this._mapService.map.removeLayer(this._mapService.baseMaps['Topo']);
    this._mapService.map.removeLayer(this._mapService.baseMaps['Terrain']);
    this._mapService.map.removeLayer(this._mapService.baseMaps['Satellite']);
    this._mapService.map.removeLayer(this._mapService.baseMaps['Gray']);
    // this._mapService.map.removeLayer(this._mapService.baseMaps['Nautical']);
    this._mapService.map.addLayer(this._mapService.baseMaps[newVal]);
  }

  //when an Additional Layer is checked, add/remove that layer from the map
  public toggleAuxLayer(mapLayer: string, layerID: string) {
    // this._mapService.chosenAuxLayer = newVal;
    let checkboxID = document.getElementById(layerID) as HTMLInputElement;
    if (checkboxID.checked == false) {
      this._mapService.map.removeLayer(this._mapService.auxLayers[mapLayer]);
    }
    if (checkboxID.checked == true) {
      this._mapService.map.addLayer(this._mapService.auxLayers[mapLayer]);
    }
  }
}
