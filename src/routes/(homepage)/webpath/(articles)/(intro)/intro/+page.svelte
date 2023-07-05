<script lang="ts" context="module">
	import { Heading, Details, List } from '@components';
	import type { PageMetaData } from '../../../types';
	import Image from '@components/Image.svelte';
	import surfInternet from './surfInternet.webp';

	export const metadata: PageMetaData = {
		glossary: {
			URL: {
				summary: 'URL',
				description: `Uniform Resource Locator, also called web address.
			It specifies the location of a web resource on a network. URL's are shown 
			in the address bars of browsers.`
			},
			DNSServer: {
				summary: 'DNS Server',
				description: `DNS Servers or name servers transform URL's into IP addresses. 
			They keep track of DNS records to know which IP relates to which domain.`
			},
			HTML: {
				summary: 'HTML',
				description: `HyperText Markup Language is the standard markup language for 
				documents designed to be displayed in a web browser.`
			},
			protocol: {
				summary: 'protocol',
				description: `System of rules that defines how information is tranferred between 
			two entities. Important web protocols include HTTP, SSH, UDP, DNS and IP.`
			},

			HTTP: {
				description: `HyperText Transfer Protocol. It describes the rules of how
				web documents are transferred. Clients such as a browser do requests to a 
				server, which will send a response back. HTTP headers can be used to further
				finetune the way a request should be handled.`,
				summary: 'HTTP'
			},
			HTTPS: {
				description: 'Extension of HTTP that adds authentication and encryption.',
				summary: 'HTTPS'
			},
			DOM: {
				description: `Domain Object Model. It describes that elements in a HTML (or XML) 
				document follow a tree structure, in which each node can be a separate branch, and 
				nodes can be nested in other branches as children. DOM methods allow us to programatically
				access the tree.`,
				summary: 'DOM'
			},
			node: {
				description: `In computer science, a node is a unit that is part of a 
				larger data structure. For example, in a HTML DOM tree, a node is a HTML
				element. Nodes that are nested in other nodes are called child nodes, the 
				node above being the parent node`,
				summary: 'node'
			},
			CSS: {
				description: `Cascading Style Sheets. It is the most common way of defining styling
				in HTML documents. Styles can be applied to certain elemens such as buttons or
				headings, or grouped together in classes. CSS is written in one or more separate
				files that are imported in a HTML document.`,
				summary: 'CSS'
			},
			JS: {
				description: `A programming language that is commonly used to add functionality to 
				web pages. The language has lots of built-in features that can be used to manipulate 
				the DOM and fetch data. JavaScript can also be used to write scripts or backend code.`,
				summary: 'JavaScript'
			},
			SPA: {
				description: `Single-page application. A website that interacts 
				with the user by dynamically rewriting the current web page with new data from the 
				web server, instead of loading entire pages for each section. 
				The goal is faster transitions that make the website feel more like a native app.`,
				summary: 'SPA'
			},
			react: {
				description: `React is a JavaScript framework used to build apps with components.
				It is maintained by Meta and is open-source. React components are written in JSX, 
				which is a combination of JavaScript and HTML.`,
				summary: 'React'
			},
			angular: {
				description: `Angular.`,
				summary: `Angular is a JavaScript framework used to build apps with HTML templates and 
				special JavaScript functions. It is maintained by Google and is open-source. `
			}
		}
	} as const;

	const glossary = metadata.glossary;
</script>

<p>
	Today marks the beginning of your journey into web development. You will be transforming from a
	mere surfer of the web to a creator of pages and applications. Like an author writing a book, or
	an artist painting a piece of art, you will learn how to use your creative brain to construct
	digital experiences. In this course, you will learn the fundamental techniques required to build
	web pages. Let's get started!
</p>

<Image
	src={surfInternet}
	alt={`90's textbook of a child surfing the web, where the surfboard is a keyboard.`}
	width="50%"
	height="auto"
	aspectRatio="393 / 443"
	style="align-self: center"
/>

<Heading as="h2">How the web works</Heading>
<p>
	When you enter an address in the browser or click a link, you have to maybe wait for a bit, and
	then a website magically appears. But how does it work behind the scenes? Let's divide it up into
	steps.
