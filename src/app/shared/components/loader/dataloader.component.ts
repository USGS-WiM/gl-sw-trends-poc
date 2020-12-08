import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-dataloader-div',
    template: `
        <div [class.dataloader-hidden]="!show">
            <div class="data-loader" id="data-loader"></div>
        </div>
    `,
    styleUrls: ['loader.component.less']
})
export class DataLoaderComponent implements OnInit, OnDestroy {
    public show = false;
    private subscription: Subscription = new Subscription;

    constructor(private _loaderService: LoaderService) {}

    ngOnInit() {
        // subscription to update the class on the div to show/hide the div
        this.subscription = this._loaderService.dataloaderState.subscribe((state: boolean) => {
            this.show = state;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}