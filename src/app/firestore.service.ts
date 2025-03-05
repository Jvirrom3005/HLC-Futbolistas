import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  eliminarArchivo(fileURL: string) {
    throw new Error('Method not implemented.');
  }

  private collectionName = 'futbolistas-tuNombre';

  constructor(private angularFirestore: AngularFirestore,
              private angularFireStorage: AngularFireStorage) {  }
  
  public insertar(datos: any) {
    return this.angularFirestore.collection(this.collectionName).add(datos);
  }
  
  public consultar() {
    return this.angularFirestore.collection(this.collectionName).snapshotChanges();
  }

  public consultarPorId(id: string) {
    return this.angularFirestore.collection(this.collectionName).doc(id).get();
  }

  public actualizar(id: string, datos: any) {
    return this.angularFirestore.collection(this.collectionName).doc(id).update(datos);
  }

  public eliminar(id: string) {
    return this.angularFirestore.collection(this.collectionName).doc(id).delete();
  }

  public subirImagenBase64(nombreCarpeta: string, nombreArchivo: string, ImagenBase64:string) {
    let storageRef = this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString(ImagenBase64, 'data_url');
  }

  public eliminarArchivoPorURL(url: string) {
    return this.angularFireStorage.storage.refFromURL(url).delete();
  }
}
