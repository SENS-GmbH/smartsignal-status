/**
 * Constructs a filter object for searching data by name, using pagination parameters.
 * @param {string} input - The search term to match in the "name" column.
 * @param {number} page - The current page number.
 * @param {number} pageSize - The maximum number of items per page.
 * @returns {Object} - A filter object with pagination and search criteria.
 * @property {number} page - The current page number.
 * @property {number} pageSize - The maximum number of items per page.
 * @property {Object} filter - An object containing the search criteria.
 * @property {Object} filter.condition - The logical operator to use for filtering ("or" in this case).
 * @property {Array<Object>} filter.condition.column - An array containing the search criteria for each column.
 * @property {string} filter.condition.column.@datatype - The data type of the column ("string" in this case).
 * @property {string} filter.condition.column.@name - The name of the column to search ("name" in this case).
 * @property {string} filter.condition.column.@operator - The operator to use for searching ("like" in this case).
 * @property {boolean} filter.condition.column.@relative - Whether the search value is relative to the current date/time (false in this case).
 * @property {string} filter.condition.column.@value - The search term to match in the "name" column (prepended and appended with '%').
 * @property {Array<Object>} filter.column - An array containing the columns to retrieve (empty in this case).
 */
const filter = (input, page, pageSize) => {
	return {
		page: page,
		pageSize: pageSize,
		filter: {
			condition: {
				'@operator': 'or',
				column: [
					{
						'@datatype': 'string',
						'@name': 'name',
						'@operator': 'ilike',
						'@relative': 'False',
						'@value': `%${input}%`,
					},
					{
						'@datatype': 'string',
						'@name': 'configuration',
						'@operator': 'like',
						'@value': `%address": "${input}%`,
					},
					{
						'@datatype': 'string',
						'@name': 'configuration',
						'@operator': 'like',
						'@value': `%zip": "${input}%`,
					},
					{
						'@datatype': 'string',
						'@name': 'configuration',
						'@operator': 'like',
						'@value': `%city": "${input}%`,
					},
					{
						'@datatype': 'string',
						'@name': 'configuration',
						'@operator': 'like',
						'@value': `%market_id": "${input}%`,
					},
				],
			},
			column: [],
		},
	}
}
export default filter
