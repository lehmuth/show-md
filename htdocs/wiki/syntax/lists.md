# Wiki to show-md

!{../table_of_contents.md}

## Syntax

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
