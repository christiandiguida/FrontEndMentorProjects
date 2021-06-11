import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuCloseReason } from '@angular/material/menu/menu';
import { MatDialog } from '@angular/material/dialog';
import { RewardsDialogComponent } from '../rewards-dialog/rewards-dialog.component';
import { Project } from 'src/app/classes/project';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  static project: Project = {
    total: 100000,
    totalBacked: 89814,
    backers: 5007,
    daysLeft: 56,
  };
  constructor(private dialog: MatDialog) {}

  get getProject() {
    return MainComponent.project;
  }
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
