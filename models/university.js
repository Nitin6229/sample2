const mongoose = require('mongoose');
/**
 * @file models/university.js File of University schema
 */

/**
 * @namespace UniversitySchema
 * @property {ObjectId} _id - Object Id, internally generated by MongoDB
 * @property {string} name - Display name for university
 * @property {string} slug - A compressed version of name, in development
 * @property {string} description - Description for the university
 * @property {string} address - Address of the university
 * @property {Array<Object>} contacts - Array of contacts for the university.Each member is : {type - A string denoting type of contact eg : website, phone no. etc. , value : actual contact}
 * @property {Number} avg_gre - average GRE score required for the acceptance, default value is NAN
 * @property {Number} avg_lang - average score on language test (TOFEL/ILETS) required for the acceptance, default value is NAN
 * @property {Number} fees - Fees of the university, default value is NAN
 */
const UniSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please provide a display name for university'],
  },
  slug: {
    //* Alternate Versions for the name
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for the university'],
  },
  address: {
    type: String,
    required: [true, 'Please provide an address for the university'],
  },
  contacts: [
    {
      type: {
        type: String,
        required: [true, 'Please provide the type of contact'],
      },
      value: {
        type: String,
        required: [true, 'Please provide the actual contact'],
      },
    },
  ],
  avg_gre: {
    type: Number,
  },
  avg_lang: {
    type: Number,
  },
  fees: {
    type: Number,
  },
});

const generateSlug = (name) => name.replace(/\s+/g, '-').toLowerCase();

/**
 * @memberof UniversitySchema
 * @function pre-save-hook
 * @description Converts the university name into slug before saving.Uses mongoose schema hooks.
 */
UniSchema.pre('save', function addSlug(next) {
  const slug = generateSlug(this.name);
  this.slug = slug;
  next();
});

/**
 * @memberof UniversitySchema
 * @function pre-update-hook
 * @description Converts the university name into slug before save in findOneAndUpadte.Uses mongoose schema hooks.
 */
UniSchema.pre('findOneAndUpdate', async function addSlug(next) {
  const name = this.get('name');
  if (!name) {
    next();
  }
  const slug = generateSlug(name);
  this.set({ slug });
  next();
});

module.exports = mongoose.model('University', UniSchema);
