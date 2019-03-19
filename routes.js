const express = require('express');

// We are calling Express method called Router and save it in variable `routes`
const routes = express.Router();

// Hubs provide methods for server to retrieve data from DB
const Hubs = require('./hubs/hubs-model.js');


// A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body),
// or an empty object ({}) if there was no body to parse, the Content-Type was not matched, or an error occurred.

// Without this, the req.body would not WORK!
routes.use(express.json());



routes.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

routes.get('/api/hubs', async (req, res) => {
  try {
    const hubs = await Hubs.find(req.query);
    res.status(200).json(hubs);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the hubs',
    });
  }
});

// Refactored ASYNC AWAIT code from above
// routes.get('/api/hubs', (req, res) => {
//   Hubs.find(req.query)
//     .then(hubs => {
//       res.status(200).json(hubs)
//     })  
//     .catch(error =>  {
//       res.status(500).json({
//       message: 'Error retrieving the hubs',
//       })
//     });
//   }
// );

routes.get('/api/hubs/:id', async (req, res) => {
  try {
    const hub = await Hubs.findById(req.params.id);

    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: 'Hub not found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the hub',
    });
  }
});

routes.post('/api/hubs', async (req, res) => {
  try {
    const hub = await Hubs.add(req.body);
    res.status(201).json(hub);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error adding the hub',
    });
  }
});

routes.delete('/api/hubs/:id', async (req, res) => {
  try {
    const count = await Hubs.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: 'The hub has been nuked' });
    } else {
      res.status(404).json({ message: 'The hub could not be found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the hub',
    });
  }
});

routes.put('/api/hubs/:id', async (req, res) => {
  try {
    const hub = await Hubs.update(req.params.id, req.body);
    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: 'The hub could not be found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error updating the hub',
    });
  }
});

routes.get('/api/hubs/:id/messages', async (req, res) => {
  const { id } = req.params;
  try {
    const hub = await Hubs.findHubMessages(id);
    if (hub.length > 0) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: 'Hub with this ID does not exist' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving the hub',
    });
  }
});


// post a new message to a hub
routes.post('/api/hubs/:id/messages', async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Hubs.addMessage({
      hub_id: id,
      sender: req.body.sender,
      text: req.body.text
    });
    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({
      message: 'Error posting the message',
    });
  }
});

module.exports = routes;