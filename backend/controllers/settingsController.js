const SettingsModel = require('../models/settingsModel');

const settingsController = {
    // GET /api/settings/hero-slides — Public
    async getHeroSlides(req, res, next) {
        try {
            const setting = await SettingsModel.get('hero_slides');
            res.json(setting ? setting.value : []);
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/settings/hero-slides — Admin only
    async updateHeroSlides(req, res, next) {
        try {
            const { slides } = req.body;
            if (!Array.isArray(slides)) {
                res.status(400);
                throw new Error('slides must be an array');
            }

            const setting = await SettingsModel.set('hero_slides', slides);
            res.json({ message: 'Hero slides updated', data: setting.value });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = settingsController;
