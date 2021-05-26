// Copyright 2020 BeyondIt S.r.l.
//
// Use of this source code is governed by an MIT-style license that can be found
// in the LICENSE file or at https://opensource.org/licenses/MIT.
const cssparser = require('css');
const parsecolor = require('parse-color');

function Context(options) {
    this.indent = -1;

    this.fontFace = options.fontFace || 'Arial';
    this.fontSize = options.fontSize || 12;

    this.options = options;

    this.cssRules = [];

    if (options.css) {
        const obj = cssparser.parse(options.css);

        this.cssRules = obj.stylesheet.rules;
    }
}

Context.prototype.setColor = function (value) {
    const color = this.parseColor(value);

    color && (this.color = color);
}

Context.prototype.setFontFace = function (value) {
    value && (this.fontFace = value);
}

Context.prototype.parseColor = function (value) {
    const color = parsecolor(value);

    return color.hex && color.hex.substring(1);
}

Context.prototype.parseSize = function (value, stack) {
    let parts = value.trim().match(/([\d\.]+)(%|em|pt|rem)/);
    let scale;

    switch (value) {
        case '7':
            scale = 3;
            break;
        case 'h1': case 'xx-large': case '6':
            scale = 2;
            break;
        case 'h2': case 'x-large': case '5':
            scale = 1.5;
            break;
        case 'h3': case 'large': case '4':
            scale = 1.17;
            break;
        case 'h4': case 'medium': case '3':
            scale = 1;
            break;
        case 'h5': case 'small': case '2':
            scale = 0.83;
            break;
        case 'h6': case 'x-small': case '1':
            scale = 0.67;
            break;
        case 'xx-small':
            scale = 0.5;
            break;
    }

    let result;

    if (scale) {
        result = Math.round(this.fontSize * scale);
    }
    else if (parts) {
        const size = parseFloat(parts[1]);
        const unit = parts[2];

        switch (unit) {
            case '%':
                result = Math.round(stack[stack.length - 1].fontSize * size);
                break;
            case 'em':
                result = Math.round(this.fontSize * size);
                break;
            case 'pt':
                result = size;
                break;
            case 'rem':
                result = Math.round(stack[0].fontSize * size);
                break;
        }
    }

    return result;
}

Context.prototype.setFontSize = function (value, stack) {
    const size = this.parseSize(value, stack);

    size && (this.fontSize = size);
}

Context.prototype.applyStyleRules = function (rules) {
    rules.forEach(rule => {
        const value = rule.value;
        const parts = value.split(/\s+/);

        switch (rule.property) {
            case 'background':
            case 'background-color':
                {
                    const color = this.parseColor(value);
                    color && (this.fill = color);
                }
                break;
            case 'border':
                {
                    const size = this.parseSize(parts[0]);
                    const color = this.parseColor(parts[1]) || this.parseColor(parts[2]);
                    size && color && (this.outline = { size, color });
                }
                break;
            case 'color':
                this.setColor(value);
                break;
            case 'font-family':
                this.setFontFace(value.split(',')[0].trim());
                break;
            case 'font-size':
                this.setFontSize(value);
                break;
            case 'font-style':
                this.i = (value == 'italic');
                break;
            case 'font-weight':
                this.b = (value == 'bold') || (value == 'bolder') || (parseInt(value, 10) >= 700);
                break;
            case 'margin':
                {
                    const size = this.parseSize(parts[0]);
                    size && (this.margin = size);
                }
                break;
            case 'text-align':
                this.align = value;
                break;
            case 'text-shadow':
                {
                    const hpos = this.parseSize(parts[0]);
                    const vpos = this.parseSize(parts[1]);
                    const blur = this.parseSize(parts[2]);
                    const color = parsecolor(parts[3]);
                    const angle = (270 + Math.atan2(x, y) * 180 / Math.PI) % 360;
                    const offset = Math.sqrt(hpos * hpos + vpos * vpos);

                    if (blur != null && color && offset != null) {
                        this.shadow = {
                            type: 'outer',
                            angle,
                            blur,
                            color: color.hex.substring(1),
                            offset,
                            opacity: color.rgba[3]
                        }
                        console.log(this.shadow);
                    }
                }
                break;
        }
    });
}

Context.prototype.setClass = function (tag, classList) {
    this.cssRules.forEach(rule => {
        if (rule.type === 'rule') {
            const hasTag = rule.selectors.includes(tag);
            let hasClass = false;

            if (classList) {
                classList.split(' ').forEach(c => {
                    hasClass |= c && rule.selectors.includes('.' + c);
                });
            }

            if (hasTag || hasClass) {
                this.applyStyleRules(rule.declarations);
            }
        }
    });
}

Context.prototype.setStyle = function (style) {
    const obj = cssparser.parse('e {' + style + '}');
    const rules = obj.stylesheet.rules[0].declarations;

    this.applyStyleRules(rules);
}

Context.prototype.toPptxTextOptions = function () {
    let options = {};
    
    options.align = this.align;
    options.bold = !!this.b || !!this.strong;
    options.breakLine = !!this.break;
    options.color = this.color;
    this.fill && (options.fill = this.fill);
    options.fontFace = this.fontFace;
    options.fontSize = this.fontSize || this.defaultFontSize;
    options.italic = !!this.i;
    this.shadow && (options.shadow = this.shadow);
    options.strike = !!this.s;
    options.subscript = !!this.sub;
    options.superscript = !!this.sup;
    options.underline = !!this.u;

    switch (this.bullet) {
        case true:
            options.bullet = this.bulletOptions;
            options.indentLevel = this.indent;
            break;
        case false:
            options.bullet = false;
            break;
    }

    if (this.href) {
        let target = /\d+/.test(this.href) ? 'slide' : 'url';

        options.hyperlink = {
            tooltip: this.href_title
        }
        options.hyperlink[target] = this.href;
    }

    return options;
}

module.exports= {Context}

