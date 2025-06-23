import { TestBed } from "@angular/core/testing";
import { SharedService } from "../serviceFolder/shared.service";
import { SumService } from "./sum.service"

describe ('sum', () => {
  let shared : SharedService;
  let sum : SumService;
  beforeEach(()=> {
    // shared = new SharedService();
    // sum = new SumService(shared);
    console.log("hey");

    TestBed.configureCompiler({
      providers: [SharedService,SumService]
    });
    shared = TestBed.inject(SharedService);
    sum = TestBed.inject(SumService);
  });

  it('should add two numbers', () => {
    const theMethod = sum.plus(1,2);
    expect(theMethod).toBe(3);
  })
})