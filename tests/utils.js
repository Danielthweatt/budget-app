exports.testPurchaseCategory = {
    name: 'Rent',
    amount: 800
};

exports.testBudget = {
    name: 'Test Budget', 
    amount: 5000,
    purchaseCategories: [ exports.testPurchaseCategory ]
};

exports.testAccount = {
    username: 'Test Account', 
    email: 'test@example.com', 
    password: 'Testing1!',
    budgets: [ exports.testBudget ]
};

exports.testAccount2 = {
    username: 'Test Account 2', 
    email: 'test2@example.com', 
    password: 'Testing2!',
    budgets: [ exports.testBudget ]
};