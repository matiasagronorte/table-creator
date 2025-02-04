import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiSearchResponse, ApiSearchGroup, ApiSearchRequest, ApiTableHeadersRequest, ApiTableSchemaRequest, ApiTableSchemaResponse, ApiDefinitionInterface, ApiParametersInterface, ApiDefinitionResponse, ApiParametersResponse } from '../interfaces';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';




@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  searchTableData<ApiSearchResponse>(apiPath: string, tableParam: string, page: number, criteriaGroup: ApiSearchGroup): Observable<ApiSearchResponse>{
  // searchTableData<T>(apiPath: string, tableParam: string,page:number): Observable<T> {
    const url = `${this.apiUrl}/${apiPath}/${tableParam}?page=${page}`;
    console.log('URL:' , url)

    const requestData: ApiSearchRequest = {
      page,
      criteria_group: criteriaGroup
    };
    
    return this.http.post<ApiSearchResponse>(url, requestData, { headers :{'Authorization': `aa` }});
  }

  createTableSchema(requestBody: ApiTableSchemaRequest): Observable<ApiTableSchemaResponse> {
    const url = `${this.apiUrl}/table_api_schema/create`;
    return this.http.post<ApiTableSchemaResponse>(url, requestBody, { headers: { 'Authorization': 'aa' } });
  }

  createTableHeaders(headers: ApiTableHeadersRequest): Observable<any> {
    const url = `${this.apiUrl}/table_api_headers/create`;
    console.log('BODY',headers)
    return this.http.post<any>(url, headers);
  }

 createApiDefinition(requestBody: ApiDefinitionInterface): Observable<any>{
  const url = `${this.apiUrl}/api_definition/create`;
  return this.http.post<any>(url, requestBody, {headers:{ 'Authorization': 'aa' }} )
 }

 createApiParameters(requestBody: ApiParametersInterface): Observable<any>{
  const url = `${this.apiUrl}/api_parameters/create`;
  return this.http.post<any>(url, requestBody, {headers:{'Authorization': `aa` }})
 }

  getApiDefinition(idApiDef?: number): Observable<ApiDefinitionResponse | ApiDefinitionResponse[]> {
    let url: string = `${this.apiUrl}/api_definition/`;  // URL por defecto

    if (idApiDef) {
      url = `${this.apiUrl}/api_definition/${idApiDef}`;
      return this.http.get<ApiDefinitionResponse>(url) // Si se proporciona un ID específico
    }

    return this.http.get<ApiDefinitionResponse[]>(url);
  }

  getApiParameters(idApiDefSearch?:number):Observable<ApiParametersResponse[]>{
    let url = `${this.apiUrl}/api_parameters/`;

    if(idApiDefSearch){
      url = `${this.apiUrl}/api_parameters/?id_api_definition=${idApiDefSearch}`;
    }

    return this.http.get<ApiParametersResponse[]>(url);
  }

  deleteApiDef(id?:number):Observable<any>{
    const url = `${this.apiUrl}/api_definition/${id}/delete`

    return this.http.delete<any>(url);
  }

  deleteApiParams(id?:number):Observable<any>{
    const url = `${this.apiUrl}/api_parameters/${id}/delete`

    return this.http.delete<any>(url);
  }

   patchApi(id: number,path:string, partialData: Partial<ApiDefinitionResponse | ApiParametersResponse>): Observable<any> {
    const url = `${this.apiUrl}/${path}/${id}/update`;
    return this.http.patch(url, partialData);
  }

}
