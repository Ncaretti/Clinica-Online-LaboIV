import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user!: any;
  constructor(private auth: Auth){}
  
  register(email : any, pass : any)
  {
    createUserWithEmailAndPassword(this.auth, email, pass)
    .then((data)=>
      this.auth.currentUser
    )
  }

  getUid(){
    return this.auth.currentUser?.uid;
  }
}
