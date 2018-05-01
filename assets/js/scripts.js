var dec2hex = (num) => num.toString(16)
var hex2dec = (num) => parseInt(num, 16)

var randNum = (min, max) => {
    if (!max) {
        max = min
        min = 0
    }

    return Math.floor(Math.random() * max + min)
}
var randArr = (arr) => arr[randNum(arr.length)]
var rand = (min, max) => (min instanceof Array) ? randArr(min) : randNum(min, max)

var randomOfType = (arr, type) => {
    var results = arr.filter(function (v, i) {
        return v.type == type
    })

    return results[rand(0, results.length)]
}

var findById = (arr, id) => arr.find((v, i) => v.id == id)

var get = (id) => document.getElementById(id)
var getTpl = (id) => doT.template(get('tpl-' + id).innerHTML)

var tpl = {
    gear: getTpl('gear')
}

var elems = {
    equipment: get('equipment')
}

var dataSources = {
    armor: armor,
    weapon: weapons,
    charm: charms
}

var encodingDictionary = {
    a: 'armor',
    armor: 'a',
    weapon: 'w',
    w: 'weapon',
    charm: 'c',
    c: 'charm'
}

function Slot(rank) {
    this.rank = rank
    this.decoration = false
}

class Gear {
    constructor(initialData) {
        this.raw = initialData

        switch (this.raw.category) {
            case 'armor':

                break;

            case 'weapon':

                break;

            case 'charm':
                this.raw.type = 'charm'
                this.raw.slots = []
                this.raw.rank = Math.min(+this.raw.rank, this.raw.ranks.length - 1)
                var c = this.raw.ranks[this.raw.rank]
                this.rank = this.raw.rank
                this.raw.rarity = c.rarity
                this.raw.name = c.name
                this.raw.skills = c.skills
                break;

            default:
                break;
        }

        this.name = this.raw.name
        this.type = this.raw.type
        this.id = this.raw.id
        this.category = this.raw.category
        this.rarity = this.raw.rarity
        this.slots = []
        for (var slot of this.raw.slots) {
            this.slots.push(new Slot(slot.rank))
        }
    }
}

var addGear = (gear) => {
    // var data = findById(dataSources[gear.category], gear.id)
    var data = gear

    if (!data.type)
        data.type = gear.category

    if (!data.slots)
        data.slots = []

    elems.equipment.innerHTML += tpl.gear(data)
}

var refreshGear = () => {
    elems.equipment.innerHTML = ''

    for (var piece of state.gear) {
        addGear(piece)
    }
}

var refreshStats = () => {
    for(var piece of state.gear) {

    }
}

var loadState = () => {
    var pieces = (document.location.hash).slice(1).split('_')

    for(var piece of pieces) {
        var metadata = piece.split('-')

        var category = encodingDictionary[metadata[0]]
        var id = hex2dec(metadata[1])

        var g = findById(dataSources[category], id)

        merge(g, 'category', category)
        if(category == 'charm') {
            console.log(metadata)
            merge(g, 'rank', metadata[2])
        }

        var gg = new Gear(g)

        if(metadata[2] && category != 'charm') {
            var slots = metadata[2].split('&')
            for (var i in slots) {
                var decorationId = hex2dec(slots[i])
                var decoration = findById(decorations, decorationId)
                if(gg.slots[i].rank <= decoration.slot) {
                    gg.slots[i].decoration = decoration
                }
            }
        }
        state.gear.push(gg)
    }
}

var setState = () => {
    var hash = ''

    for (var piece of state.gear) {
        hash += encodingDictionary[piece.category] + '-'
        hash += dec2hex(piece.id) + '-'
        for (var slot of piece.slots) {
            if(slot.decoration)
               hash += dec2hex(slot.decoration.id) + '&'
        }
        if(piece.category == 'charm') {
            console.log(piece)
            hash += piece.rank + '-'
        }
        hash = hash.slice(0, -1)
        hash += '_'
    }

    hash = hash.slice(0, -1)

    document.location.hash = hash
}


// var w = weapons[rand(0, weapons.length)]

// elems.equipment.innerHTML += tpl.gear({
//     name: w.name,
//     type: w.type,
//     slots: w.slots,
//     rarity: w.rarity
// })

// var c = charms[rand(0, charms.length)].ranks[0]

// elems.equipment.innerHTML += tpl.gear({
//     name: c.name,
//     type: 'charm',
//     slots: false,
//     rarity: c.rarity
// })

// var ii = rand(0, armor.length - 6)

// for(var i = 0; i < 5; i++) {
//     var a = armor[ii + i]

//     elems.equipment.innerHTML += tpl.gear({
//         name: a.name,
//         type: a.type,
//         slots: a.slots,
//         rarity: a.rarity
//     })
// }

var state = {
    editing: 0,
    gear: []
}

// elems.equipment.innerHTML += tpl.gear(findById(weapons, state.weapon.data.id))
// elems.equipment.innerHTML += tpl.gear(findById(charms, state.charm.id))

function merge(obj, prop, val) {
    obj[prop] = val

    return obj
}

function populateGear() {
    state.gear = []
    // state.gear = [{
    //     category: 'weapon',
    //     data: rand(weapons),
    //     decorations: [rand(decorations)]
    // }, {
    //     category: 'charm',
    //     data: rand(charms),
    //     decorations: []
    // }, {
    //     category: 'armor',
    //     data: randomOfType(armor, 'gloves'),
    //     decorations: [rand(decorations)]
    // }, {
    //     category: 'armor',
    //     data: randomOfType(armor, 'head'),
    //     decorations: [rand(decorations), rand(decorations)]
    // }, {
    //     category: 'armor',
    //     data: randomOfType(armor, 'waist'),
    //     decorations: [rand(decorations), rand(decorations), rand(decorations)]
    // }, {
    //     category: 'armor',
    //     data: findById(armor, 533),
    //     // data: randomOfType(armor, 'chest'),
    //     decorations: [rand(decorations)]
    // }, {
    //     category: 'armor',
    //     data: randomOfType(armor, 'legs'),
    //     decorations: [rand(decorations), rand(decorations)]
    // }]

    state.gear.push(new Gear(merge(rand(weapons), 'category', 'weapon')))
    state.gear.push(new Gear(merge(merge(rand(charms), 'category', 'charm'), 'rank', rand(2))))
    state.gear.push(new Gear(merge(randomOfType(armor, 'gloves'), 'category', 'armor')))
    state.gear.push(new Gear(merge(randomOfType(armor, 'head'), 'category', 'armor')))
    state.gear.push(new Gear(merge(randomOfType(armor, 'waist'), 'category', 'armor')))
    state.gear.push(new Gear(merge(findById(armor, 533), 'category', 'armor')))
    state.gear.push(new Gear(merge(randomOfType(armor, 'legs'), 'category', 'armor')))
}

function randomizeGear() {
    populateGear();
    refreshGear();
    setState();
    return state.gear
}

loadState()
refreshGear()
// re()

function test(func) {
    console.log(func(rand(armor)))
    console.log(func(rand(weapons)))
    console.log(func(rand(charms)))
}