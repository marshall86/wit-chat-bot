import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WitMessageResponse } from '../interfaces/IWit';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnDestroy {

  chat = {
    message: '',
    answer: ''
  };
  newMessage = '';

  private destroyed = new Subject();

  constructor(private dataService: DataService) { }

  getWitMessageResponse(message: string): void {
    this.dataService.getWitMessage(message)
      .pipe(
        takeUntil(this.destroyed)
      )
      .subscribe({
        next: (r: WitMessageResponse) => this.chat.answer = this.getEntityResponse('datetime', r.entities),
        error: (e) => console.log(e)
      });
  }

  ngOnDestroy(): void {
    this.destroyed.complete();
    this.destroyed.unsubscribe();
  }

  getEntityResponse(name: string, entities: unknown[]): string {

    let res = 'I am sorry, I can not answer to your question';
    const entityRes = this.entitiesFilterByName(name, entities);

    if (entityRes) {

      if (name === 'datetime') {
        res = new Date(entityRes).toLocaleTimeString();
      }

    }

    return res;

  }

  entitiesFilterByName(name: string, entities: unknown[]): string {
    const filteredEntity = Object.keys(entities).filter((ent) => ent.includes(name)).pop(); // contains the entity key corresponding to the name we want

    if (filteredEntity) {
      const entityRes = (entities as { [key: string]: any })[filteredEntity].pop();
      return entityRes ? entityRes.value : '';
    } else {
      return '';
    };
  }

  sendMessage(): void {
    this.chat = {
      answer: '',
      message: ''
    };

    if (this.newMessage.trim() === '') {
      return;
    }

    try {
      this.chat.message = this.newMessage;
      this.newMessage = '';
      this.getWitMessageResponse(this.chat.message);
    } catch (err) {
      this.chat.message = '';
    }
  }

}
