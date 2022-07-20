import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { SwiperOptions } from 'swiper';
import Swal from 'sweetalert2';
import { CorrectivesService } from '../../services/correctives.service';
import { FileUploadService } from '../../services/file-upload.service';
import { Corrective } from '../../models/correctives.model';

@Component({
  selector: 'app-correctivo',
  templateUrl: './correctivo.component.html',
  styles: [
  ]
})
export class CorrectivoComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private correctivesService: CorrectivesService,
                private fb: FormBuilder,
                private fileUploadService: FileUploadService) { }

  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe( ({id}) => {
          
          this.loadCorrectiveId(id);
          
        });

  }

  /** ================================================================
   *  LOAD CORRECTIVE ID
  ==================================================================== */
  private _corrective!: Corrective;
  public imgsbefore: boolean = false;
  public imgsafter: boolean = false;

  public get corrective(): Corrective {
    return this._corrective;
  }

  public set corrective(value: Corrective) {
    this._corrective = value;
  }
  
  loadCorrectiveId(id: string){

    this.correctivesService.loadCorrectiveId(id)
        .subscribe( ({corrective}) => {
          
          this.corrective = corrective;

          if (corrective?.imgBef.length > 0) {
            this.imgsbefore = true;
          }

          if (corrective?.imgAft.length > 0) {
            this.imgsafter = true;
          }

          document.title = `Preventivo #${corrective?.control} - LTC System`;
          

        });

  }

  /** ================================================================
   *  UPDATE CHECKIN - CHECKOUT
  ==================================================================== */
  updateCheck(tipo: 'checkin' | 'checkout'){
    
    let data:any;
    let text = 'de marcar el checkin ahora?';
    let confirmButtonText = 'Si, checkIn';
    let msg = 'El checkIn se a actualizado exitosamente!';

    if(tipo === 'checkin'){
      data = {
        checkin: Date.now()
      }
    }else{
      data = {
        checkout: Date.now(),
        estado: 'Terminado'
      }
      msg = 'El checkOut se a actualizado exitosamente!';
      text = 'de marcar la checkout ahora?';
      confirmButtonText = 'Si, checkOut';
    }

    Swal.fire({
      title: 'Estas seguro?',
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText
    }).then((result) => {
      
      if (result.isConfirmed) {

        this.correctivesService.updateCorrective(data, this.corrective.coid!)
        .subscribe( ({corrective}) => {

          this.corrective.checkin = corrective.checkin;
          this.corrective.checkout = corrective.checkout;
          this.corrective.estado = corrective.estado;
          Swal.fire('Estupendo', msg, 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Erro', err.error.msg, 'error');          
        });

      }

    })

    

  };

  /** =====================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   *  NOTAS - CREATE
  ====================================================================================== */
  @ViewChild('notaI') notaI!: ElementRef;
  public formsNoteSubmitted: boolean = false;
  public formNotes =  this.fb.group({
    note: ['', [Validators.minLength(1), Validators.required]],
    date: ['']
  });

  postNota(){

    this.notaI.nativeElement.value = '';
    this.formsNoteSubmitted = true;

    if (this.formNotes.invalid) {
      return;
    }

    // AGREGAR FECHA
    this.formNotes.value.date = Date.now();

    this.correctivesService.postNotesCorrectives(this.formNotes.value, this.corrective.coid!)
        .subscribe( ({corrective}) =>{
          
          this.formsNoteSubmitted = false;
          this.formNotes.reset();

          this.corrective.notes = corrective.notes;
          

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        });
    
  }

  /** ======================================================================
   * VALIDATE FORM
  ====================================================================== */
  validate( campo: string): boolean{
    
    if ( this.formNotes.get(campo)?.invalid && this.formsNoteSubmitted ) {      
      return true;
    }else{
      return false;
    }

  }


  /** ================================================================
   *  ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   *   ACTUALIZAR IMAGEN
  ==================================================================== */
  public imgTempBef: any = null;
  public imgTempAft: any = null;
  public subirImagen!: File;
  cambiarImage(file: any, type: 'before' | 'after'): any{

    this.subirImagen = file.files[0];
    
    if (!this.subirImagen) {  
      if (type === 'before') {        
        return this.imgTempBef = null;      
      }else if (type === 'after') {
        return this.imgTempAft = null; 
      }      
    }
    
    let fileTemp = this.subirImagen;

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(fileTemp);
    
    reader.onloadend = () => {

      if (type === 'before') {       
        this.imgTempBef = reader.result;
      }else if (type === 'after') {
        this.imgTempAft = reader.result;
      }
    }    

  }
      
  /** ================================================================
   *  SUBIR IMAGEN fileImg
  ==================================================================== */
  @ViewChild('fileImgBef') fileImgBef!: any;
  @ViewChild('fileImgAft') fileImgAft!: any;

  public imgProducto: string = 'no-image';

  subirImg(desc: 'imgBef' | 'imgAft' | 'video'){
    
    this.fileUploadService.updateImage( this.subirImagen, 'correctives', this.corrective.coid!, desc)
    .then( img => {

      console.log(img);
      

      if (desc === 'imgBef') {
        this.corrective.imgBef?.push({
          img: img.nombreArchivo,
          date: img.date
        });
        this.imgsbefore = true;
      }else if(desc === 'imgAft'){
        this.corrective.imgAft?.push({
          img: img.nombreArchivo,
          date: img.date
        });
        this.imgsafter = true;
      }

      
    });
    
    this.imgProducto = 'no-image';
    
    if (desc === 'imgBef') {
      this.imgTempBef = null;
      this.fileImgBef!.nativeElement.value = '';
    }else if(desc === 'imgAft'){
      this.imgTempAft = null;
      this.fileImgAft!.nativeElement.value = '';
    }
    
  }

  /** ================================================================
   *  DELETE IMAGEN fileImg
  ==================================================================== */
  deleteImg(img:string, desc: 'imgBef' | 'imgAft', type: 'correctives' | 'correctives' = 'correctives'){

    this.fileUploadService.deleteImg(type, this.corrective.coid!, desc, img)
        .subscribe( (resp:any) => {
          
          this.corrective.imgAft = resp.corrective.imgAft;
          this.corrective.imgBef = resp.corrective.imgBef;

          if (this.corrective.imgBef.length > 0) {
            this.imgsbefore = true;
          }  

          if (this.corrective.imgAft.length > 0) {
            this.imgsafter = true;
          }

          Swal.fire('Estupendo', 'Se ha eliminado la imagen con exito', 'success');
          

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        });
    

  }

  /** ===================================================================
   * SWIPER
  ======================================================================= */
  

  public config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    centeredSlides: true,
    breakpoints: {
      100: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 3,
        spaceBetween: 50
      }
    }
  };


  // FIN DE LA CLASE
}
