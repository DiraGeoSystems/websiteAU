
# The Dira Website

It “lives” in a Git repository, is statically generated
(well, at present really just statically created), and
online at <https://www.dirageosystems.ch> since November 2021.

Please keep this simple and static.

## Structure

- README.md – what you are reading now
- docs/ – the finished site to be published
- docs/css/
- docs/img/
- docs/js/

(I'd prefer to rename *docs/* to *site/*, but *docs/* is
a required by GitHub Pages, where we intend to publish.
The empty `.nojekyll` file is also for GitHub Pages.)

## Icons and Tiles

- favicon.ico can be created with Gimp: just export to `*.ico`
- icon.png is the Apple Touch Icon for iOS devices
- tile.png and tile-wide.png are for IE11 tiles

## Meta Files

- robots.txt – config site crawling, see <https://www.robotstxt.org>
- browserconfig.xml – settings for IE11 and Edge browsers
- site.webmanifest – the Web App Manifest, see below
- 404.html – should be returned on HTTP/404 errors

## Web App Manifest

The web app manifest belongs to the realm of progressive web
apps (PWAs) and allows a web site to be installed on a mobile
device's home screen (without an app store). It is a JSON file
referenced from HTML with `<meta rel="manifest" href="FILE">`.
[Mozilla](https://developer.mozilla.org/en-US/docs/Web/Manifest)
has the details.

## Open Graph Metadata

The `og:foo` meta tags are for the Open Graph Protocol,
a Facebook thingy that helps control what Facebook (and
others) display when their users share this page.
Details on <https://ogp.me/>

## References

- <https://html5boilerplate.com> and  
  <https://github.com/h5bp/html5-boilerplate>  
  consulted for a kick start and modern web compliance

- <https://www.w3schools.com/w3css/default.asp>  
  The CSS framework used. It is disputed, but simple
  to use, lightweight, and just works.

- <https://looka.com>  
  a useful online logo generator; could download an
  entire brand kit, but that is no longer free
