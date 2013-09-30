var neue = require('../')
var should = require('should')

describe('parse', function(){

    it('should', function(){
        neue.parse('Source Sans Pro').should.eql({
            family: 'Source Sans Pro',
            variations: ['n4']
        })
    })

    it('should', function(){
        neue.parse('Source Sans Pro:n4').should.eql({
            family: 'Source Sans Pro',
            variations: ['n4']
        })
    })

    it('should', function(){
        neue.parse('Source Sans Pro:n4,n6').should.eql({
            family: 'Source Sans Pro',
            variations: ['n4', 'n6']
        })
    })

    it('should', function(){
        neue.parse('    Source Sans Pro : n4  ,jk, n6,,,,,').should.eql({
            family: 'Source Sans Pro',
            variations: ['n4', 'n6']
        })
    })

})
