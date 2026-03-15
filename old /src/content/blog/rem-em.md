---
title: "First post"
description: "Lorem ipsum dolor sit amet"
pubDate: "Jul 08 2022"
heroImage: "../../assets/blog-placeholder-3.jpg"
---

# When to use rem, and when to not

As someone who considers themselves an expert in accessibility, I have been aware of the importance of using relative units for font sizing for a while. I was under the impression that this was a common wisdom in the frontend realm, although I knew there were some nuances and debates on usage beyond `font-size`, such as for padding and margins. However, when I dove deeper into articles to find some guidance, I found that there is not a clear consensus on when to use `rem` and when to use `px` for different properties. Furthermore, there is still a lot of misunderstanding about the usability of `rem`.

If you are as confused as I am, I have written this article for us. I will dive into research, user needs, common caveats and finally best practices. If you want a tldr, you can jump to the [strategy](#strategy) section, where I recommend what to use for each property, and how to implement it.

## Understanding the units

REM.

## Usage in the wild

I took the top 10 websites according to [Semrush](https://www.semrush.com/website/top/) (omitting any that were not family-friendly) and checked a random text node on each of them to see if they use rem or px for font size, and what they use for padding. The results are as follows:

| Site      | What                              | Font size | padding or margin |
| --------- | --------------------------------- | --------- | ----------------- |
| Google    | Geading of search result          | px        | px                |
| Youtube   | Video description                 | rem       | px                |
| Facebook  | Text post content                 | rem       | px                |
| Instagram | Post description on home timeline | px        | px                |
| ChatGPT   | Login prompt description          | rem       | rem               |
| Reddit    | comment content                   | rem       | rem               |
| WhatsApp  | Message content                   | rem       | px                |
| Amazon    | Search result title               | px        | px                |
| Yahoo     | Highlighted article description   | px        | px                |
| Tiktok    | Post description on detail page   | px        | px                |

My expectations were that most websites would use rem for font size, and that some would use it for padding as well. It turns out that using rem for font sizes is not as c

## caveats

https://www.reddit.com/r/webdev/comments/1j5qjlg/i_finally_understood_why_using_rem_instead_of_px/
=> they used REM as a tool to manage their design system, not necessarily for accessibility reasons.By overriding the root pixel value.

## Existing wisdoms

Honestly, I struggled to find many in-depth resources on this topic. I did come accross Josh Comeau's article on the surprising truth about pixels and accessibility, which is a great resource to understand the implications of using different units for font sizing and spacing. I also found some discussions on the topic in various forums and blogs, but there doesn't seem to be a widely accepted convention or best practice for when to use rem, em, dvh, dvw, ch or px units in CSS.

## Strategy

# CSS length units

For CSS properties that accept a length value, the unit should be chosen according to the following convention:

- `rem` for font-size and functional icon sizes
- numeric values without units for `line-height`
- `em` for semantic space between elements (e.g. `margin-bottom: 0.5em` to signal an end of a paragraph)
- `dvh` and `dvw` for elements that need to be sized according to the viewport, mainly for page-level layout
- `ch` for elements that need a character-based width or width limit
- for width and height, prefer dynamic layouts that do not require a fixed length unit, such as flexbox or grid, allowing the content to determine the size of elements, and using padding, margins, gaps and justification patterns to create space between them. Plan for overflow when the content exceeds the available space.
- `px` for things that do not need to scale, such as borders, shadows, decorative spacing

## Context

There is a large variety of CSS length unit available to frontend developers. The same visual space can be achieved with different units, but the way it responds to changing conditions varies.
Users with visual impairments may use the option of changing the font size of their browser. `rem` values will scale with the browser font size, as long as the root font size is not set to a fixed pixel value. `px` values will not scale, which makes resizing the text ineffective.
Users of visual impairment may also use zoom functionality in their browser or at the OS level. Zooming in will scale the entire page, including both `rem` and `px` values. As long as the layout is designed to be responsive and flexible, it should adapt to the zoom level without breaking. This satisfies WCAG 2.1 guidelines for text resizing and zooming, which require that content remains accessible and usable when the text size is increased up to 200%.
For managing zoom, there are no specific CSS units that are more effective than others, but for font resizing, we want to ensure an optimal experience.

## Options

### Option 1

Use fixed pixel values for font size, spacing, widths, and other properties that affect the layout.

#### Advantages:

- easy to implement and calculate
- consistent layout between different devices and user settings

#### Disadvantages:

- font is not resizable
- depending on implementation, the layout may not be responsive

### Option 2

Use rem units for font sizing, spacing, widths, and other properties that affect the layout.

#### Advantages:

- font is resizable
- spacing scales with the font size, maintaining the visual relationships between elements even when the font size is changed

#### Disadvantages:

- as the font size increases, padding and margins scaling with the font size. Depending on the layout, this can reduce the amount of space available for the content, which can lead to overflow and a broken layout.

### Option 3

Use a combination of rem, em, dvh, dvw, ch and px units for different properties, according to their specific needs and the desired user experience.

#### Advantages:

- adapt to font resizing, while still staying in control of the overall layout

#### Disadvantages:

- more complex to design and implement
- sometimes the line between decorative and functional spacing can be blurry
- might need to maintain more tokens for the different properties, which increases maintenance effort and bulk

## Decision

Prioritizing user experience over ease of implementation, we choose option 3, using a combination of rem, em, dvh, dvw, ch and px units for different properties. Based on the resources consulted, the following guidelines will be followed:

- font-size must always be set in `rem` units.
- line-height does not need a specific unit, using a plain number is already relative to the font size and will scale accordingly.
- icons that are used as functional elements (e.g. a search icon in a search input) should be sized in `rem` units, since they have a similar need to scale with the font size for accessibility reasons. See [functional images](https://www.w3.org/WAI/tutorials/images/functional/).
- spacing that is used in a semantic way, to signal the relationship between elements (e.g. margin-bottom on a paragraph) should be set in `em` units. That way, when the font size is increased, the spacing will also increase proportionally, maintaining the visual relationships between elements.
- other spacing, margins, padding, gaps, borders, shadows and decorative spacing should be set in `px` units. These properties are considered decorative and do not need to scale with the font size. They will still scale when the user zooms in.
- for usage of other values, there are conventional wisdoms that are written down in the summary on the top of this document.
- in any layout, there must be a certain level of flexibility to acommodate different font sizes and zoom levels, as well as overflowing content. Use the correct layout techniques (e.g. flexbox, grid) in combination with the appropriate length units to achieve this.

To decide whether spacing is decorative or semantic, ask yourself if the spacing is necessary to maintain the visual relationship between elements. If it is removed, would it be harder to understand the structure of the content? If the answer is yes, then it is likely that the spacing is semantic and should be set in `em` units. If the answer is no, then it is likely that the spacing is decorative and can be set in `px` units.

## Sources

- https://www.w3.org/WAI/tutorials/images/functional/
- https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/
- https://www.a11y-collective.com/blog/what-is-rem-in-css/
- https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html
- https://matklad.github.io/2022/11/05/accessibility-px-or-rem.html
- https://www.craigabbott.co.uk/blog/accessibility-and-font-sizes/
- https://css-tricks.com/users-do-change-font-size/
