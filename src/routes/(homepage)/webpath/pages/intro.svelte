<p>Today starts your journey into web development. WRITE something cute here.</p>

<h2>What happens when you access a website?</h2>
<p>There are a few steps.</p>
<ol>
	<li>
		The browser sends a request to a DNS server to convert the URL the user has entered into an IP
		address. ADD EXAMPLE.
	</li>
	<li>
		The browser sends a request to the IP address of the server that hosts the website. Usually, it
		first requests the HTML file associated with the requested website.
	</li>
	<li>
		The browser starts reading through the received HTML file. HTML files contain the structure and
		content of a page. There are different HTML elements that each have their own role in a webpage.
		You can think for example about <code>&ltp&gt</code> 'paragraph' elements for text,
		<code> &lta&gt</code> 'anchor' elements for links and <code> &ltbutton&gt</code> elements for buttons.
		The HTML elements are grouped together in a hierarchical sense. The browser reads the HTML document,
		and convert its into a Document Object Model (DOM) tree. This tree represents the hierarchical structure
		of the HTML document, with each element becoming a node in the tree.
	</li>
	<li>
		As it reads through the document, it will come accross additional resources. For example, CSS
		file would contains the styles that determine the layout, colors, fonts, and other visual
		aspects of the page. The JavaScript file contains code that can manipulate the content and
		behavior of the page dynamically, such as adding interactivity or fetching data from a server.
		There may also be other resources such as images, videos, or for example fonts.
	</li>
	<li>
		Once all the required resources are also received and connected to the DOM, the browser turns
		the DOM tree into something visual by rendering it. It applies the styling to the different
		elements and executes the JavaScript that was included.
	</li>
</ol>
<p>
	This is, of course, a simplified view, but it helps to get an idea of what happens under the hood.
	You usually do not need to worry much about this process, but it is still good to be aware of it.
</p>
<p>
	Back in the day, each URL would represent a separate HTML file that would be requested. However,
	it is quite common to have a lot of content that stays the same across different pages of a
	website. That is why it is quite popular nowadays to have only one HTML file, but use JavaScript
	to swap out parts of the content when the URL changes. This is called a Single-Page Application
	(SPA). This is also where frameworks like REACT or Angular come into practise (or Svelte, in which
	this tutorial was coded). These frameworks exist to make it easier to dynamically render content,
	but in the end they will always compile back into HTML, CSS and JavaScript. You can also create
	SPAs without any framework, which we call Vanilla JavaScript.
</p>

<p>
	The majority of this course will be focused on learning the essentials of HTML, CSS and
	JavaScript. Once you get a feeling how these three technologies work and have a basic
	understanding of them, you can feel free to explore other frameworks. In the end, it is however
	more important to understand the basics that support the world wide web. Frameworks tend to change
	and shift in popularity over time, which can make it hard to keep up. However, if you focus on
	having a solid understanding of the underlying principles, you can always and adept and more
	easily keep up with demands.
</p>
