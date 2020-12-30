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
  chosenBaseId: any;
  displayedAuxLayers: string[] = [];

  constructor(private _mapService: MapService) {}

  ngOnInit() {
    this.chosenBaseId = 'basemap2';
  }
  // called from basemap button click in sidebar
  public toggleBasemap(selectedBase: string, selectedBaseId: string) {
    //get the element id of the previous basemap selection, and uncheck the radio button
    let oldRadioID = document.getElementById(
      this.chosenBaseId
    ) as HTMLInputElement;
    oldRadioID.checked = false;
    //get the element id of the new basemap selection, and check the radio button
    let newRadioID = document.getElementById(
      selectedBaseId
    ) as HTMLInputElement;
    newRadioID.checked = true;
    //remove the previous basemap layer
    this._mapService.map.removeLayer(
      this._mapService.baseMaps[this._mapService.chosenBaseLayer]
    );
    this._mapService.chosenBaseLayer = selectedBase;
    //add the new basemap layer
    this._mapService.map.addLayer(this._mapService.baseMaps[selectedBase]);
    this.chosenBaseId = selectedBaseId;
  }

  //when an Additional Layer is checked, add/remove that layer from the map
  public toggleMapLayer(mapLayer: string, layerID: string) {
    // this._mapService.chosenAuxLayer = newVal;
    let checkboxID = document.getElementById(layerID) as HTMLInputElement;
    if (checkboxID.checked == false) {
      if (mapLayer !== 'trends') {
        this._mapService.map.removeLayer(this._mapService.auxLayers[mapLayer]);
      } else {
        this._mapService.map.removeLayer(
          this._mapService.auxLayers['allEcoTrends']
        );
        this._mapService.map.removeLayer(
          this._mapService.auxLayers['wrtdsTrends']
        );
      }
    }
    if (checkboxID.checked == true) {
      if (mapLayer !== 'trends') {
        this._mapService.map.addLayer(this._mapService.auxLayers[mapLayer]);
      } else {
        this._mapService.map.addLayer(
          this._mapService.auxLayers['allEcoTrends']
        );
        this._mapService.map.addLayer(
          this._mapService.auxLayers['wrtdsTrends']
        );
      }
    }
  }
}
