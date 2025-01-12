import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // TODO: Wire up GlobalErrorHandler to the bootstrapApplication in main

  // TODO: replace logging solution/location
  constructor() {}
  //constructor(private logger: LoggingService) {}

  handleError(error) {
    // TODO: add show feedback to the user
    // TODO: replace logging solution/location
    console.log('handleError:error...');
    console.log(error);
  }
}
