import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TabGroupComponent } from "./tab-group.component"
import { BreakpointObserver } from "@angular/cdk/layout";
import { observeOn, of } from "rxjs";

describe ('tab-group', () => {
    let component: TabGroupComponent;
    let fixture: ComponentFixture<TabGroupComponent>;

    const testBreakpointObserver = {
        observe: () => of({matches: false})
    };
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TabGroupComponent],
            providers : [{provide: BreakpointObserver, useValue:testBreakpointObserver}]
        }).compileComponents();
    })

    fixture = TestBed.createComponent(TabGroupComponent);
    component = fixture.componentInstance;

    xit('should filter out hidden tabs', () => {
        component.tabs = [
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2', hidden: true },
            { id: 'tab3', label: 'Tab 3', hideInMobile: true }
        ];

        component.isMobile = true;
        expect(component.visibleTabs.length).toBe(1);
        expect(component.visibleTabs[0].id).toBe('tab1');
    });

    it('should create ', ()=> {
        expect(component).toBeTruthy();
    });

    xit('should clear activeTabId if all tabs are hidden', () => {
        component.tabs = [
            { id: 'tab1', label: 'Tab 1', hidden: true },
            { id: 'tab2', label: 'Tab 2', hidden: true }
        ];
        component.activeTabId = 'tab1';

        component.ngOnChanges({
            tabs: { previousValue: [], currentValue: component.tabs, firstChange: false, isFirstChange: () => false }
        });

        expect(component.activeTabId).toBeNull();
    });
})