var neue = require('../')

neue.load([
    { families: ['Grand Hotel'], css: 'fonts.css' }
], function(err){
    if (err) throw err
    document.getElementsByTagName('h1')[0].innerHTML = 'Done! (This should be set in Grand Hotel)'
})
