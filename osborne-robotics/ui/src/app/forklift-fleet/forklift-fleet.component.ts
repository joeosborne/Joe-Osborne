import { Component, OnInit } from '@angular/core';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { ForkliftDataService } from '../data-services/forklift-data.service';
import { CommonModule, NgForOf, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Constants } from '../shared/constants';

@Component({
  selector: 'app-forklift-fleet',
  imports: [
    FileUploadComponent,
    NgStyle,
    NgForOf,
    NgIf,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './forklift-fleet.component.html',
  styleUrl: './forklift-fleet.component.css',
  standalone: true,
})
export class ForkliftFleetComponent implements OnInit {
  forklifts: any;
  onlyShowServiceableForklifts = false;

  constructor(private forkliftService: ForkliftDataService) {
    this.forklifts = this.forkliftService.forklifts;
  }

  ngOnInit(): void {
    this.forkliftService.loadForklifts();
  }

  protected readonly Constants = Constants;
}
