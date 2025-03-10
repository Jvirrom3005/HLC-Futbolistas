import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Futbolista } from '../futbolista';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  futbolistas: Futbolista[];

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.firestoreService.consultarTodos().subscribe((futbolistasSnapshot) => {
      this.futbolistas = futbolistasSnapshot.map((documento) => {
        return {
          id: documento.payload.doc.id,
          ...documento.payload.doc.data() as Futbolista
        };
      });
    });
  }

  verDetalle(id: string) {
    // Navigate to the detail page
  }
}
