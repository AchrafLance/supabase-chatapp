import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.css'],

})

export class SettingComponent implements OnInit {
    currentUser: any;
    basicInfoForm: FormGroup;
    educationForm!: FormGroup;
    listOfEducationControl: Array<{ id: number; universite: string, graduationDate: string }> = [];
    experienceForm: FormGroup;
    listOfExperienceControl: Array<{ id: number; entreprise: string, graduationDate: string }> = [];

    constructor(private fb: FormBuilder,
        private authService: AuthenticationService,
        private userService: UserService,
        private messageService: NzMessageService) {
    }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(data => {
            if (data?.fullname) {
                this.currentUser = data;
                this.initBasicInfoForm();
            }
        });
    }

    private initBasicInfoForm(): void {
        this.basicInfoForm = this.fb.group({
            fullname: [this.currentUser.fullname, [Validators.required]],
            nickname: [this.currentUser.nickname, [Validators.required]],
            bio: [this.currentUser.bio, [Validators.required]],
            phone: [this.currentUser.phone, [Validators.required]],
            adresse: [this.currentUser.adresse, [Validators.required]],
            birth_date: [this.currentUser.birth_date, [Validators.required]],
        });
    }

    private getBase64(img: File, callback: (img: {}) => void): void {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }


    submitBasicInfos(): void {
        const basicInfos = {
            fullname: this.basicInfoForm.get('fullname').value,
            nickname: this.basicInfoForm.get('nickname').value,
            bio: this.basicInfoForm.get('bio').value,
            phone: this.basicInfoForm.get('phone').value,
            adresse: this.basicInfoForm.get('adresse').value,
            birth_date: this.basicInfoForm.get('birth_date').value,
        };
        this.userService.updateUserBasicInfos(basicInfos).then(data => {
            const updatedUser = Object.assign(this.currentUser, basicInfos);
            this.authService.currentUserSubject.next(updatedUser);
            this.messageService.success("your data is successfully updated")

        }).catch(error => {
            this.messageService.error(error)
        })
    }


    handleChange(info: { file: NzUploadFile }): void {
        this.getBase64(info.file.originFileObj, (img: string) => {
            this.userService.updateUserAvatar(img).then(data => {
                this.currentUser.avatar_url = img;
                this.authService.currentUserSubject.next(this.currentUser);
            });
        });
    }

}
