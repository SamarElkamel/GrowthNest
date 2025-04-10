/* tslint:disable */
/* eslint-disable */
import { Products } from '../../models/products';
import { HttpClient, HttpContext, HttpParameterCodec, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface AddBusinessProduct$Params {
  businessId: number;
  body: Products;
}

export function addBusinessProduct(
  http: HttpClient, 
  rootUrl: string, 
  params: AddBusinessProduct$Params, 
  context?: HttpContext
): Observable<StrictHttpResponse<Products>> {
  const rb = new RequestBuilder(rootUrl, addBusinessProduct.PATH, 'post');
  if (params) {
    rb.path('businessId', params.businessId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r as StrictHttpResponse<Products>)
  );
}

addBusinessProduct.PATH = '/business/{businessId}/products';