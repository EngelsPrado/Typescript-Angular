import { Injectable, ɵPlayer } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersDb: AngularFireList<ɵPlayer>;

  constructor(private db: AngularFireDatabase) {
    this.playersDb = this.db.list('/players', (ref) =>
      ref.orderByChild('name')
    );
  }

  getPlayers(): Observable<ɵPlayer[]> {
    return this.playersDb.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }

  addPlayer(player: ɵPlayer) {
    return this.playersDb.push(player);
  }

  deletePlayer(id: string) {
    this.db.list('/players').remove(id);
  }

  editPlayer(newPlayerData) {
    const $key = newPlayerData.$key;
    delete newPlayerData.$key;
    this.db.list('/players').update($key, newPlayerData);
  }
}
