import { Component, ElementRef, ViewChild } from '@angular/core';
import { RequestsService } from '@services/admin/requests.service';
import { ConstructorService } from '@services/constructor.service';
import { environment } from "@config"
import { UploadedGalleryComponent } from '../uploaded-gallery/uploaded-gallery.component';
import { CommonModule } from '@angular/common';
declare function emitSetImg(path: string): void;
declare function emitSetList(count: number): void;
declare function emitTitleType(type: string): void;
declare function emitBtnSrc(path: string): void;
declare function returnActiveStyles(): string[];
declare function emitSocialBtn(path: string, social_link: string | undefined): void;
declare function emitDownloadBtn(path:string):void;
declare function emitVideoPreview(path:string):void;
declare function emitVideoSrc(path:string):void;
declare function emitSwiper(slides:any[]):void
interface style {
  optGroupName: string,
  group: {
    name: string,
    value: string,
    type: string,
    values?: string[] | undefined
  }[]
}
interface myFile {
  id?: number
  aliasName: string,
  fileName: string,
  createdAt: string
  updatedAt: string
  fileResolution: string
  fileSize: number
  path: string
}
interface profile {
  facebook_link?: string
  instagramm_link?: string
  github_link?: string
  itchio_link?: string
  google_link?: string
}
interface folder{
  name:string,
  files:file[]
}
interface file {
  aliasName: string,
  fileName: string,
  path: string
}
@Component({
  selector: 'app-edit-config-forms',
  standalone: true,
  imports: [
    CommonModule,
    UploadedGalleryComponent
  ],
  templateUrl: './edit-config-forms.component.html',
  styleUrl: './edit-config-forms.component.scss'
})
export class EditConfigFormsComponent {

  styles: style[] = []
  pages: string[] = []
  showStyleGroupArray: string[] = []
  selectedStyles: string[] = []
  profilesLinks: profile = {}
  archivesFiles:file[] = []
  videosFiles:file[] = []
  subFoldersFiles:any = []
  isFlipped = false;
  galleryLength = 0
  videoChange = false

  @ViewChild('gallery', { static: true }) gallery!: UploadedGalleryComponent;
  constructor(
    private constructorService: ConstructorService,
    private req: RequestsService
  ) {
    this.styles = constructorService.styles
  }
  ngOnInit() {
    this.gallery?.imagesLength$.subscribe(data => {
      this.galleryLength = data
    })
    this.req.Get<[]>(`${environment.apiUrl}/pages`).subscribe((data: any[]) => {
      for (const i of data) {
        this.pages.push(i.pageName)
      }
    })
    this.req.Get<profile>(`${environment.apiUrl}/users/1`).subscribe(data => {
      this.profilesLinks = data
    })
    this.req.Get<[any[], file[]]>(`${environment.apiUrl}/files/archives`).subscribe(data => {
      this.archivesFiles = data[1].map((item, index) => {
        return { ...item, path: `${environment.apiUrl}/static/archives/${item.fileName}` };
      });
    })
    this.req.Get<[any[], file[]]>(`${environment.apiUrl}/files/videos`).subscribe(data => {
      this.videosFiles = data[1].map((item, index) => {
        return { ...item, path: `${environment.apiUrl}/static/videos/${item.fileName}` };
      });
    })
    this.req.Get<folder[]>(`${environment.apiUrl}/files/subFolderFiles`).subscribe(data => {
      this.subFoldersFiles = data.map(value=>{
        return{
          ...value,
          files: value.files.map(fileObj=>{
            return{
              ...fileObj,
              path: `${environment.apiUrl}/static/${value.name.replaceAll("-", "/")}/${fileObj.fileName}`
            }
          })
        }
      })
      
    })
  }
  flipCard() {
    this.isFlipped = !this.isFlipped;
  }
  /* ---------------------------- style editor form --------------------------- */
  showStyleGroup(group: string) {
    if (this.showStyleGroupArray.includes(group)) {
      this.showStyleGroupArray = this.showStyleGroupArray.filter((_) => _ !== group)
    } else {
      this.showStyleGroupArray.push(group)
    }
  }
  selectedStyle(style: string) {
    if (this.selectedStyles.includes(style)) {
      this.selectedStyles = this.selectedStyles.filter((_) => _ !== style)
    } else {
      this.selectedStyles.push(style)
    }
  }

  checkStyleSelectedGroup(obj: style): boolean {
    return obj.group.map((item) => { return this.selectedStyles.includes(item.value) }).some((item: any) => item === true)
  }

  returnEditorActiveStyles() {
    this.showStyleGroupArray = []
    this.selectedStyles = []
    for (const styleName of returnActiveStyles()) {
      const matchingGroup = this.styles.find(group => {
        return group.group.some(item => styleName == item.value);
      });
      if (matchingGroup) {
        if (!this.showStyleGroupArray.includes(matchingGroup.optGroupName))
          this.showStyleGroupArray.push(matchingGroup.optGroupName)
        const matchingItems = matchingGroup.group.filter(item => returnActiveStyles().includes(item.value));
        matchingItems.forEach((value, index, array) => {
          if (!this.selectedStyles.includes(value.value)) {
            this.selectedStyles.push(value.value)
          }
        })
      }
    }
  }
  /* ---------------------------- style editor form --------------------------- */


  /* ---------------------------- configurator form --------------------------- */
  @ViewChild('file') fileInput!: ElementRef;

  returnForms() {
    this.isFlipped = false
    this.selectedStyles = []
    this.videoChange = false
  }
  setImage(imagePath: string) {
    if(!this.videoChange){
      emitSetImg(imagePath)
    }else{
      emitVideoPreview(imagePath)
    }
  }
  setImageUrl(e: any) {
    this.setImage(e.target.value)
  }
  galleryMenuClick(status: boolean) {
    this.gallery.toggleAside(status);
  }
  sendImage(e: any) {
    let fileList: FileList = e.target.files;

    if (fileList.length < 1) {
      return;
    }
    const file: File = fileList[0];
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      const width = image.width;
      const height = image.height;
      let formData: FormData = new FormData();
      formData.append('uploadImage', file, file.name)
      formData.append("fileResolution", `${width}x${height}`)
      formData.append("fileSize", String(file.size))
      this.req.Post<myFile>(`${environment.apiUrl}/files/imgs-uploads`, formData).subscribe(data => {
        emitSetImg(`${environment.apiUrl}/static/imgs/uploads/${data.fileName}`)
      })
    };
  }
  setListChildren(e: any) {
    emitSetList(e.target.value)
  }
  changeTitle(e: any) {
    emitTitleType(e.target.value)
  }
  changeBtnSrc(src: string) {
    emitBtnSrc(src)
  }
  changeSocialBtn(imgPath: string, socialLink: string | undefined) {
    emitSocialBtn(imgPath, socialLink)
  }
  changeDownloadBtn(src:string){
    emitDownloadBtn(src)
  }
  triggerVideoPreview(){
    this.videoChange = true
  }
  setVideoSrc(path:string){
    emitVideoSrc(path)
  }
  setSlides(slides:file[]){
    emitSwiper(slides)
  }
  /* ---------------------------- configurator form --------------------------- */
}
