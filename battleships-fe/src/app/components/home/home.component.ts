import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  form = new FormGroup({ name: new FormControl(null, Validators.required) });

  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  get name() {
    return this.form.get('name');
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      //TODO: make call to api
      this.router.navigate(['waiting']);
    }
  }
}
