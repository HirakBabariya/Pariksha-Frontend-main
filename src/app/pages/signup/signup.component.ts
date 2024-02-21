import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private userService:UserService,private snack:MatSnackBar) { }

  public user={
    username:'',
    password:'',
    firstName:'',
    lastName:'',
    email:'',
    phone:''
  }

  ngOnInit(): void {}

  formSubmit(){
    console.log(this.user);
    if(this.user.username=='' || this.user.username==null){
      //alert("user is required!!");
      this.snack.open('Username is required !!','',{
        duration:3000,
      });
    
      return;
    }

    //addUser:userservie
    this.userService.addUser(this.user).subscribe(
      (data:any)=>{
        //success
        console.log(data);
        //alert("success");
        Swal.fire('successfully done !!','User id is '+data.id,'success');
        this.user.username='';
        this.user.password='';
        this.user.email='';
        this.user.firstName='';
        this.user.lastName='';
        this.user.phone='';
      },
      (error)=>
      {
        //error
        console.log(error);
        //alert("something went wrong");
        this.snack.open('Something went wrong!!','',{
          duration:3000
        })
      }
    )
  }

}
