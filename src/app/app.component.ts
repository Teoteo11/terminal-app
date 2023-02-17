import { Component, ViewChild } from '@angular/core';
import { FunctionsUsingCSI, NgTerminal } from 'ng-terminal';
import { Terminal } from 'xterm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('term', { static: false }) child!: NgTerminal;

  readonly color = 'accent';
  readonly prompt = '\n' + FunctionsUsingCSI.cursorColumn(1) + '$';

  underlying!: Terminal;

  _rows!: number;
  _cols!: number;

  containerChar: string[] = [];
  key = '';

  baseTheme = {
    background: '#1C4F87',
  };

  ngAfterViewInit() {
    this.underlying = this.child.underlying;
    this.underlying.options.fontSize = 16;
    this.child.setXtermOptions({
      fontFamily: '"Cascadia Code", Menlo, monospace',
      theme: this.baseTheme,
      // cursorBlink: true
    });
    this.child.write('$ Benvenuto nel terminale Paradigma!');
    this.child.write(this.prompt);
    this.child.write(' Scrivi il risultato della seguente funzione, buona fortuna!');
    this.child.write(this.prompt);
    this.child.write(this.prompt);
    // this.child.write(this.prompt);
    // this.child.write(' Oh, quasi dimenticavo..hai a disposizione solo un carattere.');
    this.child.write(this.prompt);
    this.child.write(`${this.prompt} const sum = (a: number, b: number) =>{${this.prompt}  a = 20;${this.prompt}  b = a * 2;${this.prompt}  return a + b;${this.prompt} }${this.prompt} -----------------------${this.prompt}`);
    this.child.write(' ')
    this.child.onKey().subscribe(event => {
      console.log('e: ',event);
      const { key } = event;
      this.key = key;
      if (key === '\x7f') {
        if (this.child.underlying.buffer.active.cursorX > 2) {
          this.child.write('\b \b');
        }
      } 
      if (key !== '\r' && key !== '\x7f') {
        this.containerChar.push(key);
        this.child.write(key);
      }
      if (key === '\r') {
        console.log('🔴 risultato: ',this.containerChar.join().replaceAll(',',''));
        this.child.write(this.prompt);
      }
    });
  }


  isSubmitted = () => this.key === '\r';
}