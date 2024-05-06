const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users with pagination, search, and sorting
 * @param {number} pageNumber - Page number
 * @param {number} pageSize - Number of users per page
 * @param {string} searchField - Field to search (email or name)
 * @param {string} sortOrder - Sort order (asc or desc)
 * @param {string} searchKey - Keyword to search
 * @returns {Object} - Object containing paginated user data
 */
async function getUsers(pageNumber, pageSize, searchQuery, sortField, sortOrder) {
  try {
    // Get users based on pagination, search, and sorting criteria
    const users = await usersRepository.getUsers(pageNumber, pageSize, searchQuery === 'email' || searchQuery === 'name' ? searchQuery : '', sortField,sortOrder);

    // Get total count of users for pagination
    //const totalUsers = await usersRepository.countUsers(searchKey, '');

    // Calculate total pages based on pageSize and totalUsers
    let totalPages = 1;
    if (totalUsers > 0) {
      totalPages = Math.ceil(totalUsers / pageSize);
    }

    // Construct result object with paginated user data
    const result = {
      page_number: pageNumber,
      page_size: pageSize,
      count: totalUsers,
      total_pages: totalPages,
      has_previous_page: pageNumber > 1,
      has_next_page: pageNumber < totalPages,
      data: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    };

    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Get user detail by ID
 * @param {string} id - User ID
 * @returns {Object} - User detail object
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // If user not found, return null
  if (!user) {
    return null;
  }

  // Return user detail object
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create a new user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {boolean} - Indicates whether user creation was successful
 */
async function createUser(name, email, password) {
  // Hash user password
  const hashedPassword = await hashPassword(password);

  try {
    // Create user in repository
    await usersRepository.createUser(name, email, hashedPassword);
    return true; // Return true if creation was successful
  } catch (err) {
    return false; // Return false if creation failed
  }
}

/**
 * Update an existing user
 * @param {string} id - User ID
 * @param {string} name - Updated user name
 * @param {string} email - Updated user email
 * @returns {boolean} - Indicates whether user update was successful
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // If user not found, return null
  if (!user) {
    return null;
  }

  try {
    // Update user in repository
    await usersRepository.updateUser(id, name, email);
    return true; // Return true if update was successful
  } catch (err) {
    return false; // Return false if update failed
  }
}

/**
 * Delete a user by ID
 * @param {string} id - User ID
 * @returns {boolean} - Indicates whether user deletion was successful
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // If user not found, return null
  if (!user) {
    return null;
  }

  try {
    // Delete user from repository
    await usersRepository.deleteUser(id);
    return true; // Return true if deletion was successful
  } catch (err) {
    return false; // Return false if deletion failed
  }
}

/**
 * Check if an email is already registered
 * @param {string} email - Email to check
 * @returns {boolean} - Indicates whether email is already registered
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  // Return true if user with given email exists, else return false
  return !!user;
}

/**
 * Check if provided password matches the user's password
 * @param {string} userId - User ID
 * @param {string} password - Password to check
 * @returns {boolean} - Indicates whether password matches user's password
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Return true if user exists and provided password matches user's password, else return false
  return user && passwordMatched(password, user.password);
}

/**
 * Change user's password
 * @param {string} userId - User ID
 * @param {string} password - New password
 * @returns {boolean} - Indicates whether password change was successful
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // If user not found, return false
  if (!user) {
    return false;
  }

  // Hash new password
  const hashedPassword = await hashPassword(password);

  try {
    // Update user's password in repository
    await usersRepository.changePassword(userId, hashedPassword);
    return true; // Return true if password change was successful
  } catch (error) {
    return false; // Return false if password change failed
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
