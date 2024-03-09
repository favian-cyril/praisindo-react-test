import App from "./App"
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import {render, screen, waitFor} from '@testing-library/react'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ response: {
      docs: [
        {
          headline: {
            main: 'Foo'
          },
          snippet: 'Bar',
          pub_date: '01-01-2024T00:00:00Z',
          byline: {
            original: 'By FooBar'
          },
          web_url: 'https://google.com'
        },
        {
          headline: {
            main: 'Foo 2'
          },
          snippet: 'Bar 2',
          pub_date: '01-01-2024T00:00:00Z',
          byline: {
            original: 'By FooBar'
          },
          web_url: 'https://google.com'
        },
        {
          headline: {
            main: 'Foo 3'
          },
          snippet: 'Bar 3',
          pub_date: '01-01-2024T00:00:00Z',
          byline: {
            original: 'By FooBar'
          },
          web_url: 'https://google.com'
        },
      ]
    } }),
  })
) as jest.Mock;

describe('App.tsx', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should render articles on first load', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Foo')).toBeInTheDocument()
      expect(screen.getByText('Foo 2')).toBeInTheDocument()
      expect(screen.getByText('Foo 3')).toBeInTheDocument()    
    })
  })
  it('should fetch new data when search input is entered, it should only call once if below debounce threshold', async () => {
    const user = userEvent.setup({
      delay: 200
    })
    render(<App />);
    const fetchMock = jest.spyOn(global, "fetch").mockImplementation( 
      jest.fn(
        () => Promise.resolve({ json: () => Promise.resolve({ response: {
          docs: [
            {
              headline: {
                main: 'Baz'
              },
              snippet: 'Bar',
              pub_date: '01-01-2024T00:00:00Z',
              byline: {
                original: 'By FooBar'
              },
              web_url: 'https://google.com'
            },
          ]
        } }), 
      }), 
    ) as jest.Mock );
    const searchBar = screen.getByPlaceholderText('Search');
    await user.click(searchBar);
    await user.keyboard('Bar');
    await waitFor(() => {
      expect(screen.getByText('Baz')).toBeInTheDocument()
    })
    expect(fetchMock).toHaveBeenCalledTimes(2);
  })
  it('should fetch new data when search input is entered, should call per character if delay above threshold', async () => {
    const user = userEvent.setup({
      delay: 500
    })
    render(<App />);
    const fetchMock = jest.spyOn(global, "fetch").mockImplementation( 
      jest.fn(
        () => Promise.resolve({ json: () => Promise.resolve({ response: {
          docs: [
            {
              headline: {
                main: 'Baz'
              },
              snippet: 'Bar',
              pub_date: '01-01-2024T00:00:00Z',
              byline: {
                original: 'By FooBar'
              },
              web_url: 'https://google.com'
            },
          ]
        } }), 
      }), 
    ) as jest.Mock );
    const searchBar = screen.getByPlaceholderText('Search');
    await user.click(searchBar);
    await user.keyboard('Ba');
    await waitFor(() => {
      expect(screen.getByText('Baz')).toBeInTheDocument()
    })
    expect(fetchMock).toHaveBeenCalledTimes(3);
  })
})