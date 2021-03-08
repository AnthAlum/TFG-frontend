import { Component, Input, OnInit } from '@angular/core';
import { Client } from '../client';
import { GetClientsComponent } from '../get-clients/get-clients.component';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.css']
})
export class ClientCardComponent implements OnInit {

  @Input() client: Client;
  @Input() reference: GetClientsComponent;
  constructor() {
  }

  ngOnInit(): void {
  }

  goToModifyClient(): void{
    this.reference.goToModifyClient(this.client.idClient);
  }

  askForDeleteClient(): void{
    this.reference.askForDeleteClient(this.client.idClient.toString(), this.client);
  }
}