</p>
<List type="ordered">
	<li>
		First of all, the address you have entered needs to be converted into an IP address. The
		<Details {...glossary.URL} /> that you have entered cannot be used directly to request information
		from a server. The browser sends a request to a <Details {...glossary.DNSServer} /> to convert the
		URL into an IP address. For example, if you enter the URL "www.example.com" in the browser, the corresponding
		IP address would be "192.0.2.123".
	</li>
	<li>
		The browser sends a request to the IP address where the website is hosted. Usually, it first
		requests the <Details {...glossary.HTML} /> document associated with the requested website. The way
		the data is transferred, i.e. the <Details {...glossary.protocol} /> , is dependent on whether the
		website uses a secure connection. By default, a browser wil do a <Details {...glossary.HTTP} /> request.
		HTTP is one of the core technologies that drives the web. If additional security requirements are
		met, the request will be through <Details {...glossary.HTTPS} /> instead. The data being transferred
		will then be encrypted and cannot be altered while it is in transit. Servers have to use digital
		certificates to authenticate themselves. This protects users from cyberattacks, such as trying to
		steal data over an open Wi-Fi network.
	</li>
	<li>
		After receiving the HTML document, the browser starts reading it. HTML documents contain the
		structure and content of a page. There are different HTML elements that each have their own role
		in a webpage, such as buttons, anchors, headings and paragraphs. HTML elements are nested in a
		<Details {...glossary.DOM} /> tree, i.e. a hierarchical structure that branches out from a single
		root. A branch of the DOM tree is called a <Details {...glossary.node} />. Just like a real
		tree, each branch can split up into other branches, creating smaller branches. These are called
		child nodes.
	</li>
	<li>
		As the browser works through the document, it will come accross additional resources that are
		mentioned in the document. For example, a <Details {...glossary.CSS} /> file would contains the styles
		that determine the layout, colors, fonts, and other visual aspects of the page. A <Details
			{...glossary.JS}
		/> file contains code that can manipulate the content and behavior of the page dynamically, such
		as adding interactivity or fetching data from a server. There may also be other resources such as
		images, videos, or fonts. The browser will request the additional resources from the server.
	</li>
	<li>
		Once all the required resources are received and integrated in the DOM, the browser turns the
		DOM tree into a visual representation by rendering it. It applies the styling according to the
		CSS rules and executes the JavaScript that was included. For this, each browser has a rendering
		engine that knows how to do this work.
	</li>
</List>
<p>
	Feeling overwhelmed? Don't worry. As a developer, you usually do not need to worry about the
	underlying processes. It is simply a starting point for understanding the different pieces of code
	that you will be writing. Furthermore, being mindful of the bigger picture might help you
	understand why and how code works the way it works.
</p>

<Heading as="h2">A note on single-Page applications</Heading>

<p>
	In websites that follow the traditional model, each URL would represent a separate HTML file that
	would be requested. If you would navigate from "example.com" to "example.com/about", a new HTML
	document would be fetched. This is the traditional model. However, in recent years it has become a
	common requirement that a website should behave like an app. When you navigate to a different
	subpage, only the parts that change should be loading. User preferences and recent interactions
	stay consistent throughout the website. To achieve this, some developers choose to serve only one
	HTML file and use JavaScript to swap out parts of the content when the URL changes. This is called
	a Single-Page Application (<Details {...glossary.SPA} />). This is also where frameworks like
	React or Angular come into practise. These frameworks make it easier to develop dynamic webpages,
	but in the end they will always compile back into HTML, CSS and JavaScript.
</p>

<p>
	The majority of this course will be focused on learning the essentials of HTML, CSS and
	JavaScript. It is important to have a solid understanding for these three technologies, before
	starting to think about any frameworks. Frameworks rely on the same technologies, therefore having
	a good grasp on the basics will make it easier for you to understand how to use them and how they
	work. Furthermore, frameworks tend to change and shift in popularity over time, which can make it
	hard to keep up. If you focus on understanding of the underlying principles, you can always adept
	and therefore more easily keep up with demands.
</p>
