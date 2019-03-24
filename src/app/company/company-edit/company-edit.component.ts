import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {from, Observable, of} from "rxjs";
import {Company} from "../../models/company";
import {CompanyService} from "../company.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.css']
})
export class CompanyEditComponent implements OnInit {

  company$: Observable<Company>;

  get id(): string {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  get isNew(): boolean {
    return this.id === 'new';
  }

  constructor(private companyService: CompanyService, private activatedRoute:ActivatedRoute, private router:Router) {
    this.company$ = this.isNew ?
      of({} as Company)
      : this.companyService.getCompanyObservable(this.id);
  }

  ngOnInit() {
  }

  saveCompany(company: Company) {
    this.companyService.saveCompanies(company);
  }

  newCompany(playerid, playerinfo) {
    this.companyService.newCompany(playerid, playerinfo);
  }

  editCompany(company: Company) {
    this.companyService.editCompanies(this.id, company);
  }

  removeCompany() {
    this.companyService.removeCompanies(this.id)
      .then(_ => this.router.navigate(['/company/all']));

  }

}
