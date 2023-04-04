# Content

All of the content for the site lives in this directory. In order to create a new piece of content, add a new directory with the name of the directory matching the slug of the post, with the appropriate frontmatter for the post or project. Included below is a description of the frontmatter and if it's required.

## Post

| Name                           | Required? | Description                                                                                                                                               |
| ------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`                        | Yes       | The title of the post.                                                                                                                                    |
| `slug`                         | Yes       | The slug of the post. Must match the name of the folder that houses the file.                                                                             |
| `date`                         | Yes       | The date of the post.                                                                                                                                     |
| `type`                         | Yes       | The type of post, should be the value `Post`                                                                                                              |
| `status`                       | Yes       | The status of the post, should be `Archived`, `Published`, or `Draft`                                                                                     |
| `description`                  | No        | The description of the post. This is used in opengraph previews (like twitter). Must be present if `link` is not present.                                 |
| `link`                         | No        | This designates a post as a link post (which is used to describe posts that refer to existing articles). Must be present if `description` is not present. |
| `image`                        | No        | The image that is displayed at the top of the post. Optional, but if included it must include both `source` and `alt`.                                    |
| `image.alt`                    | No        | The alt text of the included image.                                                                                                                       |
| `image.source`                 | No        | The source of the included image. Should be a relative path to an image in the same directory.                                                            |
| `image.attribution`            | No        | A description of where the image came from (if you do not own the rights). If present, should include `author`, `sourceName` and `sourceUrl`.             |
| `image.atttribution.author`    | No        | The creator/author of the image.                                                                                                                          |
| `image.attribution.sourceName` | No        | The source of the image, e.g. `Unsplash`.                                                                                                                 |
| `image.attriubution.sourceUrl` | No        | The url of the webpage you got the image–this is fed to a link that is clickable that sends a reader to the url to see the source of the image.           |

Here's an example frontmatter block for a post:

    ---
    title: A developer's guide to the Open Graph protocol
    slug: a-developers-guide-to-the-open-graph-protocol
    date: 2019-02-12T12:30-08:00
    type: Post
    status: Published
    description: >-
      Learn about the protocol behind iMessage link previews, Twitter cards, and
      Facebook link previews.
    image:
      source: ./Camel-train-going-through-the-desert.jpg
      alt: Camel train going through the desert
      attribution:
        author: Yeo Khee
        sourceName: Unsplash
        sourceUrl: https://unsplash.com/photos/7V1DnVStvik
    ---

And here's an empty one as a starting point:

    ---
    title:
    slug:
    date:
    type:
    status:
    description:
    image:
      source:
      alt:
      attribution:
        author:
        sourceName:
        sourceUrl:
    ---

## Project

| Name           | Required? | Description                                                                                                               |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `title`        | Yes       | The title of the project.                                                                                                 |
| `slug`         | Yes       | The slug of the project. Must match the name of the folder that houses the file.                                          |
| `date`         | Yes       | The date of the project.                                                                                                  |
| `type`         | Yes       | The type of project, should be the value `Project`                                                                        |
| `status`       | Yes       | The status of the project, should be `Archived`, `Published`, or `Draft`                                                  |
| `client`       | Yes       | The client the project was done for.                                                                                      |
| `image`        | No        | The image that is displayed at the top of the project. Optional, but if included it must include both `source` and `alt`. |
| `image.alt`    | No        | The alt text of the included image.                                                                                       |
| `image.source` | No        | The source of the included image. Should be a relative path to an image in the same directory.                            |

Here's an example frontmatter block for a project:

    ---
    title: Are You a Tourist? Posters
    slug: are-you-a-tourist-posters
    date: '2018-05-01'
    type: Project
    status: Published
    client: Michael Barrow & the Tourists
    image:
      source: ./Are-You-A-Tourist-Poster---Callout.png
      alt: Are You A Tourist? Poster - Callout
    ---

And here's an empty one as a starting point:

    ---
    title:
    slug:
    date:
    type:
    status:
    client:
    image:
      source:
      alt:
    ---
