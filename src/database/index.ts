import knexfile from '../../knexfile'
const knexStringCase = require('knex-stringcase')
const options = knexStringCase(knexfile.development)

export default require('knex')(options)
