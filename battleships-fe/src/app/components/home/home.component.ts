import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BattleshipService } from '../../services/battleship.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  form = new FormGroup({ name: new FormControl(null, Validators.required) });
  isWaitingForOpponent = false;

  constructor(
    private readonly router: Router,
    private readonly battleshipService: BattleshipService
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
  }

  get name() {
    return this.form.get('name');
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formValue = this.form.value;
      this.onStartPlaying(formValue);
      this.isWaitingForOpponent = true;
    }
  }

  onStartPlaying(formValue: any) {
    const name = formValue.name;
    this.battleshipService
      .startGame(name)
      .subscribe(() => this.router.navigate(['/game']));
  }
}
