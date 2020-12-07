import { Component } from '@angular/core';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'gl-sw-trends';
  aboutModule: any;
  expandSidebar: any;

  constructor(private _SharedModule: SharedModule){}

  ngOnInit(){}
}
