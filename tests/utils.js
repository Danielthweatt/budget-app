module.exports.testAccount = {
    username: 'Test Account', 
    email: 'test@example.com', 
    password: 'Testing1!'
};

module.exports.testAccount2 = {
    username: 'Test Account 2', 
    email: 'test2@example.com', 
    password: 'Testing2!'
};

module.exports.testPurchaseCategory = {
    name: 'Rent',
    amount: 800
};

module.exports.testBudget = {
    name: 'Test Budget', 
    amount: 5000,
    purchaseCategories: [ module.exports.testPurchaseCategory ]
};