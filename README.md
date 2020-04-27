# wdio-cv-image-recognition

A	Computer Vision based Element Recognition & Self-Healing Mechanism Node Module. This capability adds a new dimension to Web Automation by allowing Image Based Element Recognition mechanism to Selenium. The traditional HTML Locators (xpath, css, class etc.) struggle with the below drawbacks:


*   Steep Learning Curve;
*	Creation of Locators is a Time-Consuming Process;
*	Requirement of High Maintenance as the Locator properties are prone to changes;
*	Results in Flaky Test Automation Tests as the properties get changed every now and then;
*	At times, its unique to find unique Locators;
*	Can’t automate various Components like Canvas, SVG etc.

The above problems can be resolved by providing a mechanism through which Developers can identify the Web Elements through a more natural and reliable way i.e. Images. And that is exactly what this module does. In order to achieve this behaviour it has 2 core features:

## Image Based Locators

Allows adding of Element Images as Locators. The plugin leverages OpenCV’s Template Matching Algorithms to find the best match of the Element Image against the Webpage.

## Self-Healing Mechanism

Triggers Image based Element Searching mechanism in case the actual HTML Locator of the element is not found and raises a warning in the Execution Report.


## Installation

Install wdio-cv-image-recognition
 
```
npm i wdio-cv-image-recognition --save-dev
```

Install OpenCV (Module has not been included in package.json as it gives errors at times)

```
npm i opencv4nodejs --save-dev
```

Install all other modules available within package.json

```
npm i
```

## Usage

wdio.conf.js

```
    plugins: {
        'wdio-cv-image-recognition': {
            elementLocatorDir: 'elementLocatorDir/',
            elementMatchPointsDir: 'elementMatchPointsDir/',
            imageReductionPerformanceFactor: 5,
            minMatchConfidenceLevel: 0.6,
            commandTimeout: 2000
           }
    }
```
steps.js

```
browser.cvClick('path/of/element/image.png', {minMatchConfidenceLevel: 0.6});
```


## Config Options

### elementLocatorDir:
Path of Directory where the Images of AUT's Web Elements will be stored. Format supported as of now is .png.

### elementMatchPointsDir:
Path of Directory where the Snapshots of the Web Page(s) on which the actions are being performed will be stored. The Snapshots will highlight the exact point where the actions (like Click, Type etc.) have been performed. Useful for troubleshooting.

### imageReductionPerformanceFactor:
The factor upto which the size of the Web Page will be reduced for Template Matching by OpenCV. The size is reduced to improve the speed of Template Matching Algorithm. However, as this factor increases, the accuracy of the algorithm starts decreasing.

### minMatchConfidenceLevel:
Accuracy of the Template Matching algorithm. Making this value too low can give false positives

### commandTimeout:
Timeout duration for wdio-cv-image-recognition commands.

The above Config Options can be overriden by the wdio-cv-image-recognition commands by passing them as json key/value pair(s)

## Commands Supported

### cvClick:
For clicking on an element using its Image Locator.

### cvSetValue:
For setting Value in an input field (typing) using its Image Locator.

### selfHealClick:
For clicking on an element through its Image Locator when the HTML locator is not found.

### selfHealSetValue:
For setting value in an input field through its Image Locator when the HTML locator is not found.


# License
(The MIT License)

Copyright (c) 2020 Simit Tomar simittomar8@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.