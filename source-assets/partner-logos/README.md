# Partner logo originals

Full-size source files for the partner logo carousel. This folder is excluded
from the Jekyll build (`_config.yml`), so none of these files are deployed.

The site uses downscaled copies in `dist/img/partner-logos/`, exported at
2x their display height:

- 120px tall for `.partner-logo` (displayed at max 60px)
- 80px tall for `NSWGov_SpatialServices_limspace.png` (only shown at <=768px,
  where logos are displayed at max 40px)

Exception: the BKG logo is used as SVG, in a German and an English version.
`BKG_2017_WebSVG_de.svg` and `BKG_2017_WebSVG_en.svg` are the originals from
the BKG logo package (whose readme names the SVG as the preferred web format,
always placed on white). `dist/img/partner-logos/BKG_Logo_de.svg` and
`BKG_Logo_en.svg` are the same files with their `viewBox` cropped to the logo,
dropping the white protection zone so the text stays legible at 60px. Both use
the same `viewBox` (`22.5 20.5 155.75 62.125`), which leaves a little white on
the right of the narrower English logo. Equal widths matter because the
carousel measures its width only once, so switching language must not change it.

To update a logo, edit or replace the original here, then re-export it into
`dist/img/partner-logos/` at the height above.
