const { pool } = require('../config/postgres');
const aiService = require('../services/aiService');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incidents ORDER BY created_at DESC');
    res.status(200).json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Requirement: Reject CLOSED status if RCA is missing
    if (status === 'CLOSED') {
      const checkRca = await pool.query('SELECT rca_category FROM incidents WHERE id = $1', [id]);
      if (!checkRca.rows[0]?.rca_category) {
        return res.status(400).json({ error: "Mandatory RCA: System rejects CLOSED state if RCA is missing." });
      }

      // Requirement: Automatic MTTR calculation upon closing
      const incident = await pool.query('SELECT created_at FROM incidents WHERE id = $1', [id]);
      const startTime = new Date(incident.rows[0].created_at);
      const endTime = new Date();
      const mttrMinutes = Math.floor((endTime - startTime) / 1000 / 60);

      const result = await pool.query(
        'UPDATE incidents SET status = $1, end_time = $2, mttr = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
        [status, endTime, mttrMinutes, id]
      );
      return res.json(result.rows[0]);
    }

    const result = await pool.query(
      'UPDATE incidents SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.submitRca = async (req, res) => {
  const { id } = req.params;
  const { root_cause, fix, prevention, category } = req.body;

  try {
    // Requirement: Mandatory RCA object components
    if (!root_cause || !fix || !category) {
      return res.status(400).json({ error: "RCA object is incomplete. Category, Root Cause, and Fix are required." });
    }

    const detailedDescription = `ROOT CAUSE: ${root_cause} | FIX: ${fix} | PREVENTION: ${prevention}`;
    
    const result = await pool.query(
      'UPDATE incidents SET rca_category = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [category, detailedDescription, id]
    );
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Incident not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.analyze = async (req, res) => {
  const { id } = req.params;
  try {
    const incident = await pool.query('SELECT * FROM incidents WHERE id = $1', [id]);
    if (incident.rows.length === 0) return res.status(404).json({ error: 'Incident not found' });

    const analysis = await aiService.analyzeIncident(incident.rows[0].title, incident.rows[0].description);
    
    const detailedDescription = `${incident.rows[0].description}\n\nAI ANALYSIS:\nROOT CAUSE: ${analysis.root_cause}\nFIX: ${analysis.suggested_fix}`;
    
    // AI integration satisfies the Root Cause Analysis (RCA) mandatory requirement
    const result = await pool.query(
      'UPDATE incidents SET description = $1, status = $2, rca_category = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [detailedDescription, 'RESOLVED', 'AI_GENERATED', id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};