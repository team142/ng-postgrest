import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PostgrestServiceService } from './services/postgrest-service.service';

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

  constructor(
    private _postgrestService: PostgrestServiceService
  ) {

  }

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
      return "Rows " + (this.offset + 1) + " to " + (this.offset + this.limit);
    }
    return "Rows " + this.offset + " to " + (this.offset + this.limit);
  }

  public setUrl(urlIn: string) {
    this.currentUrl = urlIn
    this.refreshListOfTables();
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
    alert("Done")
  }

  public say(): void {
    alert(this.currentUrl)
  }

  public callService(): void {
    this._postgrestService.getStuff(this.currentUrl);
  }

  //Land 'o neat
  public refreshListOfTables(): void {
    var div = document.getElementById("tableHere").innerHTML = "";
    this.busy = true;
    this.busyMessage = "Loading tables..."
    let theUrl: string = this.currentUrl;
    this._postgrestService.getStuff(theUrl)
      .then(results => this.setTables(results));
  }

  public setTables(tables: string[]) {
    this.tables = tables;
    this.setTable(tables[0])
  }

  public setTable(table: string) {
    var div = document.getElementById("tableHere").innerHTML = "";
    this.busy = true;
    this.busyMessage = "Loading rows..."
    this.offset = 0
    this.table = table;
    let theUrl = this.currentUrl + table;
    this.loadTableRows(theUrl, 0, 100);

  }

  public loadTableRows(url: string, startNum: number, rows: number) {
    url = url + "?limit=" + rows + "&offset=" + startNum
    this._postgrestService.getRows(url)
      .then(res => this.showRows(res))
  }

  public next(): void {
    this.offset = this.offset + this.limit;
    this.loadTableRows(this.currentUrl + this.table, this.offset, this.limit);
  }

  public prev(): void {
    this.offset = this.offset - this.limit;

    if (this.offset < 0) {
      this.offset = 0;
    }
    this.loadTableRows(this.currentUrl + this.table, this.offset, this.limit);
  }

  public showRows(blob: any) {
    var div = document.getElementById("tableHere");
    div.setAttribute('class','');
    let divString = "";
    divString = '<table class="table table-striped table-hover "><tr>'


    
    

    let row: any = blob[0];
    divString = divString + "<th>" + "#" + "</th>"
    for (var key in row) {
      if (row.hasOwnProperty(key)) {
        divString = divString + "<th>" + key + "</th>"

      }
    }

    let count: number = this.offset;
    if (count == 0) {
      count = 1;
    }
    divString = divString + "</tr>"
    for (let tableRow of blob) {
      divString = divString + "<tr>"
      divString = divString + "<td>" + count + '<span class="glyphicon glyphicon-edit"></span>' + "</td>"
      for (var key in row) {
        if (tableRow.hasOwnProperty(key)) {
          divString = divString + "<td>"
          divString = divString + tableRow[key]
          divString = divString + "</td>"
        }
      }
      divString = divString + "</tr>"
      count = count + 1;
    }
    divString = divString + "</table>"


    this.busy = false;
    this.busyMessage = ""

    div.innerHTML = divString

    // Clear Value
    div.setAttribute('class','animated fadeInUp');


  }




}
