import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject, SnapshotAction} from "@angular/fire/database";
import {Company} from "../models/company";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private companyRef: AngularFireObject<Company>;
  private newRef: AngularFireObject<Company>;
  private companiesRef: AngularFireList<Company>;

  constructor(private db: AngularFireDatabase) {
    this.companyRef = this.db.object<Company>(`company`);
    this.newRef = this.db.object<Company>(`company`);
    this.companiesRef = this.db.list<Company>(`companies`);
  }

  getCompaniesObservable(): Observable<Company[]> {
    return this.companiesRef.snapshotChanges()
      .pipe(
        map((items: SnapshotAction<Company>[]): Company[] => {
          return items.map((item: SnapshotAction<Company>): Company => {
            return {
              $key: item.key,
              name: item.payload.val().name,
              phone: item.payload.val().phone
            };
          });
        })
      );
  }

  getCompanyObservable(id): Observable<Company> {
    // @ts-ignore
    return this.db.object(`companies/${id}`).valueChanges();
  }

  saveCompany(company: Company) {
    this.companyRef.set(company);
  }

  editCompany(company: any) {
    this.companyRef.update(company)
      .then(_ => console.log('update'))
      .catch(error => console.log('update', error));
  }

  newCompany(playerid, playerinfo) {
    // const list = this.db.list(`companies/player1`);
    // list.push({company2: "random"});
    this.newRef = this.db.object<Company>(`players/${playerid}`);
    this.newRef.set(playerinfo);
  }

  removeCompany() {
    this.companyRef.remove();
  }

  saveCompanies(company: Company) {
    this.companiesRef.push(company)
      .then(_ => console.log('success on update'));

  }

  editCompanies(key: string, company: any){
    this.companiesRef.update(key, company)
      .then(_ => console.log('success on update'))
      .catch(error => console.log('failed', error));


  }

  removeCompanies(key:string) {
    return this.companiesRef.remove(key).then(_ => console.log('success on remove'))
      .catch(error => console.log('failed', error));
  }

}
