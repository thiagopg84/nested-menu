import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { MenuItem } from '../models/menu-item.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor() { }

  getItems(menuItem: MenuItem): Observable<MenuItem[]> {
    const children: MenuItem[] = [];
    let randomNum = Math.round(Math.random() * 10);
    let randomDelay = Math.round(Math.random() * 1500);
    console.log(randomNum)
    for (let i = 1; i <= randomNum; i++) {
      children.push({
        title: `${menuItem.title}a`,
        id: `${menuItem.id}a_${i}`
      })
    }
    return of(children).pipe(delay(randomDelay));
  }
}
