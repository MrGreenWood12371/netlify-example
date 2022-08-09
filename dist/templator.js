class Templator {
    TEMPLATE_REGEXP = /\{\{(.*?)\}\}/gi;

    constructor(template) {
        this._template = template;
    }

    compile(ctx) {
        return this._compileTemplate(ctx);
    }

    _get(obj, path, defaultValue) {
        const keys = path.split('.');
    
        let result = obj;
        for (let key of keys) {
            result = result[key];
    
            if (result === undefined) {
                return defaultValue;        
            }
        }
    
        return result ?? defaultValue;
    }

    _compileTemplate(ctx) {
        let tmpl = this._template;
        let key = null;
        const regExp = this.TEMPLATE_REGEXP

        while ((key = regExp.exec(tmpl))) {
            if (key[1]) {
                const tmplValue = key[1].trim();
                const data = this._get(ctx, tmplValue);
                tmpl = tmpl.replace(new RegExp(key[0], "gi"), data);
            }
        }
        return tmpl;
    }
}

const testTempl = `
<div>
        {{ field1 }}
        <span>{{field2}}</span>
        <span>{{ field3.info.name }}</span>
</div>
`;
const tmpl = new Templator(testTempl);

const context = {
        field1: 'Text 1',
        field2: 42,
        field3: {
            info: {
                name: 'Simon',
            },
        },
};

const renderedTemplate = tmpl.compile(context); // Строка с html-вёрсткой

document.body.innerHTML = renderedTemplate; // Показался нужный результат 