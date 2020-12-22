import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Map, GeoJSON, latLng, LatLng } from 'leaflet';
import { SitelistService } from '../../data/sitelist.service';

import 'leaflet';
import * as esri from 'esri-leaflet';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  public map!: Map;
  public legend: any;
  public baseMaps: any;
  public auxLayers: any;
  public chosenAuxLayer!: string;
  public chosenBaseLayer: string;
  public sitesLayer!: L.FeatureGroup<any>;
  public basinLayer!: any;
  public huc8Layer!: any;
  public overlayLayers: any;
  public basinAreaStyle: any;

  //   public siteColors = ['red', 'blue', 'green', 'gray'];
  //   public siteCategories = ['Active', 'Suspected', 'Closed', 'Other']

  //   public _selectedSiteSubject = new Subject();
  //   public get SelectedSite(): Observable<any> {
  //       return this._selectedSiteSubject.asObservable();
  //   }

  //   public _selectedCanSiteSubject = new Subject();
  //   public get SelectedCanSite(): Observable<any> {
  //     return this._selectedCanSiteSubject.asObservable();
  //   }

  //   public _selectedCanadaSiteSubject = new Subject();
  //   public get SelectedCanadaSite(): Observable<any> {
  //       return this._selectedCanadaSiteSubject.asObservable();
  //   }

  public dataPanelCollapseSubject = new Subject();
  public get DataPanelCollapse(): Observable<any> {
    return this.dataPanelCollapseSubject.asObservable();
  }

  constructor(private siteListService: SitelistService) {
    this.chosenBaseLayer = 'Topo';

    this.baseMaps = {
      // {s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png
      OpenStreetMap: L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          zIndex: 1,
          maxZoom: 20,
          attribution:
            'Imagery from <a href="https://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
      ),
      Topo: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          zIndex: 1,
          attribution:
            'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
        }
      ),
      CartoDB: L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        {
          zIndex: 1,
          attribution:
            "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='https://cartodb.com/attributions'>CartoDB</a>",
        }
      ),
      Satellite: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community', //,
          //maxZoom: 10
        }
      ),
      Terrain: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
          maxZoom: 13,
          zIndex: 1,
        }
      ),
      Gray: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
          maxZoom: 16,
          zIndex: 1,
        }
      ),
      // Nautical: esri.tiledMapLayer({
      //   url: 'https://seamlessrnc.nauticalcharts.noaa.gov/arcgis/rest/services/RNC/NOAA_RNC/ImageServer',
      //   zIndex: 1
      // })
    };
    this.chosenAuxLayer = 'basin';

    this.basinLayer = {
      basin: esri.featureLayer({
        url:
          'https://services7.arcgis.com/Tk0IbKIKhaoYn5sa/ArcGIS/rest/services/GreatLakesCommissionBasinBoundary/FeatureServer/0',
      }),
    };
    this.huc8Layer = {
      huc8: esri.dynamicMapLayer({
        url: 'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer',
        layers: [4],
        layerDefs: { 4: "HUC8 LIKE '04%'" },
      }),
    };

    this.auxLayers = L.layerGroup([this.basinLayer, this.huc8Layer]);

    this.overlayLayers = {
      'Great Lakes Basin': this.basinLayer,
      'HUC8 Subbasin': this.huc8Layer,
    };

    this.basinAreaStyle = {
      color: 'green',
      fillOpacity: 0.25,
      opacity: 0.65,
      weight: 2,
    };

    this.auxLayers = {
      basinArea: esri.featureLayer({
        url:
          'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3',
        style: this.basinAreaStyle,
      }),
      basin: esri.featureLayer({
        url:
          'https://services7.arcgis.com/Tk0IbKIKhaoYn5sa/ArcGIS/rest/services/GreatLakesCommissionBasinBoundary/FeatureServer/0',
      }),
      watersheds: esri.dynamicMapLayer({
        url:
          'https://gis.streamstats.usgs.gov/arcgis/rest/services/StreamStats/nationalLayer/MapServer',
        layers: [2, 3, 4, 5, 6, 7],
        maxZoom: 14,
        minZoom: 4,
        useCors: false,
      }),
      gageSites: this.siteListService.createSitesLayer(
        this.siteListService.sites
      ),
      majorStreamlines: esri.featureLayer({
        url:
          'https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/6',
      }),
    };
  }
} //END Mapservice Class
