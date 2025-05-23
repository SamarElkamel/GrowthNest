/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Business } from '../../models/business';

export interface GetBusinessById$Params {
  idB: number;
}

export function getBusinessById(http: HttpClient, rootUrl: string, params: GetBusinessById$Params, context?: HttpContext): Observable<StrictHttpResponse<Business>> {
  const rb = new RequestBuilder(rootUrl, getBusinessById.PATH, 'get');
  if (params) {
    rb.path('idB', params.idB, {});
  }

  return http.request(
    rb.build({responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Business>;
    })
  );
}

getBusinessById.PATH = '/business/getBusinessById/{idB}';
