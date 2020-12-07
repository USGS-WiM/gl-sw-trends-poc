
import { Component, OnInit, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.less']
})
export class TabsComponent implements AfterContentInit {
    @ContentChildren(TabComponent)
    tabs!: QueryList<TabComponent>;

    ngAfterContentInit() {
        const activeTabs = this.tabs.filter(tab => tab.active);

        // set initial tab
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
        // set initial tab to other than first
        /* if (activeTabs.length === 0){
          this.selectTab(this.tabs.filter((tab) => tab.title == "test2"));
        } */
    }

    selectTab(tab: any) {
        this.tabs.toArray().forEach(_tab => (_tab.active = false));
        tab.active = true;
    }
}