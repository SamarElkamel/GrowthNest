/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Event } from '../../models/event';

export interface DisplayEventHistory$Params {
}

export function displayEventHistory(http: HttpClient, rootUrl: string, params?: DisplayEventHistory$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Event>>> {
  const rb = new RequestBuilder(rootUrl, displayEventHistory.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Event>>;
    })
  );
}

displayEventHistory.PATH = '/Event/DisplayEventHistory';
