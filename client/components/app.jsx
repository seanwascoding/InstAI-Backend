import React from 'react'
import { DisplayTime } from './time/time.js'
import { Increase } from './state/button_add.js'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([{
    path: '/',
    element: <Increase />
}])

const App = () => {
    return (
        <div>
            <h1>title</h1>
            <Increase />
            <DisplayTime style={{ 'font': 24 }} />
        </div>
    )
}

export { App }