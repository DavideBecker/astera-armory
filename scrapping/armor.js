var metadata = require('./metadata')
var cheerio = require('cheerio');

module.exports = function(htmlString) {
    var armor = []

    var $ = cheerio.load(htmlString);

    $('.card.mb-2').each((i, armorSet) => {
        var $armorSet = $(armorSet)

        var pieces = []

        $armorSet.find('.card-body .table tbody tr').each((i, piece) => {
            var $piece = $(piece)

            var gems = []
            
            $piece.find('zmdi').each((i, $piece) => {
                if($piece.hasClass('zmdi-n-3-square')) {
                    gems.push(3)
                } else if($piece.hasClass('zmdi-n-2-square')) {
                    gems.push(2)
                } else if($piece.hasClass('zmdi-n-1-square')) {
                    gems.push(1)
                } else if($piece.hasClass('zmdi-n-minus')) {
                    gems.push(0)
                }
            })

            pieces.push({
                name: $piece.find('a').text(),
                type: metadata.armor[i],
                gems: gems
            })
        })
        
        armor.push({
            name: $armorSet.find('.card-header.text-center').text(),
            pieces: pieces
        })
    })

    return armor
}