# The big picture

## What is Paged.js?

Paged.js is a free and open-source library that paginates any HTML content to produce beautiful print-ready PDF.  
The library fragments the content, reads your CSS print declarations and presents a paginated preview in your browser that you can save as PDF.

By paginating content in the browser, Paged.js shows a preview of the PDF output in web browsers. This allows designers to use browsers dev tools (eg. the inspection console built into most browsers) to make changes on the fly and control the rendering of the typesetting.

It's also possible to use Paged.js within other tools and to extend rendering by adding plugins.

As Paged.js follows the W3C standards, it can easily be a part of a automated workflows thanks to the command line interface version (using an headless browser) that can generate a PDF from scriptable automated commands.

## W3C specifications

Paged.js is based on the CSS standards written by the World Wide Web Consortium (W3C). Paged.js is a polyfill (A [polyfill](https://en.wikipedia.org/wiki/Polyfill_(programming)) is a bit of code that implements a feature on web browsers that do not support the feature) for some CSS properties made to print HTML from the browser. It can parse CSS stylesheets, and translate the declarations in HTML and CSS that a browser can understand. The print declarations (by updating them with supported styles or replacing them with JavaScript implementations) and present a paginated rendering of the HTML document using the fragmentation provided by CSS columns.

The W3C CSS modules that Paged.js aims to implement are the following:

- [CSS Paged Media Module Level 3](https://www.w3.org/TR/css3-page/)
- [CSS Generated Content for Paged Media Module](https://www.w3.org/TR/css-gcpm-3/)
- [CSS Fragmentation Module Level 3](https://www.w3.org/TR/css-break-3/)

## A community

The code of Paged.js is open-source with a MIT license and the development is community-driven. Everyone is invited to join us! You can find the source code of Paged.js on the repo of our self-hosted gitlab: [https://gitlab.coko.foundation/pagedjs/pagedjs](https://gitlab.coko.foundation/pagedjs/pagedjs)

We're relying on designers and developers who want to discuss new features, ideas and bug fixes. If you'd like to participate in the conversation, you can add issues to the repo. But the easiest way is to go to [our self-hosted chat](https://mattermost.coko.foundation/) and join the conversation.
