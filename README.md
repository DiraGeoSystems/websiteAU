
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
required by GitHub Pages, where we intend to publish.
The empty `.nojekyll` file is also for GitHub Pages.)

## Rechtliches

In der Schweiz gibt es seit 2012 eine **Impressumspflicht**
(revidiertes Gesetz über den unlauteren Wettbewerb UWG).
In Deutschland gibt es das als *Anbieterkennzeichnung* schon
länger. Es geht darum, dass der Urheber der Seiten zweifelsfrei
identifiziert und kontaktiert werden kann. Also: Firmenname
(wie im Handelsregister eingetragen), funktionierende Mail
und Postadresse, optional Telefonnummer und Firmennummer.
Dies entweder auf jeder Seite oder auf jeder Seite einen
Link zu einer Impressum-Seite.

**Achtung:** für eine Geschäftstätigkeit in Deutschland/EU
sind weiter erforderlich:

- Name und Vorname einer vertretungsberechtigten Person
- Telefonnummer
- Umsatzsteuer- oder Wirtschaftssteuer-Identifikationsnummer (wenn vorhanden)
- Handels-, Vereins-, Partnerschafts- oder Genossenschaftsregister
  mit Registernummer (falls vorhanden)

Quelle: <https://www.cyon.ch/blog/Impressum-Websites/>

Weiter ist eine **Datenschutz-Erklärung** zwingend.
Sobald die Seite von EU-Bürgern verwendet wird, werden diese
sich auf die DSGVO berufen, wir müssen also auch hinsichtlich
DSGVO eine vollständige und korrekte Datenschutz-Erklärung
erstellen und auf jeder Seite (im Footer) verlinken.
Bei Hosting auf *GitHub Pages* (oder wo auch immer) ist
sicher mindestens auf deren Datenschutzerklärung zu verweisen.

Siehe:

- <https://www.cyon.ch/blog/anleitung-datenschutzerklaerung>
- <https://www.datenschutzstelle.li/index.php/?cID=316>
- <https://docs.github.com/en/github/site-policy/github-privacy-statement>
- <https://docs.github.com/en/github/site-policy/global-privacy-practices>

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

## Content

The “hamburger” symbol ☰ has Unicode 2630 (hex) or 9776 (dec).
Use the entity `&#9776;` &#9776; or `&#x2630;` &#X2630; in HTML.

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
