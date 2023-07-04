<script lang="ts" context="module">
	import type { PageMetaData } from '../../../types';
	import { Heading, Code } from '@components';

	export const metadata: PageMetaData = {
		glossary: {}
	};
</script>

<p>hello</p>

<Heading as="h2">Who makes HTML?</Heading>
<p>todo</p>

<Heading as="h2">Layout of an HTML document</Heading>
<Code
	lang="HTML"
	content={`
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>My test page</title>
  </head>
  <body>
    <h1>My website</h1>
    <img src="images/firefox-icon.png" alt="My test image" />
  </body>
</html>`}
/>

<p>test</p>
{`WWW consortium basic Introduction.. you will learn about the proper markup of common html elements, which
will not only make your code clean, but also makes your website accessible to as many users as possible.

HTML, which stands for Hypertext Markup Language, is the standard markup language used for creating web pages and web applications. It is the backbone of the World Wide Web and forms the basic structure and content of a webpage.

At its core, HTML provides a set of tags (also known as elements) that define the structure and meaning of the content within a webpage. These tags are used to mark up different parts of the content, such as headings, paragraphs, links, images, lists, and more.

HTML documents are made up of a series of nested HTML tags, forming a hierarchical structure known as the Document Object Model (DOM). This structure represents the relationship between different elements on a page, with some elements being nested inside others.

Here are a few key points about HTML:

Structure: HTML provides a way to structure the content of a webpage. It defines the main sections, headings, paragraphs, lists, tables, forms, and other elements that make up the page.
Semantic Markup: HTML tags not only define the appearance of the content but also convey the semantic meaning of the content. For example, using the <h1> tag for the main heading indicates that it represents the most important heading on the page, while <p> tags indicate paragraphs of text.
Hyperlinks: HTML allows you to create hyperlinks, enabling users to navigate between different web pages. The <a> tag is used to create links, and it can be configured with the destination URL, link text, and additional attributes.
Images: HTML allows you to embed images in a webpage using the <img> tag. Images can enhance the visual appeal and convey information or illustrations.
Lists: HTML provides tags for creating ordered lists (<ol>), unordered lists (<ul>), and definition lists (<dl>). These tags help organize information into structured lists.
Forms: HTML includes form elements like text fields, checkboxes, radio buttons, dropdown menus, and buttons. Forms enable users to input and submit data to a server for processing.
Accessibility: HTML has built-in accessibility features that help make web content more inclusive and usable for people with disabilities. It supports attributes for adding alternative text to images, associating labels with form controls, and more.
HTML is a markup language, meaning it uses a predefined set of tags to structure and describe the content. It is not a programming language but rather a language for creating the structure and presentation of web pages.

When combined with CSS (Cascading Style Sheets) and JavaScript, HTML forms the core technologies for building interactive and visually appealing websites and web applications.

In summary, HTML is the foundation of the web, providing a standardized way to structure and present content on web pages. Understanding HTML is essential for anyone venturing into web development, as it forms the basis for creating engaging and accessible web experiences.`}

Creating an HTML pages create an index.html files. in the same folder, create an about.html
