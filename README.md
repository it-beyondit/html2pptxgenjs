# Introduction 
Html2pptxgenjs provides a simple API for converting HTML into [PptxGenJS](https://github.com/gitbrent/PptxGenJS) text. It runs in both Node.js and a web browser.

# Installation
Install with ```npm```:

```npm install html2pptxgenjs```

The ```dist``` folder contains the following distribution files:
- ```html2pptxgenjs.cjs.js``` for Node.js
- ```html2pptxgenjs.min.js``` for web browsers

# Usage
Html2pptxgenjs parses and HTML snippet and converts it into a list of items that can be then used with ```addSlide()```.

``` js
let slide = pres.addSlide();

const items = html2pptxgenjs.htmlToPptxText('Hello, <b>world</b>!');

slide.addText(items, { x: 0.5, y: 0, w: 9.5, h: 6, valign: 'top' });
```

Check ```demo.js``` for a short example of actual usage.

# Features
Html2pptxgenjs provides a simple API for converting HTML into [PptxGenJS](https://github.com/gitbrent/PptxGenJS) text. It supports the most common and useful HTML tags, as well as basic styling using CSS and inline styles.

Html2pptxgenjs is designed to simplify the creation and management of text boxes, it is not intended to be a complete HTML renderer that can be used to create any slide.

## Tags
The following tags are supported:
- ```<a>```: hyperlink
    - ```href``` = target URL
    - ```title``` = title
- ```<b>```: bold
- ```<strong>```: bold
- ```<b>```: line break
- ```<del>```: strikethrough (same as ```<s>```)
- ```<font>```: font
    - ```color```: color
    - ```face```: face, e.g. "Arial"
    - ```size```: size (see Size) 
- ```<h1>```...```<h6>```: header
- ```<i>```: italic
- ```<ol>```: ordered list
- ```<p>```: paragraph (see Options)
- ```<pre>```: preformatted text (see Options)
- ```<s>```: strikethrough
- ```<strike>```: strikethrough (same as ```<s>```)
- ```<sub>```: subscript
- ```<sup>```: superscript
- ```<u>```: underline
- ```<ul>```: unordered list

Any other tag such as for example ```span``` or ```div``` can be used to wrap text and possibly set attributes, but these tags have no special meaning.

All elements support the following attributes:
- ```align```: text alignment, can be "Left", "Center" or "Right
- ```style```: stylesheet rules for the current element (see Styles)

## Styles
Html2pptxgenjs offers basic support for styling using CSS (see Options) and inline styles, also when running in Node.js.

The following properties are supported:
- ```background```: background color *only*
- ```background-color```: background color
- ```color```: color
- ```font-family```: font face, e.g. "Arial"
- ```font-size```: font size (see Size)
- ```font-style```: supports only "italic"
- ```font-weight```: can be used to set normal or bold (intermediate values become one of these two)
- ```margin```: margin, has to be a single value (see Size)
- ```text-align```: horizontal alignment
- ```text-shadow```: text shadow

## Size
Size is specified in points, e.g. ```12pt```.

The following units are also supported and converted to points:
- ```%```: relative (in percentage) to the font size of the parent element
- ```em```: relative to the current font size
- ```rem```: relative to the font size or the root element

A few common shortcuts are supported as well, and automatically converted to points:
- numbers from ```1``` to ```7```, as used in the ```font``` element
- ```xx-small, x-small, small, medium, large, x-large, xx-large```, gradually going from half to twice the current font size

## Options
An optional object can be used to specify the CSS and other options:

``` js
const options = {
    css: '.world { color: blue; }',
    fontSize: 20
}

let slide = pres.addSlide();

const items = html2pptxgenjs.htmlToPptxText('Hello, <span class="world">world</span>!', options);

slide.addText(items, { x: 0.5, y: 0, w: 9.5, h: 6, valign: 'top' });
```

The following properties are supported:
- ```css```: a list of CSS rules
- ```fontFace```: initial font face, defaults to "Arial"
- ```fontSize```: initial font size in points, defaults to 12
- ```paraSpaceAfter```: vertical space after a paragraph, in points
- ```paraSpaceBefore```: vertical space before a paragraph, in points
- ```preFontFace```: font face for preformatted text, defaults to "Courier New"
