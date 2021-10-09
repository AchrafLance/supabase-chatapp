import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
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




    networkList = [
        {
            name: 'Facebook',
            icon: 'facebook',
            avatarColor: '#4267b1',
            avatarBg: 'rgba(66, 103, 177, 0.1)',
            status: true,
            link: 'https://facebook.com'
        },
        {
            name: 'Instagram',
            icon: 'instagram',
            avatarColor: '#fff',
            avatarBg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)',
            status: false,
            link: 'https://instagram.com'
        },
        {
            name: 'Twitter',
            icon: 'twitter',
            avatarColor: '#1ca1f2',
            avatarBg: 'rgba(28, 161, 242, 0.1)',
            status: true,
            link: 'https://twitter.com'
        },
        {
            name: 'Dribbble',
            icon: 'dribbble',
            avatarColor: '#d8487e',
            avatarBg: 'rgba(216, 72, 126, 0.1)',
            status: false,
            link: 'https://dribbble.com'
        },
        {
            name: 'Github',
            icon: 'github',
            avatarColor: '#323131',
            avatarBg: 'rgba(50, 49, 49, 0.1)',
            status: true,
            link: 'https://github.com'
        },
        {
            name: 'Linkedin',
            icon: 'linkedin',
            avatarColor: '#0174af',
            avatarBg: 'rgba(1, 116, 175, 0.1)',
            status: true,
            link: 'https://linkedin.com'
        },
        {
            name: 'Dropbox',
            icon: 'dropbox',
            avatarColor: '#005ef7',
            avatarBg: 'rgba(0, 94, 247, 0.1)',
            status: false,
            link: 'https://dropbox.com'
        }
    ];

    notificationConfigList = [
        {
            title: 'Everyone can look me up',
            desc: 'Allow people found on your public.',
            icon: 'user',
            color: 'ant-avatar-blue',
            status: true
        },
        {
            title: 'Everyone can contact me',
            desc: 'Allow any peole to contact.',
            icon: 'mobile',
            color: 'ant-avatar-cyan',
            status: true
        },
        {
            title: 'Show my location',
            desc: 'Turning on Location lets you explore what\'s around you.',
            icon: 'environment',
            color: 'ant-avatar-gold',
            status: false
        },
        {
            title: 'Email Notifications',
            desc: 'Receive daily email notifications.',
            icon: 'mail',
            color: 'ant-avatar-purple',
            status: true
        },
        {
            title: 'Unknow Source ',
            desc: 'Allow all downloads from unknow source.',
            icon: 'question',
            color: 'ant-avatar-red',
            status: false
        },
        {
            title: 'Data Synchronization',
            desc: 'Allow data synchronize with cloud server',
            icon: 'swap',
            color: 'ant-avatar-green',
            status: true
        },
        {
            title: 'Groups Invitation',
            desc: 'Allow any groups invitation',
            icon: 'usergroup-add',
            color: 'ant-avatar-orange',
            status: true
        },
    ];

    constructor(private fb: FormBuilder,
                private modalService: NzModalService,
                private message: NzMessageService,
                private supabase: SupabaseService,
                private authService: AuthenticationService,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(data => {
            this.currentUser = data;


            // BASIC INFOS FORM
            this.basicInfoForm = this.fb.group({
                fullname: [this.currentUser.fullname, [Validators.required]],
                nickname: [this.currentUser.nickname, [Validators.required]],
                profile: [this.currentUser.profile, [Validators.required]],
                bio: [this.currentUser.bio, [Validators.required]],
                phone: [this.currentUser.phone, [Validators.required]],
                adresse: [this.currentUser.adresse, [Validators.required]],
                birth_date: [this.currentUser.birth_date, [Validators.required]],
            });

            // EDUCATION INFOS FORM

            this.educationForm = this.fb.group({});
            this.listOfEducationControl = [];

            if (this.currentUser.education) {
                const length = this.currentUser.education.length;
                console.log(length);
                for (let i = 0; i < length; i++) {
                    this.listOfEducationControl.push({  // initialise the array of form controls
                        id: i, universite: `universite${i}`,
                        graduationDate: `graduationDate${i}`
                    });
                    this.educationForm.addControl( // affect controls to the form with their initial value
                        this.listOfEducationControl[i].universite,
                        new FormControl(this.currentUser.education[i].universite, Validators.required)
                    );
                    this.educationForm.addControl(
                        this.listOfEducationControl[i].graduationDate,
                        new FormControl(this.currentUser.education[i].graduationDate)
                    );
                }
            }

            // EXPERIENCE INFOS FORM

            this.experienceForm = this.fb.group({});
            this.listOfExperienceControl = [];

            if (this.currentUser.experience) {
                const length = this.currentUser.experience.length;
                for (let i = 0; i < length; i++) {
                    this.listOfExperienceControl.push({  // initialise the array of form controls
                        id: i, entreprise: `entreprise${i}`,
                        graduationDate: `graduationDate${i}`
                    });
                    this.experienceForm.addControl( // affect controls to the form with their initial value
                        this.listOfExperienceControl[i].entreprise,
                        new FormControl(this.currentUser.experience[i].entreprise, Validators.required)
                    );
                    this.experienceForm.addControl(
                        this.listOfExperienceControl[i].graduationDate,
                        new FormControl(this.currentUser.experience[i].graduationDate)
                    );
                }
            }



        });
    }


    //////////////////////////////////////////////////////////////////////////////////
    // START: BASIC INFO FORM METHODS
    //////////////////////////////////////////////////////////////////////////////////

    submitBasicInfos() {
        const basicInfos = {
            fullname: this.basicInfoForm.get('fullname').value,
            nickname: this.basicInfoForm.get('nickname').value,
            profile: this.basicInfoForm.get('profile').value,
            bio: this.basicInfoForm.get('bio').value,
            phone: this.basicInfoForm.get('phone').value,
            adresse: this.basicInfoForm.get('adresse').value,
            birth_date: this.basicInfoForm.get('birth_date').value,
        };
        this.userService.updateUserBasicInfos(basicInfos).then(data => {
            const updatedUser = Object.assign(this.currentUser, basicInfos);
            this.authService.currentUserSubject.next(updatedUser);

            alert('data updated');

        });
    }

    // UPDATE USER AVATAR
    private getBase64(img: File, callback: (img: {}) => void): void {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange(info: { file: NzUploadFile }): void {
        this.getBase64(info.file.originFileObj, (img: string) => {
            this.userService.updateUserAvatar(img).then(data => {
                this.currentUser.avatarurl = img;
                this.authService.currentUserSubject.next(this.currentUser);
            });
        });
    }

  //////////////////////////////////////////////////////////////////////////////////
  // END: BASIC INFO FORM METHODS
  //////////////////////////////////////////////////////////////////////////////////


  //////////////////////////////////////////////////////////////////////////////////
  // START: EDUCTAION FORM METHODS
  //////////////////////////////////////////////////////////////////////////////////

  addEducationField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfEducationControl.length > 0 ? this.listOfEducationControl[this.listOfEducationControl.length - 1].id + 1 : 0;

    const control = {
      id,
      universite: `universite${id}`,
      graduationDate: `graduationDate${id}`

    };
    const index = this.listOfEducationControl.push(control);

    this.educationForm.addControl(
      this.listOfEducationControl[index - 1].universite,
      new FormControl(null, Validators.required)
    );
    this.educationForm.addControl(
        this.listOfEducationControl[index - 1].graduationDate,
        new FormControl(null)
      );
  }

  removeEducationField(i: {  id: number; universite: string, graduationDate: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfEducationControl.length > 1) {
      const index = this.listOfEducationControl.indexOf(i);
      this.listOfEducationControl.splice(index, 1);
      this.educationForm.removeControl(i.universite);
      this.educationForm.removeControl(i.graduationDate);
    }
    console.log(this.listOfEducationControl);
    console.log(this.educationForm.controls);
  }

  submitEducationForm(){
      const education: Array<{universite: string, graduationDate: string }> = [];
      for (let i = 0; i < this.listOfEducationControl.length; i++){
        const field = {
            universite: this.educationForm.get(`universite${i}`).value,
            graduationDate: this.educationForm.get(`graduationDate${i}`).value
        };
        education.push(field);
        console.log(education);
      }
      this.userService.updateUserEducation(education).then(data => {
        this.currentUser.education = education;
        this.authService.currentUserSubject.next(this.currentUser);
        alert('education updated');
      }).catch(error => {
          alert(error.message);
      });
  }

  //////////////////////////////////////////////////////////////////////////////////
  // END: EDUCTAION FORM METHODS
  //////////////////////////////////////////////////////////////////////////////////


  //////////////////////////////////////////////////////////////////////////////////
  // START: EXPERIENCE FORM METHODS
  //////////////////////////////////////////////////////////////////////////////////

  addExperienceField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfExperienceControl.length > 0 ? this.listOfExperienceControl[this.listOfExperienceControl.length - 1].id + 1 : 0;

    const control = {
      id,
      entreprise: `entreprise${id}`,
      graduationDate: `graduationDate${id}`

    };
    const index = this.listOfExperienceControl.push(control);

    this.experienceForm.addControl(
      this.listOfExperienceControl[index - 1].entreprise,
      new FormControl(null, Validators.required)
    );
    this.experienceForm.addControl(
        this.listOfExperienceControl[index - 1].graduationDate,
        new FormControl(null)
      );
  }

  removeExperienceField(i: {  id: number; entreprise: string, graduationDate: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfExperienceControl.length > 1) {
      const index = this.listOfExperienceControl.indexOf(i);
      this.listOfExperienceControl.splice(index, 1);
      this.experienceForm.removeControl(i.entreprise);
      this.experienceForm.removeControl(i.graduationDate);
    }
  }


  submitExperienceForm(){
    const experience: Array<{entreprise: string, graduationDate: string }> = [];
    for (let i = 0; i < this.listOfExperienceControl.length; i++){
      const field = {
          entreprise: this.experienceForm.get(`entreprise${i}`).value,
          graduationDate: this.experienceForm.get(`graduationDate${i}`).value
      };
      experience.push(field);
    }
    this.userService.updateUserExperience(experience).then(data => {
      this.currentUser.experience = experience;
      this.authService.currentUserSubject.next(this.currentUser);
      alert('exprience updated');
    }).catch(error => {
        alert(error.message);
    });

  }

  //////////////////////////////////////////////////////////////////////////////////
  // END: EXPERIENCE FORM METHODS
  //////////////////////////////////////////////////////////////////////////////////
}
