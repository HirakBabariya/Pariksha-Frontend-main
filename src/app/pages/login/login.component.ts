import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData={
    username:'',
    password:''
  }

  stateForm : FormGroup;
  stateMasterData : any =[
  {id:'1',name:'Gujarat',value:'Gujarat'},
  {id:'2',name:'Punjab',value:'Punjab'},
  {id:'3',name:'Haryana',value:'Haryana'},
  {id:'4',name:'Goa',value:'Goa'},
  {id:'5',name:'Kerala',value:'Kerala'},
  {id:'6',name:'Bihar',value:'Bihar'},
  {id:'7',name:'Tamilnadu',value:'Tamilnadu'}]
  stateData : any = []

  constructor(private snack:MatSnackBar,private login:LoginService,private router:Router, private fb : FormBuilder) { }

  ngOnInit(): void {
    this.stateFormControls();
    this.stateData = this.stateMasterData;
    this.pushStateControls();
    // console.log("data",this.stateMasterData);
  }

stateFormControls(){
  this.stateForm = this.fb.group({
    geoMarketFocus : this.fb.array([
      // this.createStateArrayControls()
    ])
  })
}

createStateArrayControls(data?){
  return this.fb.group({
    stateId : [null],
    geoMarketLimit : [null],
    data: [data]
  })
  
}

pushStateControls(){
  // console.log("Called");
  
  const add = this.stateForm.get('geoMarketFocus') as FormArray
  add.push(this.createStateArrayControls(this.stateMasterData));
}

filterData(value, arr,index){
console.log("value",value);
console.log("arr",arr);
// if(value != null && value != undefined && value != ''){
//   let abc = this.stateMasterData.filter(f => f.name.toLowerCase().startsWith(value.toLowerCase()))
// abc.length > 0 ? this.stateMasterData = abc : this.stateMasterData = this.stateData
// value = null;
// }else{
//   this.stateMasterData = this.stateData
// }

if(value != null && value != undefined && value != ''){
  let abc = arr.filter(f => f.name.toLowerCase().startsWith(value.toLowerCase()))
abc.length > 0 ? arr = abc : arr = this.stateMasterData
value = null;
}else{
  arr = this.stateMasterData
}
console.log("this.stateForm",this.stateForm);

this.stateForm.controls.geoMarketFocus['controls'][index].controls.data.setValue(arr);
}

submit(){
  this.stateForm.controls.geoMarketFocus['controls'].forEach(ctrl => {
    ctrl.removeControl('data')
  })
  console.log("Form ",this.stateForm);
  console.log("Raw value",this.stateForm.getRawValue());
  
}

isDisableVal(data){
  let tempArr = []
  this.stateForm.controls.geoMarketFocus['controls'].forEach(e => {
    if(e.controls.stateId.value != null && e.controls.stateId.value != undefined && e.controls.stateId.value != ''){
      tempArr.push(e.controls.stateId.value);
    }
  })
  console.log("tempArr",tempArr);
  
  data.forEach(obj => {
    if(tempArr.includes(obj.id)){
      obj.isDisable = true;
    }else{
      obj.isDisable = false;
    }
  })
  console.log("data",data);
  
}

deleteState(data,index){
  const add = this.stateForm.get('geoMarketFocus') as FormArray
  add.removeAt(index);
  this.isDisableVal(data)
}

  formSubmit(){
    console.log('login btn clicked');
    if(this.loginData.username.trim()=='' || this.loginData.username==null){
      this.snack.open('Username is required !!','',{
        duration:3000,
      });
      return;
    }
    if(this.loginData.password.trim()=='' || this.loginData.password==null){
      this.snack.open('Password is required !!','',{
        duration:3000,
      });
      return;
    }

    //request to server to generate token
    this.login.generateToken(this.loginData).subscribe(
      (data:any)=>{
        console.log("Success");
        console.log(data);

        //login
        this.login.loginUser(data.token);
        this.login.getCurrentUser().subscribe(
          (user:any)=>{
            this.login.setUser(user);
            console.log(user);
            //redirect...ADMIN : Admin dashboard
            //redirect...NORMAL: Normal dashboard
            if(this.login.getUserRole()=='ADMIN'){
              //admin dashboard
              //window.location.href='/admin';
              this.router.navigate(['admin']);
              this.login.loginStatusSubject.next(true);
            }
            else if(this.login.getUserRole()=='NORMAL'){
              //normal user dashboard
              //window.location.href='/user-dashboard';
              this.router.navigate(['user-dashboard/0']);
              this.login.loginStatusSubject.next(true);
            }
            else{
              this.login.logout();
              
            }
          }
        );
      },
      (error)=>{
        console.log('Error!!');
        console.log(error);
        this.snack.open("Invalid Details !! Tra Again",'',{
          duration:3000
        });
      }
    )
  }
}
