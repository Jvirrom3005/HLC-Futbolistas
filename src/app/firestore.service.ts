import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) {  }
  
  public insertar(coleccion : string, datos : any){
    return this.angularFirestore.collection(coleccion).add(datos);
  }
  
  public consultar(coleccion : string){
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public consultarPorId(coleccion: string, id: string) {
    return this.angularFirestore.collection(coleccion).doc(id).get();
  }

  public actualizar(coleccion: string, id: string, datos: any) {
    return this.angularFirestore.collection(coleccion).doc(id).update(datos);
  }

  public eliminar(coleccion: string, id: string) {
    return this.angularFirestore.collection(coleccion).doc(id).delete();
  }
}
