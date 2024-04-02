import { Injectable } from '@angular/core';
interface elements{
  [key:string]:{
    configurator:boolean,
    properties:{
      [key:string]:any
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ConstructorService {
  public elements:elements = {
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
        className:"element list prime"
      }
    },
    title:{
      configurator: true,
      properties:{
        className:"element title prime"
      }
    },
    paragraph:{
      configurator: false,
      properties:{
        className:"element paragraph prime"
      }
    },
    btn:{
      configurator: true,
      properties:{
        className:"element button prime"
      }
    },
    "social-btn":{
      configurator: true,
      properties:{
        className:"element social-btn prime"
      }
    },
  }
}
