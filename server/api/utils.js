const fs = require("fs").promises;

/**
 * Increments the specified counter in the counter.json file.
 * @param {string} which - The counter to increment ('add' or 'update').
 * @returns {Promise<void>} - A Promise indicating the completion of the operation.
 */
const incrementCounter = async (which) => {
  try {
    // Read file
    const data = await fs.readFile("counter.json");
    // Parse JSON data
    const counter = JSON.parse(data);
    // Increment counter
    counter[which]++;
    // Write updated counter to file
    await fs.writeFile("counter.json", JSON.stringify(counter));
  } catch (err) {
    console.error("Error incrementing counter:", err);
  }
};

/**
 * Retrieves the counter data from the counter.json file.
 * @returns {Promise<Object>} - A Promise resolving to the counter object.
 */
const getCounter = async () => {
  try {
    // Read file
    const data = await fs.readFile("counter.json");
    // Parse JSON data
    const counter = JSON.parse(data);
    return counter;
  } catch (err) {
    console.error("Error reading counter:", err);
    return { message: "Error reading counter" };
  }
};

module.exports = { incrementCounter, getCounter };
