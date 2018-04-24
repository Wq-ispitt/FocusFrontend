import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {role, roleNum, SelectAttributes} from '../../../../shared/shared-control/attributes';
import {SelectionModel} from '@angular/cdk/collections';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from "../../../../service/user.service";
import {Bhcos, Member} from "../../../../model/User";
import {baseBuildCommandOptions} from "@angular/cli/commands/build";

@Component({
  selector: 'app-assign-member',
  templateUrl: './assign-member.component.html',
  styleUrls: ['./assign-member.component.css']
})
export class AssignMemberComponent implements OnInit {
  public forms: FormGroup;
  members: Member[];
  elements: CheckOpt[] = [];
  bhcos: Bhcos[];
  candidate: roleNum[] = [];
  flag: boolean = false;
  assignedBhco: number;
  assignedMem: number[] = [];

  public selectBhco: SelectAttributes = {name: 'bhco', roles: this.candidate, placeholder: 'Select a BHCO'};

  displayedColumns = ['select', 'name', 'firstname', 'lastname', 'gender', 'dob', 'phone', 'address', 'zipcode'];
  dataSource = null;
  selection = new SelectionModel<any>(true, []);


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public fb: FormBuilder,
              private assignService: UserService) {

  }

  ngOnInit() {
    //this.buildForm();
    this.forms = this.fb.group({
      'bhco': ['', [Validators.required]]
    })
    this.getBhcos();
  }

  buildForm(): void {
    this.forms = this.fb.group({
      'bhco': ['', [Validators.required]]
    })
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.getMembers();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getMembers() {
    this.assignService.getUnassignedMem()
      .subscribe(mems => {
         this.members = mems
        for (let member of this.members) {
           const newElement = new CheckOpt(member);
           this.elements.push(newElement);
        }
        this.dataSource = new MatTableDataSource(this.elements);
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      });
  }

  getBhcos() {
    this.assignService.getBhcos()
      .subscribe(bhco => {
        this.bhcos = bhco
        for (let per of this.bhcos) {
          let can = new roleNum({value: per.id, viewValue: per.username});
          this.candidate.push(can);
        }
      });
  }

  getBhco(value: number) {
      if (value) {
        this.assignedBhco = value;
      }
  }

  getMemberId(value: number) {
    if (value && this.flag === true) {
      this.assignedMem.push(value);
      console.log(this.assignedMem);
    } else if (value && this.flag === false) {
      if (this.assignedMem.length > 0) {
        this.assignedMem.pop();
      }
    }
  }

  assignMember() {
      for (let opt of this.elements) {
        if (opt.isChosen == true) {
          this.assignedMem.push(opt.id);
        }
      }
      this.assignService.assignBHCO(this.assignedBhco, this.assignedMem)
        .subscribe(result => console.log(result));
      console.log(this.assignedMem + "MEMBER");
      //window.location.reload();
  }
}


export class CheckOpt extends Member {
  isChosen: boolean;
  constructor(options: {} = {}) {
    super(options);
    this.isChosen = options['isChosen'] || false;
  }
}

