import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import {
  Forklift,
  ForkliftDataService,
} from '../data-services/forklift-data.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  imports: [NgIf, CommonModule],
  standalone: true,
})
export class FileUploadComponent {
  errorMsg: string = '';
  message: string = '';
  selectedFile: File | null = null;

  constructor(private forkliftService: ForkliftDataService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!!input && input.files && !!input.files.length) {
      this.selectedFile = input.files[0];
      this.message = '';
      this.errorMsg = '';
    }
  }

  upload(): void {
    if (!this.selectedFile) {
      this.errorMsg = 'Please select a file.';
      return;
    }

    this.forkliftService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        // TODO: de-duplicate setting of dueForAService
        response.forklifts = response.forklifts.map((forklift: Forklift) => ({
          ...forklift,
          dueForAService:
            this.forkliftService.forkLiftRequiresAService(forklift),
        }));

        this.forkliftService.forklifts.set(response.forklifts);
        this.message = `Success: ${response.message}, Total Items: ${response.totalItems}`;
      },
      error: (error) => {
        this.errorMsg =
          'There was an error uploading this file. Please check that it is formatted correctly and try again';
      },
    });
  }
}
