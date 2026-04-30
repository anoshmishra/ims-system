const { pool } = require('../config/postgres');

class SignalController {
  async ingest(req, res) {
    try {
      const { component_id, title, description, severity } = req.body;

      if (!component_id) {
        return res.status(400).json({ error: 'component_id is required' });
      }

      const query = `
        INSERT INTO incidents (component_id, title, description, severity, status)
        VALUES ($1, $2, $3, $4, 'OPEN')
        RETURNING *;
      `;

      const values = [
        component_id,
        title || 'Untitled Signal',
        description || '',
        severity || 'HIGH'
      ];

      const result = await pool.query(query, values);

      res.status(202).json({
        message: 'Signal accepted',
        incident_id: result.rows[0].id
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new SignalController();