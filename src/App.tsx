import { useCallback, useEffect, useState } from 'react'
import { Article } from './types/article';
import Card from './components/card';
import { debounce } from 'lodash';
import transformData from './utils/articlesearch';
import Search from './components/search';

const BASE_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

function App() {
  const [data, setData] = useState<Article[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData(params: string = "") {
      try {
        setLoading(true);
        const queryParams = `?q=${params}&api-key=${import.meta.env.VITE_API_KEY}`;
        const rawData = await fetch(BASE_URL + queryParams);
        const result = await rawData.json();
        if (result.fault) {
          throw new Error(result.fault.faultstring)
        }
        const parsedData = transformData(result);
        setData(parsedData);
        setLoading(false);
      } catch (error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        setErrorMessage(message)
      }
    }
    fetchData(query)
  }, [query])
  // Debounce function to prevent overcalling
  const handleChangeQuery = useCallback(debounce((e) => {
    setQuery(e.target.value)
  }, 400), [])

  return (
    <div className='w-96 m-auto flex flex-col gap-2'>
      <Search onChange={handleChangeQuery} />
      <div className='flex flex-col gap-2'>
        {loading ? <span className="loading loading-spinner loading-lg m-auto p-4"></span> : data.map(article => (<Card key={article.title} {...article} />))}
      </div>
      {errorMessage && <div className="toast toast-end">
        <div role="alert" className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{errorMessage}</span>
        </div>
      </div>}
    </div>
  )
}

export default App
