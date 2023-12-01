
# The Dira Website

It “lives” in a Git repository, is statically generated
(well, at present really just statically created), and
online at <https://dirageosystems.ch> since December 2021.

In 2023 we contracted dreamis.ch to redesign the website.
It now uses Bootstrap (no longer W3CSS) and the custom CSS
is generated and minified from scss/custom.scss (keep these
files in sync, either with a scss processor or manually).

Please keep this **simple** and **static.**

## Hosting

Presently hosted at [GitHub Pages](https://pages.github.com),
straight from the GitHub repository. Things to consider:

- GitHub Pages only works for a public repository
- GitHub Pages publishes the *docs/* directory on the *main* branch
- need empty file *docs/.nojekyll* to disable Jekyll
- turned on “Enforce HTTPS”: HTTP requests get a 301
  (permanent redirect) to HTTPS; good
- configured the custom subdomain `www.dirageosystems.ch` and the
  custom apex domain `dirageosystems.ch`; a DNS CNAME record points
  `www.dirageosystems.ch` to `dirageosystems.github.io` and several
  DNS A records point `dirageosystems.github.io` to the GitHub servers
- read the GitHub Pages docs about custom domains

## Structure

- README.md – what you are reading now
- docs/ – the finished site to be published
- docs/dist/{css,fonts,icons,img,js}/ – published static assets
- docs/scss/ – custom CSS source for new site
- docs/foo/ – subfolders for topics may be used
- docs/v1/index.html – the old (version 1) site for reference
- docs/prosuite/doc/api/* – generated Python `prosuite` documentation

(I'd prefer to rename *docs/* to *site/*, but *docs/* is
required by GitHub Pages, where we intend to publish.
The empty `.nojekyll` file is also for GitHub Pages.)

## Editing Workflow

1. Git: Clone the repository (once only)
2. Edit the web site. Remember: only files in *docs/* are published.
   Files outside this folder, like this README file, are not part
   of the published web site.
3. Test locally: open your local copy of *index.html* in
   a browser (better: several browsers), navigate to your
   changes, test behavior. You may use the browser's
   Debugger tools (**F12**) to simulate small screens
   and look into the console for errors and warnings.
4. Git: review and commit your changes.
   Use a short but descriptive commit message.
5. Git: push your commit(s) to GitHub; it will automatically
   publish the changes within a few minutes.
6. Test the published web site: navigate to
   <https://www.dirageosystems.ch> and review your changes
   with your Desktop browser and your mobile browser.

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

## Analytics

*Should* we decide for site usage statistics, we could use
good old StatCounter (I'm using this for the IEG site) or
Google Analytics as in the snipped below. But beware that
we have to update our **privacy policy** accordingly!

```HTML
<!-- Google Analytics: change UA-XXXXX-Y to be your site's ID. -->
<script>
  window.ga = function () { ga.q.push(arguments) }; ga.q = []; ga.l = +new Date;
  ga('create', 'UA-XXXXX-Y', 'auto'); ga('set', 'anonymizeIp', true);
  ga('set', 'transport', 'beacon'); ga('send', 'pageview')
</script>
<script src="https://www.google-analytics.com/analytics.js" async></script>
```

## Search Engines

- [Google Search Console][gsc] may report a duplicate that is has
  no canonical link; this asks for a `<link rel="canonoical" ...>`
  element; see also [Wikipedia article][wikicanonical]

[gsc]: https://search.google.com/search-console
[wikicanonical]: https://en.wikipedia.org/wiki/Canonical_link_element

## Miscellaneous

The “hamburger” symbol ☰ has Unicode 2630 (hex) or 9776 (dec).
Use the entity `&#9776;` &#9776; or `&#x2630;` &#X2630; in HTML.

First drafts of the Dira Logo were created on looka.com here:
<https://looka.com/s/77498297>. The present version was drawn
from scratch in Inkscape.

HTML5 Boilerplate comes with a host of metadata/files.
Here is a short summary of how they work:

### Icons and Tiles

- favicon.ico can be created with Gimp: just export to `*.ico`
- icon.png is the Apple Touch Icon for iOS devices
- tile.png and tile-wide.png are for IE11 tiles

### Meta Files

- robots.txt – config site crawling, see <https://www.robotstxt.org>
- browserconfig.xml – settings for IE11 and Edge browsers, see
  <https://msdn.microsoft.com/en-us/library/ie/dn455106.aspx>
- site.webmanifest – the Web App Manifest, see below
- 404.html – should be returned on HTTP/404 errors (works with GitHub Pages)
- CNAME – required by GitHub Pages
- .nojekyll – required by GitHub Pages (to avoid Jekyll processing)

### Web App Manifest

The web app manifest belongs to the realm of progressive web
apps (PWAs) and allows a web site to be installed on a mobile
device's home screen (without an app store). It is a JSON file
referenced from HTML with `<link rel="manifest" href="FILE">`.
[Mozilla](https://developer.mozilla.org/en-US/docs/Web/Manifest)
has the details.

### Open Graph Metadata

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

- <https://pages.github.com/>  
  free website hosting straight from a GitHub repo.
