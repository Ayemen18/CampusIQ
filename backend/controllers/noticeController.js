const Notice = require('../models/Notice');

exports.getAllNotices = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = { isActive: true };
    if (category && category !== 'All') {
      filter.category = category;
    }

    const notices = await Notice.find(filter).sort({ publishedDate: -1 });
    res.json({ success: true, count: notices.length, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const { title, category, content, priority, targetAudience } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const notice = await Notice.create({
      title,
      category: category || 'Academic',
      content,
      priority: priority || 'Important',
      targetAudience: targetAudience || 'All Students',
      author: req.user ? req.user.name : 'Dean Office'
    });

    res.status(201).json({ success: true, message: 'Notice published successfully', notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
