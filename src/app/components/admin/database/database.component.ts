import { CommonModule } from '@angular/common';
import { Component, Type, ViewChild } from '@angular/core';
import { RequestsService } from '@services/admin/requests.service';
import { environment } from "@config"
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';

interface Table {
  id?: number
  tableName: string
  countValue: number
  createdAt: string
  updatedAt: string
}

interface TableField {
  fieldName: string
  type: "STRING" | "TEXT" | "INTEGER" | "DOUBLE" | "DATE" | "DATEONLY" | "IMG"
}
interface Img {
  id?: number
  aliasName: string,
  fileName: string,
  createdAt: string
  updatedAt: string
  fileResolution: string
  fileSize: number
  path: string
}
@Component({
  selector: 'app-database',
  standalone: true,
  imports: [CommonModule, UploadedGalleryComponent],
  templateUrl: './database.component.html',
  styleUrl: './database.component.scss'
})
export class DatabaseComponent {
  defaultCreateTable: TableField[] = [
    {
      fieldName: "name",
      type: "STRING"
    },
    {
      fieldName: "description",
      type: "TEXT"
    },
    {
      fieldName: "count",
      type: "INTEGER"
    }
  ]
  createTableValue: any = {}
  tableName = ""
  modalWindowName = ""
  openTableView = ""
  imageFieldName = ""
  updateIndex = -1
  showFieldTables: TableField[] = [...this.defaultCreateTable]
  allFieldTables: TableField[] = []
  allTables: Table[] = []
  lastUpdatedTables: Table[] = []
  showTables: Table[] = []
  tableValues: any[] = []
  showImgs: Img[] = []
  createdStatus = false
  emptyTableNameStatus = false
  formTableValueinsert = false
  @ViewChild('gallery', { static: true }) gallery!: UploadedGalleryComponent;
  constructor(private req: RequestsService) { }
  ngOnInit() {
    this.req.Get<Table[]>(`${environment.apiUrl}/db`, true).subscribe(value => {
      this.allTables = [...value]
      this.showTables = [...value]
      this.getLastTables(5)
    })

  }
  setImage(e: any) {
    if(this.updateIndex == -1){
      this.createTableValue[this.imageFieldName] = e
    }else{
      this.tableValues[this.updateIndex][this.imageFieldName] = e
    }
  }
  galleryMenuClick(status: boolean, saveField: string, index = -1) {
    this.gallery.toggleAside(status);
    this.imageFieldName = saveField
    this.updateIndex = index
  }
  getLastTables(offset: number) {
    const array = [...this.showTables].sort((a, b) => {
      // Преобразование значений в тип Date для сравнения
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);

      // Сравнение дат
      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }

      // Если даты равны, сохраняем текущий порядок
      return 0;
    }).splice(0, offset)
    this.lastUpdatedTables = array
  }
  changeTableView(viewName: string) {
    if (this.openTableView == viewName) {
      this.openTableView = ""
    } else {
      this.openTableView = viewName
    }
  }
  openWindowCreateTable(windowName: string) {
    this.modalWindowName = windowName
  }
  returnModalWindow() {
    this.modalWindowName = ""
    this.formTableValueinsert = false
    setTimeout(() => {
      this.tableName = ""
    }, 500);
  }
  changeTableName(e: any) {
    if (e.target.value != "users" && e.target.value != "files" && e.target.value != "folders" && e.target.value != "pages" && e.target.value != "regtables" && e.target.value != "templates" && e.target.value != "loggers")
      this.tableName = e.target.value
  }
  addField() {
    this.showFieldTables.push(
      {
        fieldName: "fieldName",
        type: "STRING"
      },
    )
  }
  changeColumnName(e: any, id: number) {
    this.showFieldTables[id].fieldName = e.target.value
  }
  changeColumnType(e: any, id: number) {
    this.showFieldTables[id].type = e.target.value
  }
  deleteField(id: number) {
    this.showFieldTables.splice(id, 1)
  }
  createTable(e: any) {
    if (this.tableName !== "" && !this.showTables.some(item => item.tableName === e.target.value)) {
      this.req.Post<any>(`${environment.apiUrl}/db/${this.tableName}`, { fields: this.showFieldTables }).subscribe(value => {
        if (value.status) {
          this.showFieldTables = [...this.defaultCreateTable];
          this.createdStatus = true
          this.showTables.push(value.regTable)
          this.allTables.push(value.regTable)
          setTimeout(() => {
            this.createdStatus = false
          }, 700);
        }
      });
    } else {
      this.emptyTableNameStatus = true
      setTimeout(() => {
        this.emptyTableNameStatus = false
      }, 700);
    }
  }
  openEditForm(id: number | undefined) {
    if (id) {
      this.req.Get<TableField[]>(`${environment.apiUrl}/db/${id}`).subscribe(value => {
        this.showFieldTables = [...value]
        this.allFieldTables = [...value]
        this.modalWindowName = "editTable"
        this.tableName = this.allTables.filter(value => value.id == id)[0].tableName
      })
    }
  }
  changeTableField() {
    let isEqual = true;
    for (const value of this.allFieldTables) {
      if (!this.showFieldTables.includes(value)) {
        isEqual = false;
        break;
      }
    }
    if (!isEqual) {
      this.modalWindowName = "warningUpdate"
    } else {
      this.req.Patch<any>(`${environment.apiUrl}/db/${this.allTables.filter(value => value.tableName == this.tableName)[0].id}`, { fields: this.showFieldTables }).subscribe(value => {
        if (value.status) {
          this.createdStatus = false
          this.modalWindowName = ""
          this.tableName = ""
        }
      });
    }
  }
  permamentUpdateTable() {
    this.req.Patch<any>(`${environment.apiUrl}/db/${this.allTables.filter(value => value.tableName == this.tableName)[0].id}`, { fields: this.showFieldTables }).subscribe(value => {
      if (value.status) {
        this.createdStatus = true
        setTimeout(() => {
          this.createdStatus = false
          this.modalWindowName = ""
          this.tableName = ""
        }, 700);
      }
    });
  }
  deleteTable(tableName: string) {
    this.tableName = tableName
    this.modalWindowName = "warningDelete"
  }
  permamentDeleteTable() {
    this.req.Delete<any>(`${environment.apiUrl}/db/${this.allTables.filter(value => value.tableName == this.tableName)[0].id}`).subscribe(value => {
      if (value.status) {
        const showIndex = this.showTables.findIndex(value => value.tableName === this.tableName);
        this.showTables.splice(showIndex, 1)
        const allIndex = this.allTables.findIndex(value => value.tableName === this.tableName);
        this.allTables.splice(allIndex, 1)
        this.modalWindowName = ""
      }
    })
  }
  searchTables(e: any) {
    this.showTables = this.allTables.filter(value => value.tableName.includes(e.target.value))
  }

  openTableValues(tableName: string) {
    this.tableName = tableName
    this.req.Get<[any[], TableField[]]>(`${environment.apiUrl}/db/${tableName}/values`).subscribe(value => {
      this.modalWindowName = "tableValues"
      this.showFieldTables = value[1]
      this.tableValues = [...value[0]]
    })
    this.req.Get<[any, Img[]]>(`${environment.apiUrl}/files/imgs-uploads`).subscribe(data => {
      this.showImgs = data[1].map((item, index) => {
        return { ...item, path: `${environment.apiUrl}/static/imgs/uploads/${item.fileName}` };
      });
    })
  }
  toggleInsertTableValue(status: boolean) {
    this.formTableValueinsert = !this.formTableValueinsert
  }
  changeTableValue(e: any) {
    this.createTableValue[e.target.getAttribute("fieldName")] = e.target.value
  }
  insertDataTableValue() {
    this.req.Post(`${environment.apiUrl}/db/${this.tableName}/values`, this.createTableValue).subscribe(data => {
      this.tableValues.push(data)
      this.formTableValueinsert = false
    }
    )
  }
  getTableKeys(obj: any) {
    return Object.keys(obj)
  }
  getColumnType(name: string) {
    for (const i of this.showFieldTables) {
      if (i.fieldName == name) {
        return i.type
      }
    }
    return undefined
  }
  getMainString(value: string) {
    return String(value).split("T")[0]
  }
  changeTableValueField(e: any, index: number, field: string) {
    this.tableValues[index][field] = e.target.value
  }
  sendUpdateTableValue(index: number) {
    this.req.Patch<any>(`${environment.apiUrl}/db/${this.tableName}/values/`, this.tableValues[index]).subscribe(value => {
      this.tableValues[index] = value
    })
  }
  sendDeleteTableValue(index: number) {
    this.req.Delete<any>(`${environment.apiUrl}/db/${this.tableName}/values/${this.tableValues[index].id}`).subscribe(value => {
      this.tableValues.splice(index, 1)
    })
  }
}
