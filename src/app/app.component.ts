import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PostgrestServiceService } from './services/postgrest-service.service';
import { Properties } from './static/Properties';

declare var swal: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  public databaseUrls: string[] = [];
  public currentUrl: string = "";

  public newUrl: string = "";

  public tables: string[] = [];

  public table: string = "";
  public limit: number = 100;
  public offset: number = 0;


  public busy: boolean = false;
  public busyMessage: string = "";

  public tableColumns: string[] = [];
  public tableRows: any[] = [];
  public tableRowToEdit: any;
  public tableRowToEditOriginal: any;
  public editing: boolean = false;

  public MESSAGE_LOADING_TABLES: string = "Loading TABLES";
  public MESSAGE_LOADING_ROWS: string = "Loading ROWS";

  public inserting: boolean = false;

  constructor(
    private _postgrestService: PostgrestServiceService
  ) { }

  ngOnInit() {
    let result: string = localStorage.getItem("databaseUrls");
    if (result) {
      this.databaseUrls = JSON.parse(result)
      this.currentUrl = this.databaseUrls[0]
      this.refreshListOfTables();
    }
  }

  public getRange(): string {
    if (this.offset == 0) {
      return "Rows " + (this.offset + 1) + " to " + (this.offset + this.tableRows.length);
    }
    return "Rows " + this.offset + " to " + (this.offset + this.tableRows.length);
  }

  public setUrl(urlIn: string) {
    this.currentUrl = urlIn
    this.refreshListOfTables();
  }

  public newDatabase(): void {

    var t = this;

    swal({
      title: 'Please enter a grest url',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: function (email) {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            if (!email) {
              reject('Nope.')
            } else {
              resolve()
            }
          }, 800)
        })
      },
      allowOutsideClick: false
    }).then(function (email) {
      t.addUrl(email)
    })


  }

  public addUrl(url: string): void {
    // var url = prompt("Please enter your grest url:", "http://grest.something.com");
    if (url) {
      if (this.databaseUrls.length == 0) {
        this.currentUrl = url;
      }
      this.databaseUrls.push(url)
      this.persistUrls();
      this.refreshListOfTables();
    }

  }

  public newUrlButton(): void {
    if (this.databaseUrls.length == 0) {
      this.currentUrl = this.newUrl;
    }
    this.databaseUrls.push(this.newUrl)
    this.persistUrls();
    this.refreshListOfTables();
  }


  public persistUrls(): void {
    localStorage.setItem("databaseUrls", JSON.stringify(this.databaseUrls))
  }

  public clearDB(): void {
    localStorage.removeItem("databaseUrls");
    this.databaseUrls = [];
    this.tableRows = [];
    this.tableColumns = [];
    swal({
      title: 'Success',
      text: 'The database has been cleared',
      timer: 800,
      onOpen: function () {
        swal.showLoading()
      }
    })
  }

  public refreshListOfTables(): void {
    this.busy = true;
    this.busyMessage = this.MESSAGE_LOADING_TABLES
    let theUrl: string = this.currentUrl;
    this._postgrestService.fetchRows(theUrl)
      .then(results => this.setTables(results));
  }

  public setTables(tables: string[]) {
    this.tables = tables;
    this.setTable(tables[0])
  }

  public refreshTable(): void {
    this.setTable(this.table)
  }

  public setTable(table: string) {
    this.busy = true;
    this.busyMessage = this.MESSAGE_LOADING_ROWS
    this.offset = 0
    this.table = table;
    let theUrl = this.currentUrl + table;
    this.loadTableRows(theUrl, 0, this.limit);

  }

  public loadTableRows(url: string, startNum: number, rows: number) {
    if (rows != 0) {
      url = url + "?limit=" + rows + "&offset=" + startNum
    }
    this._postgrestService.getRows(url)
      .then(res => this.showRows(res))
  }

  public next(): void {
    this.setBusy(true, this.MESSAGE_LOADING_ROWS)
    this.offset = this.offset + this.limit;
    this.loadTableRows(this.currentUrl + this.table, this.offset, this.limit);
  }

  public prev(): void {
    this.setBusy(true, this.MESSAGE_LOADING_ROWS)
    this.offset = this.offset - this.limit;

    if (this.offset < 0) {
      this.offset = 0;
    }
    this.loadTableRows(this.currentUrl + this.table, this.offset, this.limit);
  }

  public showRows(blob: any) {

    this.tableColumns = [];

    let row: any = blob[0];
    for (var key in row) {
      if (row.hasOwnProperty(key)) {
        this.tableColumns.push(key);
      }
    }

    let count: number = this.offset;
    if (count == 0) {
      count = 1;
    }
    this.tableRows = [];
    for (let tableRow of blob) {
      var thisRow: any = {

      };
      for (var key in row) {
        if (tableRow.hasOwnProperty(key)) {
          Reflect.set(thisRow, key, tableRow[key]);
        }
      }
      count = count + 1;
      this.tableRows.push(thisRow);
    }

    var component = this;
    setTimeout(function () {
      component.setBusy(false, "")
    }, 800);

    // this.busyMessage = ""
    // this.busy = false;

  }

  public setBusy(val: boolean, msg: string) {
    this.busy = val;
    this.busyMessage = msg;
  }


  public edit(rowPassed: any, i: number): void {
    this.editing = true;
    this.tableRowToEdit = rowPassed;
    this.tableRowToEditOriginal = JSON.stringify(rowPassed);


  }

  public getTableRowToEdit(col: string): string {
    if (!col) {
      console.log("Not col!")
      return "";
    }
    if (!this.tableRowToEdit) {
      console.log("Not tableRowToEdit!")
      return "";
    }

    var test = this.tableRowToEdit[col];
    if (!test) {
      console.log("Not test!")
      return "";
    }

    return test;


  }

  public saveEdit(): void {
    this._postgrestService.doPatch(this.currentUrl + this.table + "?id=eq." + this.tableRowToEdit['id'], this.tableRowToEdit)
      .catch(error => console.log(error))
      .then(res => this.cancelEdit())

  }

  public cancelEdit(): void {
    this.editing = false;

  }

  public deleteRowButton(row: any): void {
    var t = this;
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(function () {
      t.deleteRow(row)
    }).catch(function () {
      console.log("Cancelled")
    })



  }

  public deleteRow(row: any) {
    var t = this;
    this._postgrestService.doDelete(this.currentUrl + this.table + "?id=eq." + row['id'])
      .catch(error => console.log(error))
      .then(v => t.refreshTable()
      )

  }





}
