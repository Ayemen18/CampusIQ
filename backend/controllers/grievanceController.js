const Grievance = require('../models/Grievance');

exports.submitGrievance = async (req, res) => {
  try {
    const { category, subject, description, priority } = req.body;
    if (!category || !subject || !description) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    const count = await Grievance.countDocuments();
    const grievanceId = `GRV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const grievance = await Grievance.create({
      grievanceId,
      student: req.user._id,
      studentName: req.user.name,
      rollNumber: req.user.rollNumber || '23R21A6754',
      department: req.user.department || 'CSE - Data Science',
      category,
      subject,
      description,
      priority: priority || 'Medium',
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully. It has been routed to the Grievance Redressal Committee.',
      grievance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.user._id }).sort({ submittedAt: -1 });
    res.json({ success: true, count: grievances.length, grievances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllGrievances = async (req, res) => {
  try {
    const { status, category } = req.query;
    let filter = {};
    if (status && status !== 'All') filter.status = status;
    if (category && category !== 'All') filter.category = category;

    const grievances = await Grievance.find(filter).sort({ submittedAt: -1 });
    res.json({ success: true, count: grievances.length, grievances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { status, adminRemarks, priority, assignedTo } = req.body;
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    if (status) grievance.status = status;
    if (adminRemarks !== undefined) grievance.adminRemarks = adminRemarks;
    if (priority) grievance.priority = priority;
    if (assignedTo) grievance.assignedTo = assignedTo;
    grievance.updatedAt = Date.now();

    await grievance.save();
    res.json({
      success: true,
      message: 'Grievance updated successfully',
      grievance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
