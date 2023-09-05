import React, { useState, useEffect } from 'react'

const DisplayTime = (props) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const uptetime = () => {
      setCount({
        time: new Date().toLocaleTimeString(),
        state: "normal"
      })
    }
    const socket = new WebSocket('ws://localhost:8080')
    socket.onopen = (message) => {
      console.log('websocket onopen', message)
      socket.send('hi')
    }
    const timer = setInterval(uptetime, 1000)

    return () => {
      clearInterval(timer)
      socket.close()
    }
  }, [])

  const listen = (num) => {
    console.log("work")
    setCount(prevState => ({
      ...prevState,
      state: `working to select:${num}`
    }))
  }

  return (
    <div>
      <p>台北時間</p>
      <span style={props.style}>現在時間：{count.time}</span>
      <hr />
      <p>狀態:{count.state}</p>
      <hr />
      <button onClick={() => listen(0)}>listen button</button>
    </div>
  )
}

export { DisplayTime }