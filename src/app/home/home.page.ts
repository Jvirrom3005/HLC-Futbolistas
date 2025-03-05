import { Component } from '@angular/core';
import { Futbolista } from '../futbolista';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  futbolistaEditando: Futbolista;
  arrayColeccionFutbolistas: any = [{
    id: "",
    data: {} as Futbolista
  }];

  constructor(private firestoreService: FirestoreService, private router: Router) {
    //crea una futbolista vacía al empezar
    this.futbolistaEditando = {} as Futbolista;
    this.obneterListaFutbolistas();
  }

  clicBotonInsertar() {
    this.firestoreService.insertar(this.futbolistaEditando)
      .then(() => {
        console.log('futbolista creada correctamente');
        //Limpiando el contenido de futbolistaEditando
        this.futbolistaEditando = {} as Futbolista;
      }, (error) => {
        console.error(error);
      });
  }

  obneterListaFutbolistas() {
    this.firestoreService.consultar().subscribe((resultadoConsultaFutbolistas) => {
      this.arrayColeccionFutbolistas = [];
      resultadoConsultaFutbolistas.forEach((datosFutbolista: any) => {
        this.arrayColeccionFutbolistas.push({
          id: datosFutbolista.payload.doc.id,
          data: datosFutbolista.payload.doc.data()
        });
      });
    });
  }

  selectFutbolista(idFutbolistaSelect: string) {
    this.router.navigate(['/detalle', idFutbolistaSelect]);
  }

  navigateToAddFutbolista() {
    this.router.navigate(['/detalle', 'nuevo']);
  }
}
