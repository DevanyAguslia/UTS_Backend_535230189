const { User } = require('../../../models');

/**
 * Get a list of users with pagination, search, and sorting
 * @param {number} pageNumber - Page number
 * @param {number} pageSize - Number of users per page
 * @param {string} searchQuery - Search query
 * @param {string} sortField - Field to sort by
 * @param {string} sortOrder - Sort order (asc or desc)
 * @returns {Promise<Array>} - Array of users
 */
async function getUsers(pageNumber, pageSize, search, sortField, sortOrder) {
  const skip = (pageNumber - 1) * pageSize;

  let sort = {};
  if(sortField && sortOrder) {
    if (sortOrder == 'asc'){
      sort[sortField] = 1
    } else {
      sort[sortField] = -1
    }
  } else {
    sort = {'email':asc};
  }

  // Fetch users from database with pagination, search, and sort
  const users = await User.find(search).sort(sort).skip(skip).limit(pageSize);
  const totalUsers = await User.countDocuments(search)

  return {users, totalUsers};
}

/**
 * Get user detail by ID
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} - User detail object or null if not found
 */
async function getUser(id) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error('Error while fetching user by ID:', error);
    throw error;
  }
}

/**
 * Create a new user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - Hashed password
 * @returns {Promise<Object>} - Newly created user object
 */
async function createUser(name, email, password) {
  try {
    const newUser = await User.create({
      name,
      email,
      password,
    });
    return newUser;
  } catch (error) {
    console.error('Error while creating new user:', error);
    throw error;
  }
}

/**
 * Count total number of users based on search criteria
 * @param {string} searchField - Field to search by
 * @param {string} searchValue - Value to search for
 * @returns {Promise<number>} - Total number of users
 */
async function countUsers(searchField, searchValue) {
  const query = searchValue
    ? { [searchField]: { $regex: searchValue, $options: 'i' } }
    : {};

  try {
    const count = await User.countDocuments(query);
    return count;
  } catch (error) {
    console.error('Error while counting users:', error);
    throw error;
  }
}

/**
 * Update an existing user
 * @param {string} id - User ID
 * @param {string} name - Updated user name
 * @param {string} email - Updated user email
 * @returns {Promise<Object|null>} - Updated user object or null if not found
 */
async function updateUser(id, name, email) {
  try {
    const updatedUser = await User.updateOne(
      { _id: id },
      { $set: { name, email } }
    );
    return updatedUser;
  } catch (error) {
    console.error('Error while updating user:', error);
    throw error;
  }
}

/**
 * Delete a user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} - Deletion result object or null if user not found
 */
async function deleteUser(id) {
  try {
    const result = await User.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.error('Error while deleting user:', error);
    throw error;
  }
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} - User object or null if not found
 */
async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error while fetching user by email:', error);
    throw error;
  }
}

/**
 * Change user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise<Object|null>} - Updated user object or null if user not found
 */
async function changePassword(id, password) {
  try {
    const updatedUser = await User.updateOne(
      { _id: id },
      { $set: { password } }
    );
    return updatedUser;
  } catch (error) {
    console.error('Error while changing user password:', error);
    throw error;
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  countUsers,
};
