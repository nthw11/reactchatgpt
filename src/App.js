import { useState, useEffect } from 'react'

const App = () => {
  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue('')
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue('')
  }

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        { title: currentTitle, role: 'user', content: value },
        { title: currentTitle, role: message.role, content: message.content },
      ])
    }
  }, [message, currentTitle])

  const currentChat = previousChats.filter(
    (chat) => chat.title === currentTitle
  )
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  )

  console.log(currentTitle)
  return (
    <div className='app'>
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className='history'>
          {uniqueTitles?.map((title, index) => (
            <li key={index} onClick={() => handleClick(title)}>
              {title}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by NTHW</p>
        </nav>
      </section>
      <section className='main'>
        {!currentTitle && (
          <h1>
            nath<span className='ai-letters'>A</span>n
            <span className='ai-letters'>I</span>el
          </h1>
        )}

        <ul className='feed'>
          {currentChat?.map((chat, index) => (
            <li key={index} className={chat.role}>
              <p className='role'>{chat.role}</p>
              <p>{chat.content}</p>
            </li>
          ))}
        </ul>
        <div className='bottom-section'>
          <div className='input-container'>
            <input
              type='text'
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div id='submit' onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className='info'>Chat GPT info goes here</p>
        </div>
      </section>
    </div>
  )
}

export default App
