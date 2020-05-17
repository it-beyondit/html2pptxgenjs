// Copyright 2020 BeyondIt S.r.l.
//
// Use of this source code is governed by an MIT-style license that can be found
// in the LICENSE file or at https://opensource.org/licenses/MIT.
const html2pptxgenjs = require('html2pptxgenjs');

const pptxgen = require('pptxgenjs');

// Slides
const Slides = [
    `
    <h1>Text style</h1>
    
    <p>Normal, <i>italic</i>, <u>underline</u>, <b>bold</b>, <sup>superscript</sup>, 
    <sub>subscript</sub>, <s>strikethrough</s>, <b><i><u>combined</u></i></b>.
    
    <p>
        <font size="6" face="Calibri">Calibri size 6</font>
    <p>
        <font size="4" face="Helvetica">Helvetica size 4</font>
    
    <p>
        <span style="font-size:2em;font-weight:bold;">
            <span style="color:violet">R</span>
            <span style="color:indigo">A</span>
            <span style="color:blue">I</span>
            <span style="color:green">N</span>
            <span style="color:yellow">B</span>
            <span style="color:orange">O</span>
            <span style="color:red">W</span>
        </span>
    `,
    `
    <h1 style="font-family:Courier New;color:maroon;">Coronavirus Advice</h1>
    
    <ol>
        <li><span class="question">How can I avoid getting infected?</span>
            <ul>
                <li>Wash your hands frequently
                <li>Stay two meters away from people who may be infected
            </ul>
        <li><span class="question">How can I avoid infecting others?</span>
            <ul>
                <li>Cough or sneeze into your elbow or use a tissue, dispose the tissue immediately
                <li>Wash your hands frequently
                <li>Stay two meters away from people
            </ul>
        <li><span class="question">What is physical distancing and why and how should I do it?</span>
            <ul>
                <li>Physical distancing aims to reduce physical contact between potentially infected people and healthy people
                <li>Isolate yourself if you know you have the virus that causes COVID-19, or if you have suggestive respiratory symptoms, or if you belong to a high-risk group (i.e. you are aged 70 years or more, or you have an underlying health condition)
            </ul>
    </ol>
    <p>For more information visit <a href="http://www.salute.gov.it/">Q &amp; A on COVID-19</a>
    `
];

// Options
let options = {};

options.css = `
h1 {
    color: blue;
    text-align: center;
}

.question {
    color: red;
    font-size: 1.2em;
}
`;

// Create a sample presentation
let pres = new pptxgen();

Slides.forEach(text => {
    let slide = pres.addSlide();

    const items = html2pptxgenjs.htmlToPptxText(text, options);

    slide.addText(items, { x: 0.5, y: 0, w: 9.5, h: 6, valign: 'top' });

    return items;
});

pres.writeFile('test.pptx');
