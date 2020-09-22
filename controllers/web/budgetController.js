const debug = require('debug')('app:webBudgetController');

module.exports = {
    getManageBudget(req, res, next) {
        debug('getManageBudget()');
        debug('Getting budget from user\'s session...');

        const sessionBudget = req.session.user.budgets.find(({ _id }) => _id === req.params._id);

        if (!sessionBudget) {
            debug('Budget not found...');

            return next();
        }

        debug('Rendering manage budget view...');

        res.render('manage-budget', { 
            title: 'Manage Budget',
            user: req.session.user,
            budget: sessionBudget
        });
    }
};