Images served by the API at /images/<file> (the browser uses /api/images/<file>).
They are copied into the application image at build time. Keep each file under 100 MB.

Included so the site works out of the box:
  hero_1.jpg, hero_3.jpg, hero_4.jpg, hero_vid.mp4  - home page banners (made from frontend/src/assets)
  bg1.png, bg2.png, bg3.png                         - plain room backgrounds for the gallery visualiser
  art1.jpg ... art4.jpg                             - demo artwork images

Replace any of these with the original ArtWall files if you have them (same file names).
When creating an artwork in the admin panel, enter image URLs as "/art1.jpg", "/art2.jpg", etc.
