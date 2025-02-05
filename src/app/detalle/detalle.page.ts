import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Futbolista } from '../futbolista';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit {
  id: string;
  document: { id: string, data: Futbolista };
  isNew: boolean;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isNew = this.id === 'nuevo';
    if (!this.isNew) {
      this.consultarFutbolista();
    } else {
      this.document = { id: '', data: {} as Futbolista };
    }
  }

  consultarFutbolista() {
    this.firestoreService.consultarPorId('futbolistas', this.id).subscribe((documento) => {
      this.document = {
        id: documento.id,
        data: documento.data() as Futbolista
      };
    });
  }

  guardarFutbolista() {
    if (this.isNew) {
      this.firestoreService.insertar('futbolistas', this.document.data).then(() => {
        console.log('Futbolista creado correctamente');
      }).catch(error => {
        console.error('Error al crear futbolista: ', error);
      });
    } else {
      this.firestoreService.actualizar('futbolistas', this.id, this.document.data).then(() => {
        console.log('Futbolista modificado correctamente');
      }).catch(error => {
        console.error('Error al modificar futbolista: ', error);
      });
    }
  }

  async confirmarBorrado() {
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: '¿Estás seguro de que deseas borrar este futbolista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Borrado cancelado');
          }
        }, {
          text: 'Borrar',
          handler: () => {
            this.borrarFutbolista();
          }
        }
      ]
    });

    await alert.present();
  }

  borrarFutbolista() {
    this.firestoreService.eliminar('futbolistas', this.id).then(() => {
      console.log('Futbolista borrado correctamente');
    }).catch(error => {
      console.error('Error al borrar futbolista: ', error);
    });
  }
}
