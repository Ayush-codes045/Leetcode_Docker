import Footer from './Footer'
import Hero from './Hero'
import LatestProblem from './LatestProblem'
import Navbar from './Navbar'

const LandingPage = () => {
  return (
    <div>
        <Navbar />
        <Hero />
        <LatestProblem full='' />
        <Footer />
    </div>
  )
}

export default LandingPage