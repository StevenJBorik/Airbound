import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.css'
import { Nav, Navbar, Button } from 'react-bootstrap';
import '../../styles/styles.css'


function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navbar className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-xl">
          <Link href="/">
            <a className="navbar-brand">Airbound</a>
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07XL" aria-controls="navbarsExample07XL" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExample07XL">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link href="/">
                  <a className="nav-link">Home <span className="sr-only"></span></a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/">
                  <a className="nav-link">Sell Airbit</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/">
                  <a className="nav-link">My Airbits</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/">
                  <a className="nav-link">Airbiter Dashboard</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Navbar>
      <Component {...pageProps} />
    </div>
  ) 
}

export default MyApp
