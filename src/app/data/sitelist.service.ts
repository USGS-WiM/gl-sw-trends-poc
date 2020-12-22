import { Injectable } from '@angular/core';
declare let L: any;
import 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class SitelistService {
  siteMarkers = L.featureGroup([]);
  sites = [
    {
      site_no: '04024000',
      station_nm: 'ST. LOUIS RIVER AT SCANLON, MN',
      dec_lat_va: 46.4866144,
      dec_long_va: -92.4188018,
    },
    {
      site_no: '04027000',
      station_nm: 'BAD RIVER NEAR ODANAH, WI',
      dec_lat_va: 46.7032765,
      dec_long_va: -90.696297,
    },
    {
      site_no: '04040000',
      station_nm: 'ONTONAGON RIVER NEAR ROCKLAND, MI',
      dec_lat_va: 46.7207742,
      dec_long_va: -89.207086,
    },
    {
      site_no: '04059500',
      station_nm: 'FORD RIVER NEAR HYDE, MI',
      dec_lat_va: 45.7549674,
      dec_long_va: -87.2020793,
    },
    {
      site_no: '04067500',
      station_nm: 'MENOMINEE RIVER NEAR MC ALLISTER, WI',
      dec_lat_va: 45.3258333,
      dec_long_va: -87.6633333,
    },
    {
      site_no: '04085138',
      station_nm: 'EAST RIVER AT GREEN BAY, WI',
      dec_lat_va: 44.5091593,
      dec_long_va: -87.9917702,
    },
    {
      site_no: '04085427',
      station_nm: 'MANITOWOC RIVER AT MANITOWOC, WI',
      dec_lat_va: 44.10616667,
      dec_long_va: -87.7160278,
    },
    {
      site_no: '04087170',
      station_nm: 'INDIANA HARBOR CANAL AT EAST CHICAGO, IN',
      dec_lat_va: 43.02444444,
      dec_long_va: -87.8983333,
    },
    {
      site_no: '04101500',
      station_nm: 'INDIANA HARBOR CANAL AT EAST CHICAGO, IN',
      dec_lat_va: 41.6492023,
      dec_long_va: -87.4686529,
    },
    {
      site_no: '04101500',
      station_nm: 'ST. JOSEPH RIVER AT NILES, MI',
      dec_lat_va: 41.8292138,
      dec_long_va: -86.2597325,
    },
    {
      site_no: '04108660',
      station_nm: 'KALAMAZOO RIVER AT NEW RICHMOND, MI',
      dec_lat_va: 42.65085976,
      dec_long_va: -86.106703,
    },
    {
      site_no: '04119400',
      station_nm: 'GRAND RIVER NEAR EASTMANVILLE, MI',
      dec_lat_va: 43.0241884,
      dec_long_va: -86.0264354,
    },
    {
      site_no: '04142000',
      station_nm: 'RIFLE RIVER NEAR STERLING, MI',
      dec_lat_va: 44.0725203,
      dec_long_va: -84.0199939,
    },
    {
      site_no: '04157005',
      station_nm: 'SAGINAW RIVER AT HOLLAND AVENUE AT SAGINAW, MI',
      dec_lat_va: 43.4219699,
      dec_long_va: -83.951918,
    },
    {
      site_no: '04166500',
      station_nm: 'RIVER ROUGE AT DETROIT, MI',
      dec_lat_va: 42.3730923,
      dec_long_va: -83.2546513,
    },
    {
      site_no: '04176500',
      station_nm: 'RIVER RAISIN NEAR MONROE, MI',
      dec_lat_va: 41.9606008,
      dec_long_va: -83.53104619,
    },
    {
      site_no: '04193500',
      station_nm: 'Maumee River at Waterville OH',
      dec_lat_va: 41.5000526,
      dec_long_va: -83.7127145,
    },
    {
      site_no: '04199500',
      station_nm: 'Huron River at Milan OH',
      dec_lat_va: 41.3008852,
      dec_long_va: -82.6082326,
    },
    {
      site_no: '04200500',
      station_nm: 'Vermilion River near Vermilion OH',
      dec_lat_va: 41.38199,
      dec_long_va: -82.3168273,
    },
    {
      site_no: '04200500',
      station_nm: 'Black River at Elyria OH',
      dec_lat_va: 41.38032368,
      dec_long_va: -82.10459279,
    },
    {
      site_no: '04208000',
      station_nm: 'Cuyahoga River at Independence OH',
      dec_lat_va: 41.39533087,
      dec_long_va: -81.6298478,
    },
    {
      site_no: '04212100',
      station_nm: 'Grand River near Painesville OH',
      dec_lat_va: 41.7189339,
      dec_long_va: -81.2278789,
    },
    {
      site_no: '04213500',
      station_nm: 'CATTARAUGUS CREEK AT GOWANDA NY',
      dec_lat_va: 42.4633333,
      dec_long_va: -78.9341667,
    },
    {
      site_no: '04231600',
      station_nm: 'GENESEE RIVER AT FORD STREET BRIDGE, ROCHESTER NY',
      dec_lat_va: 43.1417222,
      dec_long_va: -77.6163056,
    },
    {
      site_no: '04249000',
      station_nm: 'OSWEGO RIVER AT LOCK 7, OSWEGO NY',
      dec_lat_va: 43.45166667,
      dec_long_va: -76.50527778,
    },
  ];

  //take the sites JSON and turn it into a map point layer with the WIM pin logo
  public createSitesLayer(siteJSON: any) {
    let siteIcon = L.divIcon({
      className:
        ' wmm-pin wmm-altblue wmm-icon-circle wmm-icon-white wmm-size-20',
    });

    for (let site of siteJSON) {
      let lat = Number(site.dec_lat_va);
      let lng = Number(site.dec_long_va);
      L.marker([lat, lng], { icon: siteIcon }).addTo(this.siteMarkers);
    }
    return this.siteMarkers;
  }
}
