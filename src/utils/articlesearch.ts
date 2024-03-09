import { Article } from "../types/article";

interface ApiResult {
  response: {
    docs: [{
      headline: {
        main: string
      },
      snippet: string,
      pub_date: string,
      byline: {
        original: string
      },
      web_url: string
    }]
  }
}

export default function transformData(result: ApiResult): Article[] {
  return result.response.docs.map((data) => ({
    title: data.headline.main,
    content: data.snippet,
    articleDate: data.pub_date,
    byLine: data.byline.original,
    articleUrl: data.web_url
  }))
}