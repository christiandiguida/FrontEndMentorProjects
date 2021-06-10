import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuCloseReason } from '@angular/material/menu/menu';
import { MatDialog } from '@angular/material/dialog';
import { RewardsDialogComponent } from '../rewards-dialog/rewards-dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  @Output()
  closed: EventEmitter<MenuCloseReason> = new EventEmitter();
  constructor(private dialog: MatDialog) {}

  changeMenuIcon() {
    document.getElementById('menuIcon').innerHTML = 'close';
  }
  restoreMenuIcon() {
    document.getElementById('menuIcon').innerHTML = 'menu';
  }
  openDialog() {
    this.dialog.open(RewardsDialogComponent);
  }

  ngOnInit(): void {}
}
