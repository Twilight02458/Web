const VisitorCard = require('../models/VisitorCard');

// Register a new visitor card
exports.registerVisitorCard = async (req, res) => {
    try {
        const { user_id, full_name, id_number, relationship } = req.body;
        
        const visitorCard = await VisitorCard.create({
            user_id,
            full_name,
            id_number,
            relationship
        });

        res.status(201).json({
            success: true,
            data: visitorCard
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all visitor cards for a user
exports.getUserVisitorCards = async (req, res) => {
    try {
        const { user_id } = req.params;
        
        const visitorCards = await VisitorCard.findAll({
            where: { user_id }
        });

        res.status(200).json({
            success: true,
            data: visitorCards
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}; 