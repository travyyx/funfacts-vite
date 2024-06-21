const fs = require('node:fs/promises');
var cors = require('cors')

async function getCounter() {
  try {
    const data = await fs.readFile('public/counter.txt', { encoding: 'utf8' });
    return data
  } catch (err) {
    return err
  }
}

const express = require('express')
const app = express()
const port = 3000

app.use(cors())
app.use(express.static('public'))

app.get('/counter', (req, res) => {
  getCounter().then(
    (data) => res.send(data)
  )

})

app.listen(port, () => {
  console.log(`Fun Facts backend running.`)
})

app.get('/increase', (req, res) => {
  increaseCounter()
  getCounter().then(
    (data) => res.send(data)
  )
})

app.get('/', (req, res) => {
  res.send("Running.")
})

function increaseCounter() {
  getCounter().then(
    (data) => {
      content = parseInt(data) + 1;
      fs.writeFile('counter.txt', content.toString())
    }
  )


}