import * as dayjs from 'dayjs'
import { Article } from "../types/article";

export default function Card({ title, content, imageUrl, imageAlt, articleUrl, byLine, articleDate }: Article) {
  return (
    <a href={articleUrl} className="card w-full bg-base-100 shadow-xl">
      {imageUrl && <figure><img src={imageUrl} alt={imageAlt} /></figure>}
      <div className="card-body text-left">
        <h2 className="card-title">{title}</h2>
        <h3 className="text-lg">{byLine}</h3>
        <h4 className="text-sm">{dayjs(articleDate).format('MMM DD, YYYY')}</h4>
        <p>{content}</p>
      </div>
    </a>
  )
}
