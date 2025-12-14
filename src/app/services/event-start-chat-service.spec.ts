import { TestBed } from '@angular/core/testing';

import { EventStartChatService } from './event-start-chat-service';

describe('EventStartChatService', () => {
  let service: EventStartChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventStartChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
