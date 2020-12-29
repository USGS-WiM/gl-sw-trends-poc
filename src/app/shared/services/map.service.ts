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
  public basinOutlineStyle: any;
  public basinOutline: any;
  public epaConcernStyle: any;

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

    this.basinOutlineStyle = {
      color: 'black',
      fillOpacity: 0,
      weight: 2.5,
    };

    this.epaConcernStyle = {
      color: 'brown',
      fillOpacity: 0.2,
      weight: 1,
    };

    this.auxLayers = {
      basin: esri.featureLayer({
        url:
          'https://arcgis-server.lsa.umich.edu/arcgis/rest/services/IFR/glahf_boundaries/MapServer/0',
        style: this.basinOutlineStyle,
      }),
      basinArea: esri.featureLayer({
        url:
          'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/3',
        style: this.basinAreaStyle,
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
      epaAreasOfConcern: esri.featureLayer({
        url:
          'https://gis.wim.usgs.gov/arcgis/rest/services/SIGL/SIGLMapper/MapServer/1',
        style: this.epaConcernStyle,
      }),
      //~20 sites in the basin
      wrtdsTrends: esri.featureLayer({
        url:
          'https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/swTrendSites/MapServer/2',
        onEachFeature: function (feature: any, layer: any) {
          if (feature.properties['wrtds_trends_wm_new.likeC'] <= -0.8500001) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-inverse-triangle wmm-black wmm-icon-inverse-triangle wmm-size-20 ',
              })
            );
          } else if (
            feature.properties['wrtds_trends_wm_new.likeC'] > -0.8500001 &&
            feature.properties['wrtds_trends_wm_new.likeC'] <= -0.700001
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-inverse-triangle wmm-white wmm-icon-inverse-triangle wmm-size-20 ',
              })
            );
          } else if (
            feature.properties['wrtds_trends_wm_new.likeC'] > -0.700001 &&
            feature.properties['wrtds_trends_wm_new.likeC'] <= 0.7
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-circle wmm-yellow wmm-icon-circle wmm-icon-black wmm-size-20',
              })
            );
          } else if (
            feature.properties['wrtds_trends_wm_new.likeC'] > 0.7 &&
            feature.properties['wrtds_trends_wm_new.likeC'] <= 0.849999
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-triangle wmm-red-hollow wmm-icon-triangle wmm-size-20',
              })
            );
          } else if (
            feature.properties['wrtds_trends_wm_new.likeC'] > 0.849999
          ) {
            layer.setIcon(
              L.divIcon({
                className: 'wmm-triangle wmm-red wmm-icon-triangle wmm-size-20',
              })
            );
          } else {
            layer.setIcon(
              L.divIcon({
                className: 'wmm-triangle',
              })
            );
            console.log(
              'Skipped site ' +
                feature.properties['wrtds_trends_wm_new.likeC'] +
                ' due to null wrtds_trends_wm_new.likeC'
            );
            console.log('feature.properties', feature.properties);
          }
        },
      }),
      //4 sites in the basin
      allEcoTrends: esri.featureLayer({
        url:
          'https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/swTrendSites/MapServer/1',
        onEachFeature: function (feature: any, layer: any) {
          if (feature.properties.EcoTrendResults_likelihood <= -0.8500001) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-inverse-triangle wmm-black wmm-icon-inverse-triangle wmm-size-20 ',
              })
            );
          } else if (
            feature.properties.EcoTrendResults_likelihood > -0.8500001 &&
            feature.properties.EcoTrendResults_likelihood <= -0.700001
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-inverse-triangle wmm-white wmm-icon-inverse-triangle wmm-size-20 ',
              })
            );
          } else if (
            feature.properties.EcoTrendResults_likelihood > -0.700001 &&
            feature.properties.EcoTrendResults_likelihood <= 0.7
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-circle wmm-yellow wmm-icon-circle wmm-icon-black wmm-size-20',
              })
            );
          } else if (
            feature.properties.EcoTrendResults_likelihood > 0.7 &&
            feature.properties.EcoTrendResults_likelihood <= 0.849999
          ) {
            layer.setIcon(
              L.divIcon({
                className:
                  'wmm-triangle wmm-red-hollow wmm-icon-triangle wmm-size-20',
              })
            );
          } else if (feature.properties.EcoTrendResults_likelihood > 0.849999) {
            layer.setIcon(
              L.divIcon({
                className: 'wmm-triangle wmm-red wmm-icon-triangle wmm-size-20',
              })
            );
          } else {
            layer.setIcon(
              L.divIcon({
                className: 'wmm-triangle',
              })
            );
            console.log(
              'Skipped site ' +
                feature.properties
                  .EcoSiteSummary_no_headers_csv_Ecology_site_ID +
                ' due to null EcoTrendResults_likelihood'
            );
          }
        },
      }),
    };
  }
} //END Mapservice Class
