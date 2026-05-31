const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.post('/contact', (req, res) => {
  const { name, email, organization, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }
  try {
    db.prepare('INSERT INTO contacts (name, email, organization, subject, message) VALUES (?, ?, ?, ?, ?)')
      .run(name, email, organization || null, subject, message);
    res.json({ success: true, message: 'Message received. We respond within 24 hours.' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/newsletter', (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  try {
    db.prepare('INSERT OR IGNORE INTO newsletter_subscribers (email, name, source) VALUES (?, ?, ?)')
      .run(email, name || null, 'website');
    res.json({ success: true, message: 'You\'re in. The next generation can\'t wait.' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/founding-member/waitlist', (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  try {
    db.prepare('INSERT OR IGNORE INTO founding_members (email, name, type) VALUES (?, ?, ?)')
      .run(email, name, 'waitlist');
    db.prepare('INSERT OR IGNORE INTO newsletter_subscribers (email, name, source) VALUES (?, ?, ?)')
      .run(email, name, 'founding-waitlist');
    res.json({ success: true, message: 'You\'re on the list. We\'ll be in touch before anyone else.' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/volunteer', (req, res) => {
  const { name, email, phone, skills, availability, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  try {
    db.prepare('INSERT INTO volunteers (name, email, phone, skills, availability, message) VALUES (?, ?, ?, ?, ?, ?)')
      .run(name, email, phone || null, skills || null, availability || null, message || null);
    res.json({ success: true, message: 'Application received. We\'ll reach out soon.' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/speaker', (req, res) => {
  const { name, email, organization, topic, bio } = req.body;
  if (!name || !email || !topic) {
    return res.status(400).json({ error: 'Name, email, and topic are required.' });
  }
  try {
    db.prepare('INSERT INTO speakers (name, email, organization, topic, bio) VALUES (?, ?, ?, ?, ?)')
      .run(name, email, organization || null, topic, bio || null);
    res.json({ success: true, message: 'Speaker inquiry received. We\'ll be in touch.' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
