class Query {

	/**
	* Check resource match query data
	*
	* @param array
	* @param Resource
	* @return bool
	*/
	checkResource(query, resource) {

		// If operation was not set
		if (query.length === 2) {

			// Set default operator as =
			query = [
				query[0],
				'=',
				query[1]
			];

		}

		let field = query[0]
		let operator = query[1];
		let value = query[2];

    // If invalid operator
    if (['=', '>', '<', '>=', '<=', 'IN'].indexOf(query[1]) === -1) {
      return false;
    }

    // Query field is attribute
    if (['id', 'type'].indexOf(query[0]) === -1) {
    	return this.compare(operator, resource.attributes[field], value);
    } else { // Query field is id or type
      return this.compare(operator, resource[field], value);
    }

	}

	/**
	* Operator check
	*
	* @param string operator
	* @param mixed Value 1
	* @param mixed Value 2
	* @param integer (Optional) Precision for float number comparing - Default 2
	*/
	compare(operator, value1, value2, precision) {

		// Preparation for '=' operator
		if (operator !== '=' && !precision) {

			precision = 2;
			let multiplier = 1;

			for (let i = 1; i <= precision; i++) {
				multiplier *= 10;
			}

			value1 = parseInt(parseFloat(value1) * multiplier);
			value2 = parseInt(parseFloat(value2) * multiplier);

		}

		// Preparation for 'IN' operator
		if (operator === 'IN') {

			// If query value is not array
			if (!Array.isArray(value2)) {
				console.log('Query value for "IN" operator must be an array');
				return false;
			}

			// Force convert all element to string
			value2 = value2.map(element => {
				return JSON.stringify(element);
			});
			
		} 

		switch (operator) {

			case '=':
			return JSON.stringify(value1) === JSON.stringify(value2); // Force convert both to string and compare
			break;

			case '>':
			return value1 > value2;
			break;

			case '<':
			return value1 < value2;
			break;

			case '>=':
			return value1 >= value2;
			break;

			case '<=':
			return value1 <= value2;
			break;

			case 'IN':
			return value2.indexOf(JSON.stringify(value1)) > -1;
			break;

		}

		return false;

	}

}

export default new Query();