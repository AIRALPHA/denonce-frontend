import { Component, OnInit } from '@angular/core';
import {AdminService} from '../service/admin/admin.service';
import {AuthenticationService} from '../service/authentication.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {AlertService} from '../service/alert/alert.service';
import {CouvertureService} from '../service/couverture/couverture.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {

  users:Object = [];
  errors:any;
  couvertures: Object = [];

  constructor(private adminService:AdminService,
              private auth:AuthenticationService,
              private router:Router,
              private alertService:AlertService,
              private couvertureService:CouvertureService) { }

  ngOnInit() {
    this.getUsers();
    this.getCouverture();
  }

  getUsers(){
    this.adminService.getUsers().subscribe(
      data => {
        console.log(data);
        this.users = data;
      }
    )
  }

  /*confirm(user){
    if (confirm("Voulez vous supprimer "+user.nom)){
      console.log(user);
      this.delete(user.id);
    }
  }*/

  showModal(user){
    Swal.fire({
      title: 'Attention !',
      text: 'Supprimer '+user.nom+' ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Supprimer !',
          user.nom+' a été supprimer',
          'success'
        )
        this.delete(user.id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          'Aucune suppression !',
          'error'
        )
      }
    })
  }


  addUser(value){
    console.log(value)
    this.errors = [];
    if (value.password != value.repeatpassword){
      this.errors.push("Les mots de passe ne sont pas identiques");
    }if(!Number(value.tel)){
      this.errors.push("Numero Incorect");
    }
    else{
      this.adminService.addUser(value).subscribe(
        data => {
          console.log(data);
          this.getUsers();
          this.alertService.alert('Utilisateur ajouté !', 'success');
        }, error1 => {
          console.log(error1.error.message);
        }
      )
    }
  }

  delete(id){
    this.adminService.deleteUser(id).subscribe(
      data => {
        console.log(data);
        this.getUsers();
      }
    )
  }

  updateUser(id){
    this.router.navigate(['user', id]);
  }

  getCouverture(){
    this.auth.getCouverture().subscribe(
      data => {
        console.log(data);
        this.couvertures = data;
      }
    )
  }

}
