const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const { requireAdmin } = require('../middleware/auth');

router.get('/login', (req, res) => {
  res.render('admin/login', { title: 'Admin Login — AHG', error: null, layout: false });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.render('admin/login', { title: 'Admin Login — AHG', error: 'Invalid credentials.', layout: false });
  }

  req.session.adminId = user.id;
  req.session.adminName = user.name;
  res.redirect('/admin');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

router.get('/', requireAdmin, (req, res) => {
  const stats = {
    members: db.prepare('SELECT COUNT(*) as count FROM members').get().count,
    foundingMembers: db.prepare('SELECT COUNT(*) as count FROM founding_members').get().count,
    contacts: db.prepare('SELECT COUNT(*) as count FROM contacts WHERE read = 0').get().count,
    newsletter: db.prepare('SELECT COUNT(*) as count FROM newsletter_subscribers').get().count,
    volunteers: db.prepare('SELECT COUNT(*) as count FROM volunteers').get().count,
    speakers: db.prepare('SELECT COUNT(*) as count FROM speakers').get().count,
    recentContacts: db.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5').all(),
    recentMembers: db.prepare('SELECT * FROM founding_members ORDER BY created_at DESC LIMIT 5').all()
  };
  res.render('admin/dashboard', { title: 'Dashboard — AHG Admin', stats, adminName: req.session.adminName, layout: false });
});

router.get('/members', requireAdmin, (req, res) => {
  const members = db.prepare('SELECT * FROM members ORDER BY created_at DESC').all();
  res.render('admin/members', { title: 'Members — AHG Admin', members, adminName: req.session.adminName, layout: false });
});

router.get('/founding-members', requireAdmin, (req, res) => {
  const members = db.prepare('SELECT * FROM founding_members ORDER BY created_at DESC').all();
  res.render('admin/founding-members', { title: 'Founding Members — AHG Admin', members, adminName: req.session.adminName, layout: false });
});

router.get('/contacts', requireAdmin, (req, res) => {
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  res.render('admin/contacts', { title: 'Contacts — AHG Admin', contacts, adminName: req.session.adminName, layout: false });
});

router.post('/contacts/:id/read', requireAdmin, (req, res) => {
  db.prepare('UPDATE contacts SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.get('/newsletter', requireAdmin, (req, res) => {
  const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC').all();
  res.render('admin/newsletter', { title: 'Newsletter — AHG Admin', subscribers, adminName: req.session.adminName, layout: false });
});

router.get('/volunteers', requireAdmin, (req, res) => {
  const volunteers = db.prepare('SELECT * FROM volunteers ORDER BY created_at DESC').all();
  res.render('admin/volunteers', { title: 'Volunteers — AHG Admin', volunteers, adminName: req.session.adminName, layout: false });
});

router.get('/speakers', requireAdmin, (req, res) => {
  const speakers = db.prepare('SELECT * FROM speakers ORDER BY created_at DESC').all();
  res.render('admin/speakers', { title: 'Speakers — AHG Admin', speakers, adminName: req.session.adminName, layout: false });
});

router.delete('/members/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM members WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.delete('/contacts/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.delete('/newsletter/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM newsletter_subscribers WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.delete('/volunteers/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM volunteers WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
