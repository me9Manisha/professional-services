import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatGridListModule, MatIconModule, MatMenuModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {LogService} from '../log.service';
import {LogMessage} from '../log_message';

import {LogDisplayComponent} from './log-display.component';

describe('LogDisplayComponent', () => {
  let component: LogDisplayComponent;
  let fixture: ComponentFixture<LogDisplayComponent>;
  let logSvc: LogService;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            MatGridListModule,
            MatFormFieldModule,
            MatButtonModule,
            MatCheckboxModule,
            MatSelectModule,
            MatCardModule,
            MatExpansionModule,
            MatInputModule,
            MatPaginatorModule,
            MatTableModule,
            MatGridListModule,
            MatMenuModule,
            MatIconModule,
            FormsModule,
            BrowserAnimationsModule,
          ],
          providers: [],

          declarations: [
            LogDisplayComponent,
          ]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    logSvc = TestBed.get(LogService);
    (logSvc as any).logToConsole = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get new log messages', async () => {
    expect(component.messages.length).toEqual(0);
    await logSvc.debug('hello world');
    expect(component.messages.length).toEqual(1);
    await logSvc.debug('goodbye world');
    expect(component.messages.length).toEqual(2);
    expect((component.messages[0] as any).message).toEqual('hello world');
    expect((component.messages[1] as any).message).toEqual('goodbye world');

    component.ngOnDestroy();
  });

  it('should paginate log messages', async () => {
    let p: Promise<any>[] = [];
    for (let i = 0; i < 20; i++) {
      p.push(logSvc.debug(`Message ${i}`));
    }
    await Promise.all(p);

    // The first page should already be showing because of the message
    // ingestion.
    expect(component.paginatedMessages.length).toEqual(10);
    expect((component.paginatedMessages[0] as any).message)
        .toEqual('Message 0');

    // Go to the second page.
    (component as any).paginateMessages(1, component.pageSize);
    expect(component.paginatedMessages.length).toEqual(10);
    expect((component.paginatedMessages[0] as any).message)
        .toEqual('Message 10');

    component.ngOnDestroy();
  });
});
