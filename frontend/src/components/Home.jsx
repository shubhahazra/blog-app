import Creator from "../home/Creator.jsx"
import Devotional from "../home/Devotional.jsx"
import Hero from "../home/Hero.jsx"
import Trending from "../home/Trending.jsx"

const Home = () => {
  return (
    <>
    <div>
      <Hero />
      <Trending />
      <Devotional />
      <Creator />
    </div>
    </>
  )
}

export default Home