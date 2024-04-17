import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// import '../node_modules/codemirror/mode/javascript/javascript';
// import '../node_modules/codemirror/mode/markdown/markdown';
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
