import mongoose from 'mongoose';

const PasteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled',
  },
  content: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'text',
  },
  expires_at: {
    type: Date,
    default: null,
  },
  remaining_views: {
    type: Number,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Paste || mongoose.model('Paste', PasteSchema);