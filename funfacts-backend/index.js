const fs = require('node:fs/promises');

async function getCounter() {
  try {
    const data = await fs.readFile('counter.txt', { encoding: 'utf8' });
    return data
  } catch (err) {
    return err
  }
}

const express = require('express')
const app = express()
const port = 3000

app.get('/counter', (req, res) => {
  getCounter().then(
    (data) => res.send(data)
  )

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/increase', (req, res) => {
  const resp = increaseCounter()

  res.send(resp)
})

app.get('/', (req, res) => {
  res.send("Running.")
})

function increaseCounter() {
  getCounter().then(
    (data) => {
      const content = data + 1;
      fs.writeFile('counter.txt', toString(content), err => {
        if (err) {
          console.error(err);
        } else {
            getCounter().then(
              (data) => {
                return data
              }
            )
        
        }
      });
    }
  )


}