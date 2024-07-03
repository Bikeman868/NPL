import { Color } from '#interfaces/Color.js';
import { ICommandOutput } from '#interfaces/ICommandOutput.js';

export class ConsoleCommandOutput implements ICommandOutput {
    private headingLevel: number = 0;

    writeHeading(text: String, headingLevel: number): undefined {
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

    writeBody(text: String): undefined {
        console.log(text);
        this.headingLevel = 0;
    }

    writeColor(text: String, color: Color): undefined {
        console.log(text);
        this.headingLevel = 0;
    }
}
