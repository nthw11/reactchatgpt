const cors = require('cors')
const express = require('express')
require('dotenv').config()

const app = express()
const PORT = 8000

const API_KEY = process.env.API_KEY

app.use(express.json())
app.use(cors())

app.post('/completions', async (req, res) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: req.body.message }],
      max_tokens: 100,
    }),
  }
  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      options
    )
    const data = await response.json()
    res.send(data)
  } catch (err) {
    console.error(err)
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
