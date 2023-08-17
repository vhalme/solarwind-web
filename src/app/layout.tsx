import './globals.css'
import { Helmet } from 'react-helmet'
import App from './App'
import Provider from '../state/Provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2DX6E4HH0N"></script>
        <script async src="/gtm.js"></script>
      </head>
      <body>
        <Provider>
          <App>{children}</App>
        </Provider>
      </body>
    </html>
  )
}
