module.exports.testPurchaseCategory = {
    name: 'Rent',
    amount: 800
};

module.exports.testBudget = {
    name: 'Test Budget', 
    amount: 5000,
    purchaseCategories: [ module.exports.testPurchaseCategory ]
};

module.exports.testAccount = {
    username: 'Test Account', 
    email: 'test@example.com', 
    password: 'Testing1!',
    budgets: [ module.exports.testBudget ]
};

module.exports.testAccount2 = {
    username: 'Test Account 2', 
    email: 'test2@example.com', 
    password: 'Testing2!',
    budgets: [ module.exports.testBudget ]
};