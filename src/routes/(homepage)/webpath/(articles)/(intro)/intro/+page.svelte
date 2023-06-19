<script lang="ts" context="module">
	import { Heading, Details, List } from '@components';
	import type { PageMetaData } from '../../../types';

	export const metadata: PageMetaData = {
		glossary: {
			DNS: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur expedita ab architecto nisi
quo veritatis eum id, veniam cum! Aut cum dolorum minus voluptatum consectetur esse, modi minima
maiores, expedita totam quam inventore? Natus laborum obcaecati mollitia ipsum earum numquam
voluptates, consequatur facilis ullam ab excepturi nesciunt nulla exercitationem saepe sunt
assumenda corporis asperiores maiores eius libero? `,
			IP_ADRESS: 'todo',
			DOM_TREE: 'todo',
			HTML: 'todo',
			CSS: 'todo',
			JavaScript: 'todo',
			SPA: 'todo',
			Vanilla_JavaScript: 'todo',
			URL: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur expedita ab architecto nisi
quo veritatis eum id, veniam cum! Aut cum dolorum minus voluptatum consectetur esse, modi minima
maiores, expedita totam quam inventore? Natus laborum obcaecati mollitia ipsum earum numquam
voluptates, consequatur facilis ullam ab excepturi nesciunt nulla exercitationem saepe sunt
assumenda corporis asperiores maiores eius libero? `
		}
	};

	const glossary = metadata.glossary;
</script>

<p>
	Today starts your journey into web development. You will be transforming from a mere observer of
	the web to a creator of pages and applications. Like an author writing a book, or an artist
	painting a piece of art, you will learn how to use your creative brain to construct digital
	experiences. In this course, you will learn about the fundamental techniques required to build a
	page. Let's get started!
</p>

<Heading as="h2">How the web works</Heading>
<p>
	When you enter an address in the browser or click a link, you have to maybe wait for a bit, and
	then a website magically appears. But how does it work behind the scenes? Let's divide it up into
	steps.
</p>
<List type="ordered">
	<li>
		Firstly, the address you have entered needs to be converted into an IP address. The
		<Details description={glossary.URL} summary="URL" /> that you have entered cannot be used directly
		to request information from a server. The browser sends a request to a <Details
			description="todo"
			summary="DNS Server"
		/> to convert the URL into an IP address. For example, if you enter the URL "www.example.com" in
		the browser, the corresponding IP address would be "192.0.2.123".
	</li>
	<li>
		The browser sends a request to the IP address of the server that hosts the website. Usually, it
		first requests the HTML file associated with the requested website. The way the data is
		transferred, i.e. the <Details description="todo" summary="protocol" /> , is dependent on whether
		the website uses a secure connection. If it is secure, the connection will be through <Details
			description="todo"
			summary="HTTPS"
		/>, which means that the data is encrypted while it is in transit, that the data cannot by
		altered while it is in transit, and that websites have to use digital certificates to
		authenticate themselves. This protects users from cyberattacks, such as trying to steal data
		over an open Wi-Fi network. However, if the website does not meet certain requirements,
		<Details description="todo" summary="HTTP" /> will be used instead. HTTP has been there since the
		beginning of the internet, it is part of the core of how the World Wide Web works. HTTPS re-uses
		the logic of HTTP, but adds on extra security.
	</li>
	<li>
		After receiving the HTML file, the browser starts reading it. HTML files contain the structure
		and content of a page. There are different HTML elements that each have their own role in a
		webpage, such as buttons, anchors, headings and paragraphs. HTML elements are nested in a
		hierarchy. This hierarchy is converted into a Document Object Model (DOM) tree. This tree
		represents the hierarchical structure of the HTML document. It consists of "<Details
			description="todo"
			summary="nodes"
		/>", which are the branches of the DOM tree. Just like a real tree, each branch can split up
		into other branches, creating smaller branches. These are called <Details
			summary="child"
			description="todo"
		/> nodes.
	</li>
	<li>
		As the browser works through the document, it will come accross additional resources that are
		mentioned in the document. For example, a CSS file would contains the styles that determine the
		layout, colors, fonts, and other visual aspects of the page. A JavaScript file contains code
		that can manipulate the content and behavior of the page dynamically, such as adding
		interactivity or fetching data from a server. There may also be other resources such as images,
		videos, or for example fonts. The browser will request the additional resources from the server.
	</li>
	<li>
		Once all the required resources are received and connected to the DOM, the browser turns the DOM
		tree into something visual by rendering it. It applies the styling to the different elements and
		executes the JavaScript that was included. For this, each browser has a rendering engine that
		knows how to do this work.
	</li>
</List>
<p>
	Sounds overwhelming? Don't worry. As a developer, you usually do not need to worry about the
	underlying processes. It is simply a starting point for understanding the the different pieces of
	code that you will be writing. Furthermore, being mindful of the bigger picture helps you
	understand why and how code works the way it works.
</p>

<Heading as="h2">Single-Page applications</Heading>

<p>
	In websites that follow the traditional model, each URL would represent a separate HTML file that
	would be requested. If you would navigate from "example.com" to "example.com/about", a new HTML
	document would be fetched. This might mean that there is information that is present on both
	pages, such as the general layout and header navigation, gets refetched each time. Also, it has in
	recent years become more expected that a website can behave like an app, remembering user
	preferences and recent interactions, even as you change pages.These are two of the reasons why
	nowadays, it is quite popular nowadays to have only one HTML file, but use JavaScript to swap out
	parts of the content when the URL changes. This is called a Single-Page Application (SPA). This is
	also where frameworks like REACT or Angular come into practise. These frameworks exist to make it
	easier to dynamically render content, but in the end they will always compile back into HTML, CSS
	and JavaScript.
</p>

<p>
	The majority of this course will be focused on learning the essentials of HTML, CSS and
	JavaScript. Once you get a good feeling how these three technologies work and have a basic
	understanding of them, you can feel free to explore other frameworks. In the end, it is more
	important to understand the basic features that support the World Wide Web. Frameworks tend to
	change and shift in popularity over time, which can make it hard to keep up. However, if you focus
	on having a solid understanding of the underlying principles, you can always adept and therefore
	more easily keep up with demands.
</p>
