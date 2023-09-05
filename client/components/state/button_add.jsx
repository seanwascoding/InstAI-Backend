import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Increase = () => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        setCount({
            counts: 0,
            gender: "M",
        })
    }, [])

    const incrementCount = () => {
        axios.get('http://localhost:8080/api/test/test')
            .then(response => {
                // 处理成功响应
                console.log(response.data);
            })
            .catch(error => {
                // 处理错误
                console.error(error);
            });
        setCount((prevState) => ({
            ...prevState,
            counts: count.counts + 1
        }))
    }

    const changeGender = (event) => {
        console.log(event.target.value)
        setCount((prevState) => ({
            ...prevState,
            gender: event.target.value
        }))

    }

    return (
        <div>
            {count.gender === "M" ? <Title_gender title="男" /> : null}
            <p>{count.counts}</p>
            <p>{count.gender}</p>
            <button onClick={incrementCount}>add count</button>
            <select onChange={changeGender}>
                <option value="M">male</option>
                <option value="W">female</option>
            </select>
        </div>
    )
}

const Title_gender = (props) => {
    return (
        <h1>{props.title}</h1>
    )
}

export { Increase }