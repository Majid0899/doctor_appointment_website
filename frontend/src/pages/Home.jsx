import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import Banner from '../components/Banner'
import TopDoctors from '../components/TopDoctors'
const Home = () => {
  return (
    <>
    <Header />
    <SpecialityMenu />
    <TopDoctors/>
        <Banner />
    </>
  )
}

export default Home