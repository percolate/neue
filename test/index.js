var neue = require('../')
var should = require('should')

describe('parse', function(){

    it('should parse family', function(){
        neue.parse('Source Sans Pro').should.eql({
            family: 'Source Sans Pro',
            variations: ['n4']
        })
    })

    it('should parse family and single variant', function(){
        neue.parse('Source Sans Pro:n4').should.eql({
            family: 'Source Sans Pro',
            variations: ['n4']
        })
    })

    it('should parse family and multiple variants', function(){
        neue.parse('Source Sans Pro:n2,i2,n3,i3,n4,i4,n6,i6,n7,i7,n9,i9').should.eql({
            family: 'Source Sans Pro',
            variations: ['n2', 'i2', 'n3', 'i3', 'n4', 'i4', 'n6', 'i6', 'n7', 'i7', 'n9', 'i9']
        })
    })

    it('should parsed messed up spacing and whatnot', function(){
        neue.parse('    Source Sans Pro :: n4  ,jk, n6,,,,,').should.eql({
            family: 'Source Sans Pro',
            variations: ['n4', 'n6']
        })
    })

})

describe('stringify', function(){

    it('should stringify family', function(){
        neue.stringify('Source Sans Pro').should.eql([
            'source-sans-pro-n4'
        ])
    })

    it('should stringify family and single variant', function(){
        neue.stringify('Source Sans Pro:n4').should.eql([
            'source-sans-pro-n4'
        ])
    })

    it('should stringify family and multiple variants', function(){
        neue.stringify('Source Sans Pro:n2,i2,n3,i3,n4,i4,n6,i6,n7,i7,n9,i9').should.eql([
            'source-sans-pro-n2',
            'source-sans-pro-i2',
            'source-sans-pro-n3',
            'source-sans-pro-i3',
            'source-sans-pro-n4',
            'source-sans-pro-i4',
            'source-sans-pro-n6',
            'source-sans-pro-i6',
            'source-sans-pro-n7',
            'source-sans-pro-i7',
            'source-sans-pro-n9',
            'source-sans-pro-i9'
        ])
    })

    it('should stringify messed up spacing and whatnot', function(){
        neue.stringify('    Source Sans Pro :: n4  ,jk, n6,,,,,').should.eql([
            'source-sans-pro-n4',
            'source-sans-pro-n6'
        ])
    })

})
