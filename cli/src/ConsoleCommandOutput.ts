import { Color } from '#interfaces/Color.js';
import { ICommandOutput } from '#interfaces/ICommandOutput.js';

const textStyle = {
    reset: '\u001b[0m',

    black: '\u001b[30m',
    red: '\u001b[31m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    blue: '\u001b[34m',
    magenta: '\u001b[35m',
    cyan: '\u001b[36m',
    white: '\u001b[37m',

    bold: '\u001b[1m',
    dim: '\u001b[2m',
    underline: '\u001b[3m',
    blink: '\u001b[4m',
    reverse: '\u001b[5m',
    hide: '\u001b[6m',

    nobold: '\u001b[21m',
    nodim: '\u001b[22m',
    nounderline: '\u001b[23m',
    noblink: '\u001b[24m',
    noreverse: '\u001b[25m',
    nohide: '\u001b[26m',
};

export class ConsoleCommandOutput implements ICommandOutput {
    private headingLevel: number = 0;
    private buffer: string = '';

    flushLine(): undefined {
        if (this.buffer) console.log(this.buffer);
        this.buffer = '';
    }

    writeHeading(text: String, headingLevel: number): undefined {
        this.flushLine();
        if (headingLevel == 1) {
            console.log(text);
            console.log('='.repeat(text.length));
            console.log();
        } else if (headingLevel == 2) {
            if (this.headingLevel == 0) console.log('');
            console.log(text);
            console.log('-'.repeat(text.length));
            console.log();
        } else {
            if (this.headingLevel == 0) console.log('');
            console.log(text.toUpperCase());
        }
        this.headingLevel = headingLevel;
    }

    writeBodyLine(text: String): undefined {
        this.flushLine();
        console.log(text);
        this.headingLevel = 0;
    }

    writeBody(text: String): undefined {
        this.buffer += text;
        this.headingLevel = 0;
    }

    writeColor(text: String, color: Color): undefined {
        switch (color) {
            case 'red':
                this.writeBody(textStyle.red);
                break;
            case 'green':
                this.writeBody(textStyle.green);
                break;
            case 'blue':
                this.writeBody(textStyle.blue);
                break;
            case 'cyan':
                this.writeBody(textStyle.cyan);
                break;
            case 'magenta':
                this.writeBody(textStyle.magenta);
                break;
            case 'yellow':
                this.writeBody(textStyle.yellow);
                break;
        }
        this.writeBody(text);
        this.writeBody(textStyle.reset);
    }
}
