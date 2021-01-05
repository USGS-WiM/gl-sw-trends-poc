import { Component, OnInit, Directive, Input } from '@angular/core';
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
  //If true, layer is on and corresponding layer will appear in legend
  basinVisible: boolean = true;
  subBasinVisible: boolean = false;
  watershedsVisible: boolean = false;
  streamVisible: boolean = false;
  gageVisible: boolean = false;
  //If there are any map layers on, map legend section will appear
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

  //triggered with 'Filter Sites' button is pressed
  //filters wrtdsTrendsBasin by the new consituent value
  public filterSites() {
    let constituent = document.getElementById('typeSelect') as HTMLInputElement;
    let trendStart = document.getElementById('yearSelect') as HTMLInputElement;
    let trendStartInput = Number(trendStart.value);
    this._mapService.map.removeLayer(this._mapService.wrtdsTrendsBasin);
    // this._mapService.map.removeLayer(this._mapService.allEcoTrendsBasin);
    this._mapService.addTrendPoints(constituent.value, trendStartInput);
  }

  //when an Additional Layer is checked, add/remove that layer from the map
  public toggleMapLayer(mapLayer: string, layerID: string, visible: any) {
    let checkboxID = document.getElementById(layerID) as HTMLInputElement;

    //when a checkbox is checked, add layer to map and icon to legend
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
    //when a checkbox is unchecked, remove layer from map and icon from legend
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
    //if there is at least one map layer, show map layer section of legend
    if (this.layerCount > 0) {
      this.activeLayers = true;
    } else if (this.layerCount === 0) {
      this.activeLayers = false;
    }
  }
}
