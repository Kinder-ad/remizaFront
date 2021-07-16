import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterializeModule } from "angular2-materialize";
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {StorageServiceModule} from "ngx-webstorage-service";
import { MinutetosecondsPipe } from './_pipe/minutetoseconds.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchFilterPipe } from './_pipe/search.pipe';
function RoutingAppModule() {

}

@NgModule({
  declarations: [
    AppComponent,
    MinutetosecondsPipe,
    SearchFilterPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    StorageServiceModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
