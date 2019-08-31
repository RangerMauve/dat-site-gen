# dat-site-gen
A static site generator using the Dat SDK

## Goals

- Run in the CLI, Beaker, or the Browser
- Posts are markdown files in the archive
- Regular CSS file for styles
- Posts get rendered with `createdAt`, `updatedAt` based on file stat
- Generate a `<title>` element based on the first `<h1>`
- Mobile friendly meta tags
- Have an example archive which enables building the site from within itself
  - Figure out how to get this to work on regular websites (key import?)
  - Basic text editor for posts?

### Future

- Custom JS templates?
- Nicer editor?
