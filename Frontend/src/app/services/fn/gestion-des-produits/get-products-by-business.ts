/* tslint:disable */
/* eslint-disable */
import { Products } from '../../models/products';
import { HttpClient, HttpContext, HttpParameterCodec, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface GetProductsByBusiness$Params {
  businessId: number;
}

export function getProductsByBusiness(
  http: HttpClient, 
  rootUrl: string, 
  params: GetProductsByBusiness$Params, 
  context?: HttpContext
): Observable<StrictHttpResponse<Array<Products>>> {
  const rb = new RequestBuilder(rootUrl, getProductsByBusiness.PATH, 'get');
  if (params) {
    rb.path('businessId', params.businessId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r as StrictHttpResponse<Array<Products>>)
  );
}

getProductsByBusiness.PATH = '/business/{businessId}/products';