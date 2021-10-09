import { Component } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SupabaseService } from 'src/app/shared/services/supabase.service';


@Component({
    templateUrl: './login.component.html'
})

export class LoginComponent {
    loginForm: FormGroup;

    submitForm(): void {
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[ i ].markAsDirty();
            this.loginForm.controls[ i ].updateValueAndValidity();
        }
    }

    constructor(private fb: FormBuilder, private authService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: [ null, [ Validators.required ] ],
            password: [ null, [ Validators.required ] ]
        });
    }

    signInWithGoogle() {
        this.authService.loginWithGoogle();
    }
}
