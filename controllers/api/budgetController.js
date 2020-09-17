const Joi = require('@hapi/joi');
const debug = require('debug')('app:budgetController');
const { User, Budget } = require('../../models');

function validateCreateBudgetFormInput(createBudgetFormInput) {
    const createBudgetFormInputSchema = Joi.object({
        name: Joi.string()
                    .min(3)
                    .max(50)
                    .required()
                    .messages({
                        'string.base': 'Name must be text.',
                        'string.empty': 'Must have a name.',
                        'string.min': 'Name must be at least 3 characters long.',
                        'string.max': 'Name must be at most 50 characters long.',
                        'any.required': 'Must have a name.'
                    }),
        monthlyAmount: Joi.number()
                        .positive()
                        .messages({
                            'number.base': 'Monthly Amount must be a number.',
                            'number.infinity': 'Monthly Amount cannot be infinity or negative infinity.',
                            'number.positive': 'Monthly Amount must be positive.'
                        })
    });

    return createBudgetFormInputSchema.validate(createBudgetFormInput, { abortEarly: false });
}

module.exports = {
    async postBudget(req, res) {
        debug('postBudget()');

        const { body } = req;

        debug('Validating create budget form input...');
        
        const { error } = await validateCreateBudgetFormInput(body);

        if (error) {
            debug('Validation errors:');

            error.details.forEach(({ message }) => { 
                debug(` ${message}`); 
            });

            return res.status(400).send({
                error: {
                    details: error.details.map(({ message }) => {
                        return {
                            message
                        };
                    })
                }
            });
        }

        debug('Creating budget...');

        const budget = new Budget(body);

        await budget.save();

        debug('Relating budget to user...');

        const user = await User.findById(req.session.user._id);

        user.budgets.push(budget._id);

        await user.save();

        debug('Saving budget in session...');

        await user.populate('budgets').execPopulate();

        req.session.user = user.getPublicObject();

        res.send(budget.getPublicObject());
    }
};