  
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//import { NgSelectModule } from '@ng-select/ng-select';
import { MapComponent } from './map/map.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { DataviewComponent } from './dataview/dataview.component';

@NgModule({
  declarations: [MapComponent, SidebarComponent, DataviewComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule],
  exports: [MapComponent, SidebarComponent, DataviewComponent]
})
export class MainviewModule {}