import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton, IonList, AlertController } from '@ionic/angular/standalone';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Import ReactiveFormsModule here
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonList
  ]
})
export class RegisterPage implements OnInit {
  registrationForm!: FormGroup;

  constructor(private fb: FormBuilder, public authService: Auth, private router: Router, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form Submitted:', this.registrationForm.value);
      this.authService.register(this.registrationForm.value).subscribe({
        next: (response) => {
          console.log('Successfully registered', response);
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          console.error('Login failed', error);
          this.presentLoginFailedAlert(error.message || 'An unknown error occurred.');
        }
      });
      // Handle form submission logic
    }
  }
  async presentLoginFailedAlert(errorMessage: string) {
    const alert = await this.alertCtrl.create({
      header: 'Registration Failed',
      message: 'Please check your credentials. ' + errorMessage,
      buttons: ['OK']
    });
    await alert.present();
  }
}
