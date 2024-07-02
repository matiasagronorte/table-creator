import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiDefinitionInterface, ApiDefinitionResponse, ApiParametersInterface, ApiParametersResponse } from '../../interfaces';
import { ApiCreatorComponent } from '../api-creator/api-creator.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-general-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ApiCreatorComponent],
  templateUrl: './general-form.component.html',
  styleUrl: './general-form.component.css'
})
export class GeneralFormComponent {
  apiGeneralForm:FormGroup;
  idApiDefSearch:number = 0;
  ResponseapiDefinitions: ApiDefinitionResponse[] = [];
  ResponseSingleApiDefinition: ApiDefinitionResponse | null = null;
  createdActive:boolean = false;
  resultsapis:boolean = true
  isActiveResults:boolean = false;
  ResponseApiParams: ApiParametersResponse[] = [];
  showAlert:boolean = false;
  inUpdate:boolean = false;
  selectedApiDefinition: any = null;


  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.apiGeneralForm = this.fb.group({
      idApiDefSearch: ['', Validators.required],
       // Ajusta el nombre aquí según tu formulario
    });
  }

////////////////////////////////////////////////////////////////////////
//// API DEFINITION
  buscarApiDef() {
    this.idApiDefSearch = +this.apiGeneralForm.get('idApiDefSearch')?.value;

    this.apiService.getApiDefinition(this.idApiDefSearch).subscribe(
      (data: ApiDefinitionResponse | ApiDefinitionResponse[]) => {
        if (Array.isArray(data)) {
          this.ResponseSingleApiDefinition = null
          this.ResponseapiDefinitions = data;

          for(let def of this.ResponseapiDefinitions){
            this.buscarApiParamsPorID(def.id)
            console.log(this.ResponseApiParams)
          }

        } else {
          this.ResponseapiDefinitions = []
          this.ResponseSingleApiDefinition = data;
          this.buscarApiParamsPorID(this.idApiDefSearch);
          console.log(this.ResponseSingleApiDefinition);

        }
 
        
      }
      
    )

    
    this.showResults()
  }

  deleteApiDef(id:number){
    const confirmDelete = confirm('¿Estas seguro que deseas eliminar esta ApiDefinition?');
    if (confirmDelete) {
      this.apiService.deleteApiDef(this.ResponseSingleApiDefinition?.id).subscribe()}

    this.ResponseSingleApiDefinition = null
    this.showAlertMessage()
  }

  editApiDef(id:number){
    this.apiService.getApiDefinition(id).subscribe((data: any) => {
      this.selectedApiDefinition = data;
      this.apiGeneralForm.patchValue({
        method: data.method,
        serializer: data.serializer,
        description: data.description,
        url_list: data.url_list,
        fun_definition: data.fun_definition,
        url_path: data.url_path,
        authenticatable: data.authenticatable
      });
    });
  }

 //////////////////////////////////////////////////////////////////////////
 ///////// API PARAMETERS 
  buscarApiParamsPorID(id:number){
    this.apiService.getApiParameters(id).subscribe(
      (data: ApiParametersResponse[]) => {
        this.ResponseApiParams = data;
        console.log(this.ResponseApiParams)
      });
    
  }

  deleteApiParam(id:number){
    const confirmDelete = confirm('¿Estas seguro que deseas eliminar este parametro?');
    if(confirmDelete){
      this.apiService.deleteApiParams(id).subscribe()
    }
    this.buscarApiParamsPorID(this.idApiDefSearch)
      
  }


//////////////////////////////////////////////////////////////////////////////
/////// FUNCIONES EXTRAS
  desactivarCreate(){
    this.createdActive = false;
    this.resultsapis = true;
  }

  inUpdateApi(){
    this.inUpdate = true;
  }
  showAlertMessage() {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 2000); // Ocultar después de 2000 milisegundos (2 segundos)
  }

  showResults(){
    this.isActiveResults = true;
  }
  createdAcive(){
    this.createdActive = true;
    this.resultsapis = false;
  }
}
