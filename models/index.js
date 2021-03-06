// import all models
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Rating = require('./Rating');
const Comment = require('./Comment');
const Image = require('./Image');
// Create associations

Product.belongsTo(Category, {
    foreignKey: 'category_id',
});
  
  
Category.hasMany(Product, {
    foreignKey: 'category_id',
});


User.hasMany(Product, {
    foreignKey: 'user_id'
});

Product.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

Rating.belongsTo(User, {
  foreignKey: 'rated_by'
});

Rating.belongsTo(User, {
  foreignKey: 'user_id'
});

User.hasMany(Rating, {
  foreignKey: 'user_id'
})

module.exports = { User, Category, Product, Rating, Comment, Image };
