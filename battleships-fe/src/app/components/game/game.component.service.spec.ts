import { TestBed } from '@angular/core/testing';

import { GameComponentService } from './game.component.service';

describe('GameComponentService', () => {
  let service: GameComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
