import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstructorService {
  private selectedElementSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  selectedElement$: Observable<boolean> = this.selectedElementSubject.asObservable();
  public elements = {
    section:{
      configurator: false,
      properties:{
        className:"element section prime"
      }
    },
    area:{
      configurator: false,
      properties:{
        className:"element area prime"
      }
    },
    img:{
      configurator: true,
      properties:{
        className:"element img prime"
      }
    },
    list:{
      configurator: true,
      properties:{
        className:"element section prime"
      }
    },
    title:{
      configurator: true,
      properties:{
        className:"element img prime"
      }
    },
    paragraph:{
      configurator: false,
      properties:{
        className:"element section prime"
      }
    },
    button:{
      configurator: true,
      properties:{
        className:"element section prime"
      }
    },
    "social-btn":{
      configurator: true,
      properties:{
        className:"element img prime"
      }
    },
  }
  changeRightAsideStatus(status: boolean): void {
    this.selectedElementSubject.next(status);
  }
}
