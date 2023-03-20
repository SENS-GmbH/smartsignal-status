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
				],
			},
			column: [],
		},
	}
}
export default filter
