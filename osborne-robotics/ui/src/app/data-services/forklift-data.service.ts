import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, signal } from '@angular/core';
import { Constants } from '../shared/constants';

export interface Forklift {
  name: string;
  modelNumber: string;
  manufacturingDate: string; // TODO: change type to Date
  age?: number;
  dueForAService?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ForkliftDataService {
  // TODO: strongly type this forklift data going in and out of API. Use Forklift interface for this.
  forklifts = signal<any>({});
  constructor(private http: HttpClient) {}

  loadForklifts() {
    this.http.get<any>(Constants.API_FORKLIFTS_GET_ALL).subscribe((x) => {
      // TODO: de-duplicate setting of dueForAService
      const forklifts = x.map((forklift: Forklift) => ({
        ...forklift,
        dueForAService: this.forkLiftRequiresAService(forklift),
      }));
      this.forklifts.set(forklifts);
    });
  }

  forkLiftRequiresAService(forklifts: Forklift): boolean {
    return forklifts.age > Constants.SERVICE_REQUIRED_THRESHOLD;
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(Constants.API_FORKLIFTS_UPLOAD_JSON, formData, {
      headers: new HttpHeaders(),
    });
  }
}

// TODO: add a class to implement HttpInterceptor to intercept requests and responses. Add auth token etc
