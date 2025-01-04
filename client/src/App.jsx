import React, { useState } from 'react'
import Header from './components/Header'
// import Graph from './components/GraphCanva'
import Graph from './components/Graph';
import { Toaster } from 'react-hot-toast'

export default function App() {

    return (
        <div className=''>

            <Header />
            <Graph />
            <Toaster position='bottom-center' />
        </div>
    )
}

// db.hotels.find({}, { "name": 1, "cuisine": 1, "borough": 1 }).sort({ "cuisine": 1,     "borough": -1  })

db.hotels.find({}, { "name": 1, "cuisine": 1, "borough": 1 }).sort({ "cuisine": 1,     "borough": -1})

