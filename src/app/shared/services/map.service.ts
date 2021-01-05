import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Map, GeoJSON, latLng, LatLng } from 'leaflet';
import { SitelistService } from '../../data/sitelist.service';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { polygon, point } from '@turf/helpers';

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
  public wrtdsTrendsBasin: any;
  public allEcoTrendsBasin: any;

  //The trend points that appear on map load
  //There are 4 layers in the REST service, but we only call these 2 because the others don't have points in the basin
  public addTrendPoints(filterValue: string, year: number) {
    this.wrtdsTrendsBasin = esri.featureLayer({
      url:
        'https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/swTrendSites/MapServer/2',
      onEachFeature: function (feature: any, layer: any) {
        //Create very simplified outline of basin
        //This should be updated to use the real basin outline
        let simpBasin = polygon([
          [
            [51.19, -90.9],
            [50.31, -90.79],
            [48.69, -90.85],
            [47.72, -93.27],
            [46, -93.27],
            [45.98, -89.05],
            [43.72, -89.41],
            [42.51, -87.51],
            [41.53, -87.05],
            [40.38, -84.38],
            [41.26, -80.86],
            [41.76, -80.57],
            [42.42, -79.05],
            [42.21, -76.83],
            [42.33, -75.97],
            [43.02, -76.0],
            [51.19, -90.9],
          ],
        ]);
        //feature coordinates
        let coords = point([
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
        ]);
        //is the feature inside the basin?
        let pointInBasin = booleanPointInPolygon(coords, simpBasin);
        //if the feature is inside of the basin, plot it with filter values
        if (
          pointInBasin &&
          feature.properties['wrtds_trends_wm_new.yearStart'] === year &&
          feature.properties['wrtds_trends_wm_new.param_nm'] === filterValue
        ) {
          layer.bindPopup(
            '<div style="font-weight: bold">WRTDS Site</div>' +
              'Site ID: ' +
              feature.properties['wrtds_sites.Gage_number'] +
              '<br>' +
              'Site Name: ' +
              feature.properties['wrtds_sites.Station_nm']
          );
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
            //There are lots of sites that don't have a 'wrtds_trends_wm_new.likeC', but they do have
            //'likeCDown' and 'likeCUp'. Not sure what to do with these, so skipping them for now.
          } else {
            layer.setIcon(
              L.divIcon({
                className: 'wmm-triangle',
              })
            );
            /* There are so many of these that, for now, I'm not flagging them
            console.log(
              'Skipped site ' +
                feature.properties['wrtds_trends_wm_new.likeC'] +
                ' due to null wrtds_trends_wm_new.likeC'
            );
            */
          }
        } else {
          layer.setIcon(
            L.divIcon({
              className: 'wmm-triangle',
            })
          );
          /* There are so many of these that, for now, I'm not flagging them
          console.log(
            'Skipped site ' +
              feature.properties['wrtds_trends_wm_new.likeC'] +
              ' due to null wrtds_trends_wm_new.likeC'
          );
          */
        }
      },
    });
    this.allEcoTrendsBasin = esri.featureLayer({
      url:
        'https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/swTrendSites/MapServer/1',
      onEachFeature: function (feature: any, layer: any) {
        //Create very simplified outline of basin
        //This should be updated to use the real basin outline
        let simpBasin = polygon([
          [
            [51.19, -90.9],
            [50.31, -90.79],
            [48.69, -90.85],
            [47.72, -93.27],
            [46, -93.27],
            [45.98, -89.05],
            [43.72, -89.41],
            [42.51, -87.51],
            [41.53, -87.05],
            [40.38, -84.38],
            [41.26, -80.86],
            [41.76, -80.57],
            [42.42, -79.05],
            [42.21, -76.83],
            [42.33, -75.97],
            [43.02, -76.0],
            [51.19, -90.9],
          ],
        ]);
        //feature coordinates
        let coords = point([
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0],
        ]);
        //is the feature inside the basin?
        let pointInBasin = booleanPointInPolygon(coords, simpBasin);
        if (
          pointInBasin &&
          feature.properties.EcoTrendResults_firstYear === year
        ) {
          layer.bindPopup(
            '<div style="font-weight: bold">Eco Trends Site</div>' +
              'Site ID: ' +
              feature.properties.EcoTrendResults_EcoSiteID +
              '<br>' +
              'Site Name: ' +
              feature.properties.EcoTrendResults_EcoSiteName
          );
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
        } else {
          //If point is outside of the basin, plot an invisible marker
          //There is probably a way to skip this feature instead of adding a blank one
          layer.setIcon(
            L.divIcon({
              className: 'wmm-triangle',
            })
          );
        }
      },
    });
    //Add the trend points that are inside of the basin to the map on load
    this.wrtdsTrendsBasin.addTo(this.map);
    this.allEcoTrendsBasin.addTo(this.map);
  }

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
        style: function (feature) {
          var riverColor;
          var riverOpacity;
          switch (feature.properties.FCODE) {
            case 46000:
              riverColor = '#73A8F3';
              riverOpacity = 1;
              break;
            case 46003:
              riverColor = '#73A8F3';
              riverOpacity = 1;
              break;
            case 46006:
              riverColor = '#73A8F3';
              riverOpacity = 1;
              break;
            case 46007:
              riverColor = '#73A8F3';
              riverOpacity = 1;
              break;
            default:
              riverColor = '#000000';
              riverOpacity = 0;
          }
          return { color: riverColor, opacity: riverOpacity, weight: 5 };
        },
      }),
    };
  }
} //END Mapservice Class
