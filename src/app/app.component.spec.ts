/* tslint:disable:no-unused-variable */
import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {RouterTestingModule} from "@angular/router/testing";
import {Component, NgModule} from "@angular/core";

@Component({
    template:''
})
class MockLoginComponent { }

@NgModule({
    declarations: [MockLoginComponent],
    exports:      [MockLoginComponent]
})
class MockModule { }



describe('AppComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                MockModule,
                RouterTestingModule.withRoutes([
                    {
                        path: '/',
                        component: MockLoginComponent
                    }
                ]),
            ]
        });
        TestBed.compileComponents();
    });

    it('test', () => {
        const hello = 0;
        expect(hello).toBe(1);
    });

});
