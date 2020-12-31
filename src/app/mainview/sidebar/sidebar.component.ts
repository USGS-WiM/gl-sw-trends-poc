import { Variable } from '@angular/compiler/src/render3/r3_ast';
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
  basinVisible: boolean = true;
  subBasinVisible: boolean = false;
  watershedsVisible: boolean = false;
  streamVisible: boolean = false;
  gageVisible: boolean = false;
  activeLayers: boolean = true;
  layerCount: number = 1;

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

  //called from aux layer button click in sidebar
  // public toggleAuxLayer(newVal: string) {
  //   this._mapService.chosenAuxLayer = newVal;
  //   this._mapService.map.removeLayer(this._mapService.auxLayers['basinArea']);
  //   this._mapService.map.addLayer(this._mapService.baseMaps[newVal]);
  // }

  public toggleAuxLayer2(newVal: string) {
    let index = this.displayedAuxLayers.indexOf(newVal);
    if (index > -1) {
      this.displayedAuxLayers.splice(index, 1);
      this._mapService.map.addLayer(this._mapService.auxLayers[newVal]);
    } else {
      this.displayedAuxLayers.push(newVal);
      this._mapService.map.removeLayer(this._mapService.auxLayers[newVal]);
    }
  }

  //when an Additional Layer is checked, add/remove that layer from the map
  public toggleMapLayer(mapLayer: string, layerID: string, visible: any) {
    let checkboxID = document.getElementById(layerID) as HTMLInputElement;
    if (checkboxID.checked == false) {
      this._mapService.map.removeLayer(this._mapService.auxLayers[mapLayer]);
      if (layerID === 'gageID') {
        this.gageVisible = false;
      }
      if (layerID === 'basinID') {
        this.basinVisible = false;
      }
      if (layerID === 'subBasinID') {
        this.subBasinVisible = false;
      }
      if (layerID === 'streamRiver') {
        this.streamVisible = false;
      }
      if (layerID === 'waterID') {
        this.watershedsVisible = false;
      }
      this.layerCount -= 1;
    }
    if (checkboxID.checked == true) {
      this._mapService.map.addLayer(this._mapService.auxLayers[mapLayer]);
      if (layerID === 'gageID') {
        this.gageVisible = true;
      }
      if (layerID === 'basinID') {
        this.basinVisible = true;
      }
      if (layerID === 'subBasinID') {
        this.subBasinVisible = true;
      }
      if (layerID === 'streamRiver') {
        this.streamVisible = true;
      }
      if (layerID === 'waterID') {
        this.watershedsVisible = true;
      }
      this.layerCount += 1;
    }
    if (this.layerCount > 0) {
      this.activeLayers = true;
    } else if (this.layerCount === 0) {
      this.activeLayers = false;
    }
  }
}
