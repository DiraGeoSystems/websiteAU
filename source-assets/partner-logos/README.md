# Partner logo originals

Full-size source files for the partner logo carousel. This folder is excluded
from the Jekyll build (`_config.yml`), so none of these files are deployed.

The site uses downscaled copies in `dist/img/partner-logos/`, exported at
2x their display height:

- 120px tall for `.partner-logo` (displayed at max 60px)
- 80px tall for `NSWGov_SpatialServices_limspace.png` (only shown at <=768px,
  where logos are displayed at max 40px)

To update a logo, edit or replace the original here, then re-export it into
`dist/img/partner-logos/` at the height above.
