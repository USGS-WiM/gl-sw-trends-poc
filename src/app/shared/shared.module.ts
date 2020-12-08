
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { MapService } from './services/map.service';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabComponent } from './components/tab/tab.component';
import { LoaderService } from './services/loader.service';
import { DataLoaderComponent } from './components/loader/dataloader.component';
//import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs';

//@Injectable()

@NgModule({
    declarations: [TabsComponent, TabComponent, LoaderComponent, DataLoaderComponent],
    imports: [CommonModule],
    exports: [TabsComponent, TabComponent, LoaderComponent, DataLoaderComponent],
    providers: [MapService, LoaderService]
})
export class SharedModule {

    constructor(private httpclient: HttpClient) {}

    // getSites(): Observable<any>
    // {
    //     return this.httpclient.get("https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer/0?f=pjson");
    // }
}