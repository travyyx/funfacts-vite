const fs = require('node:fs/promises');
var cors = require('cors')
import path from 'path';

async function getCounter() {
  try {
    let filepath = path.join(process.cwd(), 'public/counter.txt');
    const data = await fs.readFile(filepath, { encoding: 'utf8' });
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
      let filepath = path.join(process.cwd(), 'public/counter.txt');
      fs.writeFile(filepath, content.toString())
    }
  )


}