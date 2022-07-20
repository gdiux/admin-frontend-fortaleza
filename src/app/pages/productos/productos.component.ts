import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// SERVICES
import { ProductsService } from '../../services/products.service';
import { SearchService } from '../../services/search.service';

// MODELS
import { Product } from '../../models/products.model';
import { Client } from '../../models/clients.model';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styles: [
  ]
})
export class ProductosComponent implements OnInit {
  
  constructor(  private productsService: ProductsService,
                private searchService: SearchService,
                private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadProducts();    
  }

  

  /** ======================================================================
   * ASSIGN CLIENTS
  ====================================================================== */
  public productC!: Product;
  actualizarLista(){
    this.loadProducts();
  }

  /** ======================================================================
   * LOAD PRODUCTS
  ====================================================================== */
  public desde:number = 0;
  public limite:number = 50;
  public products: Product[] = [];
  public productsTemp: Product[] = [];
  public total: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;

  loadProducts(){

    this.cargando = true;
    this.sinResultados = false;           

    this.productsService.loadProducts(this.desde, this.limite)
        .subscribe( ({products, total}) => {  
          
          // COMPROBAR SI EXISTEN RESULTADOS
          if (products.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = total;
          this.products = products;
          this.productsTemp = products;

        });

  }

  /** ======================================================================
   * CREATE
  ====================================================================== */
  public savingNew: boolean = false;
  public newProductSubmitted: boolean = false;
  public newProductForm = this.fb.group({
    code: ['', [Validators.required]],
    serial: ['', [Validators.required]],
    brand: [''],
    model: [''],
    year: [''],
    estado: ['none'],
    frecuencia: 3
  });

  createProduct(){

    this.savingNew = true;
    this.newProductSubmitted = true;

    if (this.newProductForm.invalid) {
      this.savingNew = false;
      return;
    }

    this.productsService.createProduct( this.newProductForm.value )
        .subscribe( ({product}) => {

          this.products.push(product);
          this.total ++;
          this.newProductSubmitted = false;
          this.newProductForm.reset({
            estado: ['none'],
            frecuencia: 3
          });
          this.savingNew = false;

          Swal.fire('Estupendo', 'El cliente se ha creado exitosamente!', 'success');

        }, (err) => { 
          Swal.fire('Error', err.error.msg, 'error');
          this.savingNew = false;          
        });

  }

  /** ======================================================================
   * VALIDATE FORM NEW
  ====================================================================== */
  validateNewForm( campo:string ): boolean{

    if ( this.newProductForm.get(campo)?.invalid && this.newProductSubmitted ) {      
      return true;
    }else{
      return false;
    }

  }

  /** ======================================================================
   * SEARCH
  ====================================================================== */
  public resultados: number = 0;
  search( termino:string ){

    let query = `desde=${this.desde}&hasta=${this.limite}`;

    if (termino.length === 0) {
      this.products = this.productsTemp;
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('products', termino, query)
        .subscribe( ({resultados}) => {

          this.products = resultados;
          this.resultados = resultados.length;

        });   

  }

  /** ================================================================
   *   CAMBIAR PAGINA
  ==================================================================== */
  @ViewChild('mostrar') mostrar!: ElementRef;
  cambiarPagina (valor: number){
    
    this.limite = Number(this.mostrar.nativeElement.value);
    
    if (this.limite > 10) {
      valor = valor * (this.limite/10);      
    }
    
    this.desde += valor;
    
    if (this.desde < 0) {
      this.desde = 0;
    }else if( this.desde > this.total ){
      this.desde -= valor;
    }
    
    this.loadProducts();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){    

    this.limite = Number(cantidad);
    this.loadProducts();

  }

  /** ======================================================================
   * SELECT
  ====================================================================== */  
  selectProduct(product: Product){

    this.editProductForm.reset({
      code: product.code,
      serial: product.serial,
      brand: product.brand,
      model: product.model,
      year: product.year,
      estado: product.estado,
      pid: product.pid,
      frecuencia: product.frecuencia
    });

  }

  /** ======================================================================
   * EDIT
  ====================================================================== */
  public savingEdit: boolean = false;
  public editProductSubmitted: boolean = false;
  public editProductForm = this.fb.group({
    code: ['', [Validators.required]],
    serial: ['', [Validators.required]],
    brand: [''],
    model: [''],
    year: [''],
    estado: ['none'],
    pid: [''],
    frecuencia: 3
  });

  editProduct(){

    this.savingEdit = true;
    this.editProductSubmitted = true;

    if (this.editProductForm.invalid) {
      this.savingEdit = false;
      return;
    }

    this.productsService.updateProduct( this.editProductForm.value, this.editProductForm.value.pid )
        .subscribe( ({product}) => {

          this.products.push(product);
          this.total ++;
          this.editProductSubmitted = false;
          this.selectProduct(product);
          this.loadProducts();
          this.savingEdit = false;

          Swal.fire('Estupendo', 'El productos se ha editado exitosamente!', 'success');

        }, (err) => {           
          Swal.fire('Error', err.error.msg, 'error');
          this.savingEdit = false;
        });

  }

  /** ======================================================================
   * VALIDATE FORM EDIT
  ====================================================================== */
  validateEditForm( campo:string ): boolean{

    if ( this.editProductForm.get(campo)?.invalid && this.editProductSubmitted ) {      
      return true;
    }else{
      return false;
    }

  }

}
