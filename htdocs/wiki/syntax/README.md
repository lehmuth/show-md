# Wiki for show-md

!{../table_of_contents.md}

## Markdown syntax

### Paragraphs
To write casual text paragraphs use one or more lines of text seperated by one or more empty lines.

	This is text line one,
	This is text line two,

	This is text line three,
	And this is text line four


	More lines of space
	or more lines of text don't influence
	the look of a paragraph...


	With at least three space characters at the end of a line     
	it is possible to make a manual linebreak

**Parsed to:**

> This is text line one,
> This is text line two
>
> This is text line three,
> And this is text line four
>
> More lines of space
> and another paragraph of text also look the same...
>
>
> With at least three space characters at the end of a line     
> it is possible to make a manual linebreak

### Headlines
There are six available sizes of headlines. To define the level write
the number of #'s in the front of a line:

	# Heading 1
	## Heading 2
	### Heading 3
	#### Heading 4
	##### Heading 5
	###### Heading 6

**Parsed to:**

> # Heading 1
> ## Heading 2
> ### Heading 3
> #### Heading 4
> ##### Heading 5
> ###### Heading 6

### Text styling

#### Bold
Make text bold with \*\* before and afterwards:

	**This text is bold**

**Parsed to:**

> **This text is bold**

#### Underlined
Make text underlined with \_\_ before and afterwards:

	__This text is underlined__

**Parsed to:**

> __This text is underlined__

#### Italic
Make text italic with \* before and afterwards:

	*This text is italic*

**Parsed to:**

> *This text is italic*

#### Strikethrough
To strikethrough text use \~\~ before and afterwards:

	~~This text is strikethrough~~

**Parsed to:**

> ~~This text is strikethrough~~

#### Blockquotes
To write a line of blockquotes write a > in the beginning of a line

	> This is a blockquote.

**Pased to:**

> This is a blockquote.

#### Code
To write code you just have to put a tab or four white spaces in the front of a line:

		This is code

**Parsed to:**

>	 This is code

### Lists
#### Unordered list
To make an unorder list use -, + or * followed by one to three whitespace:

	- This is a list item
	+  and this
	*   and this too.

**Parsed to:**

> - This is a list item
> + and this
> * and this too.

#### Ordered list
To make an ordered list add the number in front of the line:

	1. This is point 1
	2. and this point 2

**Parsed to:**

> 1. This is point 1
> 2. and this point 2

#### Checklist
To make a checklist add a checked or unchecked bracket box in front of the line:

	- [ ] unchecked box
	- [x] checked box

**Parsed to:**

> - [ ] unchecked box
> - [x] checked box

#### Multiline listitem
To write multiple lines in one list item (no matter which type) put a tab in front of the following lines:

	*   first line
		second line
		third line

**Parsed to:**

> * first line
> 	second line
> 	third line

#### Paragraph list
If at least one list item in the list is seperated threw a blank line a paragraph list is created:

	+ this is list item one

	+ this is list item two
	+ and list item three

**Parsed to:**

> + this is list item one
>
> + this is list item two
> + and list item three

#### Nested list
To make a nested list use four whitespaces or a tab for each stage the icon should have:

	1. ordered list item level 1
		+ unordered list item level 2
		2. ordered list item level 2
	2. unordered list item level 1

**Parsed to:**

> 1. ordered list item level 1
> 	+ unordered list item level 2
> 	* unordered list item level 2
> 2. ordered list item level 1


### Emojies
To use emojies you have to enter the matching code. To see a
[list](https://github.com/showdownjs/showdown/wiki/emojis) look at the showdown wiki.



### Links {links}
To make a link use:

	[link](/link/to/file/name.extension)

**Parsed to:**

> [link](#links)
