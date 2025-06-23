import { Injectable } from '@angular/core';
import { SharedService } from '../serviceFolder/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SumService {

  
  constructor(private shared: SharedService) { }
  public plus(a : number, b: number) {
    this.shared.mySharedFunction();
    return a + b;
  }
}
