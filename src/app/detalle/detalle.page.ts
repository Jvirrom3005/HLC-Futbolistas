import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Futbolista } from '../futbolista';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

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
  imagenSelec: string;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isNew = this.id === 'nuevo';
    if (!this.isNew) {
      this.consultarFutbolista();
    } else {
      this.document = { id: '', data: { nombre: '', equipo: '' } as Futbolista };
    }
  }

  consultarFutbolista() {
    this.firestoreService.consultarPorId(this.id).subscribe((documento) => {
      this.document = {
        id: documento.id,
        data: documento.data() as Futbolista
      };
    });
  }

  guardarFutbolista() {
    if (this.imagenSelec) {
      this.subirImagen().then((downloadURL) => {
        this.document.data.imagenUrl = downloadURL;
        this.saveFutbolistaData();
      }).catch(error => {
        console.error('Error al subir la imagen: ', error);
      });
    } else {
      this.saveFutbolistaData();
    }
  }

  saveFutbolistaData() {
    if (this.isNew) {
      this.firestoreService.insertar(this.document.data).then(() => {
        console.log('Futbolista creado correctamente');
      }).catch(error => {
        console.error('Error al crear futbolista: ', error);
      });
    } else {
      this.firestoreService.actualizar(this.id, this.document.data).then(() => {
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
    this.firestoreService.eliminar(this.id).then(() => {
      console.log('Futbolista borrado correctamente');
    }).catch(error => {
      console.error('Error al borrar futbolista: ', error);
    });
  }

  async seleccionarImagen() {
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then((result) => {
      // Si no tiene permiso de lectura se solicita al usuario
      if (result == false) {
        this.imagePicker.requestReadPermission();
      } else {
        // Abrir selector de imágenes (ImagePicker)
        this.imagePicker.getPictures({
          maximumImagesCount: 1,  // Permitir sólo 1 imagen
          outputType: 1           // 1 = Base64
        }).then(
          (results) => { // En la variable results se tienen las imágenes seleccionadas
            if (results.length > 0) { // Si el usuario ha elegido alguna imagen
              // EN LA VARIABLE imagenSelec QUEDA ALMACENADA LA IMAGEN SELECCIONADA
              this.imagenSelec = "data:image/jpeg;base64," + results[0];
              console.log("Imagen que se ha seleccionado (en Base64): " + this.imagenSelec);
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }, (err) => {
      console.log(err);
    });
  }

  async subirImagen(): Promise<string> {
    //Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Subiendo imagen...',
    });

    //Mensaje de finalización de subida
    const toast = await this.toastController.create({
      message: 'Imagen subida correctamente',
      duration: 3000
    });

    //Carpeta del storage donde se subirá la imagen
    let carpeta = "futbolistas";

    //Mostrar el mensaje de espera
    await loading.present();

    //Asignar el nombre de la imagen en funcion de la hora actual para
    //evitar duplicidades
    let nombreImagen = `${new Date().getTime()}`;

    //Llamar al método que sube la imagen
    return this.firestoreService.subirImagenBase64(carpeta, nombreImagen, this.imagenSelec).then(snapshot => {
      return snapshot.ref.getDownloadURL().then(downloadURL => {
        //EN LA VARIABLE downloadURL se obtiene la dirección de descarga de la imagen
        console.log("downloadURL:" + downloadURL);
        //Mostrar el mensaje de finalización
        toast.present();
        //Ocultar el mensaje de espera
        loading.dismiss();
        return downloadURL;
      }).catch(error => {
        console.error('Error al obtener la URL de descarga: ', error);
        loading.dismiss();
        throw error;
      });
    }).catch(error => {
      console.error('Error al subir la imagen: ', error);
      loading.dismiss();
      throw error;
    });
  }

  async eliminarImagen(fileURL:string) {

    const toast = await this.toastController.create({
      message: 'Imagen eliminada correctamente',
      duration: 3000
    });
    this.firestoreService.eliminarArchivoPorURL(fileURL).then(() => {
      toast.present();
    }, (err) => {
      console.log(err);
    }
  );
  }

  volver() {
    this.navController.back();
  }

}