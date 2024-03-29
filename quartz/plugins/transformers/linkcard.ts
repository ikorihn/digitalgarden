import { Node, Parent } from "unist"
import { Paragraph, Text, Link } from "mdast"
import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import ogs from "open-graph-scraper"
import path from "path"
import { writeFile, access, mkdir } from "fs"
import fetch from "node-fetch"
import sanitize from "sanitize-filename"
import he from "he"
import { VFile } from "vfile"

export interface Options {
  cache: boolean
  shortenUrl: boolean
}

const defaultOptions: Options = {
  cache: false,
  shortenUrl: false,
}

export const LinkCard: QuartzTransformerPlugin<Partial<Options> | undefined> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "LinkCard",
    markdownPlugins() {
      return [linkcard]
    },
  }
}

const defaultSaveDirectory = "public"
const defaultOutputDirectory = "/remark-link-card/"

function linkcard(options: Options) {
  return async (tree: Node, file: VFile) => {
    const transformers: (() => void)[] = []
    visit(tree, "paragraph", (paragraph: Paragraph, index: number, parent: Parent) => {
      for (let i = 0; i < paragraph.children.length - 1; i++) {
        const child = paragraph.children[i]
        if (!isText(child) || !/{{< card-link/.test(child.value)) {
          continue
        }
        const nextSibling = paragraph.children[i + 1]
        if (!isLink(nextSibling)) {
          continue
        }

        transformers.push(async () => {
          // fetch data
          const data = await fetchData(nextSibling.url, options)

          // create linkCardNode
          const linkCardHtml = createLinkCard(data)
          const linkCardNode = {
            type: "html",
            value: linkCardHtml,
          }

          // Replace paragraph node with linkCardNode
          tree.children.splice(index, 1, linkCardNode)
        })
      }
    })

    try {
      await Promise.all(transformers.map((t) => t()))
    } catch (error) {
      console.error(`[remark-link-card] Error: ${error}`)
    }

    return tree
  }
}

function isText(node: Node): node is Text {
  return node.type === "text"
}

function isLink(node: Node): node is Link {
  return node.type === "link"
}

const getOpenGraph = async (targetUrl) => {
  try {
    const { result } = await ogs({ url: targetUrl, timeout: 10000 })
    return result
  } catch (error) {
    console.error(
      `[remark-link-card] Error: Failed to get the Open Graph data of ${error.result.requestUrl} due to ${error.result.error}.`,
    )
    return undefined
  }
}

const fetchData = async (targetUrl: string, options: Options) => {
  // get open graph
  const ogResult = await getOpenGraph(targetUrl)

  // set site name
  const siteName = ogResult?.ogSiteName ?? new URL(targetUrl).host
  // set title
  const parsedUrl = new URL(targetUrl)
  const title = (ogResult && ogResult.ogTitle && he.encode(ogResult.ogTitle)) || parsedUrl.hostname
  // set description
  const description =
    (ogResult && ogResult.ogDescription && he.encode(ogResult.ogDescription)) || ""
  // set favicon src
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}`
  let faviconSrc = ""
  if (options && options.cache) {
    const faviconFilename = await downloadImage(
      faviconUrl,
      path.join(process.cwd(), defaultSaveDirectory, defaultOutputDirectory),
    )
    faviconSrc = faviconFilename && path.join(defaultOutputDirectory, faviconFilename)
  } else {
    faviconSrc = faviconUrl
  }
  // set open graph image src
  let ogImageSrc = ""
  if (ogResult && ogResult.ogImage && ogResult.ogImage.length > 0) {
    const ogImageUrl = ogResult.ogImage[0].url
    if (options && options.cache) {
      const imageFilename = await downloadImage(
        ogImageUrl,
        path.join(process.cwd(), defaultSaveDirectory, defaultOutputDirectory),
      )
      ogImageSrc = imageFilename && path.join(defaultOutputDirectory, imageFilename)
    } else {
      ogImageSrc = ogImageUrl
    }
  }
  // set open graph image alt
  const ogImageAlt =
    // (ogResult && ogResult.ogImage && ogResult.ogImage.alt) || title;
    (ogResult && ogResult.ogImage && ogResult.ogImage.alt && he.encode(ogResult.ogImage.alt)) ||
    title

  // set display url
  let displayUrl = options && options.shortenUrl ? parsedUrl.hostname : targetUrl

  try {
    displayUrl = decodeURI(displayUrl)
  } catch (error) {
    console.error(`[remark-link-card] Error: Cannot decode url: "${url}"\n ${error}`)
  }

  return {
    siteName,
    title,
    description,
    faviconSrc,
    ogImageSrc,
    ogImageAlt,
    displayUrl,
    url: targetUrl,
  }
}

const createLinkCard = (data) => {
  // create favicon element
  const faviconElement = data.faviconSrc
    ? `<img class="rlc-favicon" src="${data.faviconSrc}" alt="${data.title} favicon" width="16" height="16">`.trim()
    : ""

  // create description element
  const descriptionElement = data.description
    ? `<div class="rlc-description">${data.description}</div>`
    : ""

  // create image element
  const imageElement = data.ogImageSrc
    ? `<div class="rlc-image-container">
      <img class="rlc-image" src="${data.ogImageSrc}" alt="${data.ogImageAlt}" />
    </div>`.trim()
    : ""

  // create output HTML
  const outputHTML = `
    <a class="rlc-container" href="${data.url}">
      <div class="rlc-header">
        ${faviconElement}
        <span class="rlc-site-name">${data.siteName}</span>
      </div>
      <div class="rlc-info">
        <div class="rlc-title">${data.title}</div>
        ${descriptionElement}
      </div>
      ${imageElement}
    </a>`.trim()

  return outputHTML
}

const downloadImage = async (url: string, saveDirectory: string) => {
  let targetUrl
  try {
    targetUrl = new URL(url)
  } catch (error) {
    console.error(`[remark-link-card] Error: Failed to parse url "${url}"\n ${error}`)
    return
  }
  const filename = sanitize(decodeURI(targetUrl.href))
  const saveFilePath = path.join(saveDirectory, filename)
  // check file existence(if it is existed, return filename)
  try {
    await access(saveFilePath)
    return filename
  } catch (error) {}
  // check directory existence
  try {
    await access(saveDirectory)
  } catch (error) {
    // create directory if it is not existed
    await mkdir(saveDirectory, { recursive: true })
  }

  // fetch data
  try {
    const response = await fetch(targetUrl.href, {
      header: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
      },
      timeout: 10000,
    })
    const buffer = await response.buffer()
    writeFile(saveFilePath, buffer)
  } catch (error) {
    console.error(
      `[remark-link-card] Error: Failed to download image from ${targetUrl.href}\n ${error}`,
    )
    return undefined
  }

  return filename
}
