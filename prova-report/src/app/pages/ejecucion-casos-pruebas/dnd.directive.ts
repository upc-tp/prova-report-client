import Swal from 'sweetalert2';
import { format } from 'path';
import {
    Directive,
    Output,
    Input,
    EventEmitter,
    HostBinding,
    HostListener
  } from '@angular/core';
  
  @Directive({
    selector: '[appDnd]'
  })
  export class DndDirective {
    @HostBinding('class.fileover') fileOver: boolean;
    @Output() fileDropped = new EventEmitter<any>();
    formatCorrect:boolean;
    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = true;
    }
  
    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = false;
    }
    
    verifyFormat (format:string) {
        if(format == 'jpeg' || format == 'png'|| format =='jpg' ){
          return true;
        }
        else{
          return false;
        }
    }

    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = false;
      let files = evt.dataTransfer.files;
      for(var val of files){
        console.log(val.name.split(".",2)[1])
        if(this.verifyFormat(val.name.split(".",2)[1]) == false){
          this.formatCorrect = false;
          Swal.fire(
            {
              title:'Uno o más archivos no cumplen con la extensión de imágen permitida: jpeg, png, jpg',
              icon:'warning',
              showCloseButton:true
            })
            break;
        }else{
          this.formatCorrect = true;
        }
      }

      if (files.length < 5 && this.formatCorrect == true) {
        this.fileDropped.emit(files);
      }else if(files.length > 5){
        Swal.fire(
          {
            title:'Solo se permiten 5 archivos cómo máximo',
            icon:'warning',
            showCloseButton:true
          }
        )
      }
    }
  }
  
