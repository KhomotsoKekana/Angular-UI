import { SharedService } from "../serviceFolder/shared.service";
import { CalcService } from "./calc.service"
import { TestBed } from "@angular/core/testing";

describe("CalcService", () => {

  let shared: SharedService;
  let calc: CalcService;

  beforeEach(() => {
    console.log("heyyy");
    TestBed.configureTestingModule({
      providers: [CalcService,SharedService]
    });
    shared = TestBed.inject(SharedService);
    calc = TestBed.inject(CalcService);
  })
  it("should multiply two numbers", () => {
    const results = calc.multiply(3,5);
    expect(results).toBe(15);
  })
  it("should cal the share function", () => {
    spyOn(shared,"mySharedFunction");
    const results = calc.multiply(3,5);
    expect(shared.mySharedFunction).toHaveBeenCalled();
  })
})