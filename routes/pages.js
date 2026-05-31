const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home', { title: 'Almost Human Group — The Voice of the Next Generation' });
});

router.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About AHG — Almost Human Group' });
});

router.get('/programs', (req, res) => {
  res.render('pages/programs', { title: 'Programs — BRIDGE, SEAT, LAUNCH, FLOOR | AHG' });
});

router.get('/programs/bridge', (req, res) => {
  res.render('pages/programs/bridge', { title: 'BRIDGE Program — Breaking Rules In Decisions that Govern Education | AHG' });
});

router.get('/programs/seat', (req, res) => {
  res.render('pages/programs/seat', { title: 'SEAT Program — Students Earning A Table | AHG' });
});

router.get('/programs/launch', (req, res) => {
  res.render('pages/programs/launch', { title: 'LAUNCH Program — Leading A United Next Generation Change | AHG' });
});

router.get('/programs/floor', (req, res) => {
  res.render('pages/programs/floor', { title: 'FLOOR Fellowship — Future Leaders On Real Reform | AHG' });
});

router.get('/policy', (req, res) => {
  res.render('pages/policy', { title: 'Policy Agenda | Almost Human Group' });
});

router.get('/membership', (req, res) => {
  res.render('pages/membership', { title: 'Join the Movement | Almost Human Group', query: req.query });
});

router.get('/get-involved', (req, res) => {
  res.render('pages/get-involved', { title: 'Get Involved — Volunteer, Partner, Speak | AHG' });
});

router.get('/contact', (req, res) => {
  res.render('pages/contact', { title: 'Contact — Almost Human Group' });
});

router.get('/founding-members', (req, res) => {
  res.render('pages/founding-members', { title: 'Become a Founding Member | Almost Human Group' });
});

router.get('/press', (req, res) => {
  res.render('pages/press', { title: 'Press & Media | Almost Human Group' });
});

router.get('/newsletter', (req, res) => {
  res.render('pages/newsletter', { title: 'Newsletter Signup | Almost Human Group' });
});

router.get('/privacy', (req, res) => {
  res.render('pages/privacy', { title: 'Privacy Policy | Almost Human Group' });
});

module.exports = router;
