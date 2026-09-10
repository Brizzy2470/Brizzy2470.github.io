# Website Owner Guide

This website is set up so normal updates do **not** require editing React components or CSS.

## The three places you normally use

### 1. Change your name, bio, links, skills, or homepage text
Edit:

`src/data/site.ts`

The comments in that file mark the editable website content.

### 2. Add or edit a project
Edit:

`src/data/projects.ts`

To add project photos, create a folder whose name exactly matches that project's `slug`:

`src/media/projects/project-alpha/`

Put the photos in that folder. The first image (alphabetically/numerically) automatically becomes the project cover, and the rest appear on the project page.

Recommended naming:

- `01-cover.jpg`
- `02-process.jpg`
- `03-final.jpg`

### 3. Add lots of photography
Create a folder inside:

`src/media/galleries/`

For example:

`src/media/galleries/portraits/`

Then drop photos into it:

- `01.jpg`
- `02.jpg`
- `03.jpg`

That's it. The folder automatically becomes a gallery on the website.

Examples:

- `src/media/galleries/portraits/`
- `src/media/galleries/street-photography/`
- `src/media/galleries/events/`
- `src/media/galleries/graphic-design/`

The site converts folder names into readable gallery titles automatically.

## Optional gallery customization

You only need `src/data/galleries.ts` when you want to:

- rename a gallery without renaming its folder
- add a gallery description
- control gallery order
- change how many photos are initially previewed
- add captions to individual photos

Adding photos alone does **not** require editing this file.

## Profile picture

Put the profile image here:

`public/images/profile/profile.jpg`

The included project temporarily falls back to the profile photo currently hosted in the original GitHub repository if this local file has not been added yet.

## Photo recommendations

For good loading speed:

- JPG or WebP is best for photographs.
- Try to keep normal portfolio images around 1–3 MB or less.
- Keep the full-resolution originals somewhere else as a backup.
- Use numbered filenames (`01`, `02`, `03`) when the order matters.

The site already uses lazy loading for gallery images, so images farther down the page are not treated like homepage-critical assets.

## What you normally should NOT edit

You generally do not need to touch:

- `src/Home.tsx`
- `src/Work.tsx`
- `src/About.tsx`
- `src/Contact.tsx`
- `src/ProjectDetail.tsx`
- any `.css` file
- `src/components/`

Those files are the website engine and visual design.

## Updating through GitHub without coding locally

For small text changes, you can open the file on GitHub, click the pencil/edit button, make the change, and commit it.

For photos, upload the files into the correct `src/media/...` folder and commit them. GitHub Actions will rebuild and deploy the site automatically after changes reach `main`.
