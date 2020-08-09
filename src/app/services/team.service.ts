import { Injectable, ɵPlayer } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from './../interfaces/team';
export const TemasTableHeaders = ['name', 'country', 'players'];

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private teamsDb: AngularFireList<Team>;
  constructor(private db: AngularFireDatabase) {
    this.teamsDb = this.db.list('/teams', (ref) => ref.orderByChild('name'));
  }

  getTeams(): Observable<Team[]> {
    return this.teamsDb.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }

  addTeam(player: Team) {
    return this.teamsDb.push(player);
  }

  deleteTeam(id: string) {
    this.db.list('/teams').remove(id);
  }

  editTeam(newPlayerData) {
    const $key = newPlayerData.$key;
    delete newPlayerData.$key;
    this.db.list('/teams').update($key, newPlayerData);
  }
}
