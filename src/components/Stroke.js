import React from 'react'

const firstRow =
  ['t', 'p', 'h', '', 'F', 'P', 'L', 'T', 'D']
    .reduce((result, stenoKey, index) => {
      if (stenoKey) {
        result[stenoKey] =
          { x: index + 1
          , y: 1
          , w: 1
          , h: 1
          , rounded: false
          }
      }
      return result
    }, {})
const secondRow =
  ['k', 'w', 'r', '', 'R', 'B', 'G', 'S', 'Z']
    .reduce((result, stenoKey, index) => {
      if (stenoKey) {
        result[stenoKey] =
          { x: index + 1
          , y: 2
          , w: 1
          , h: 1
          , rounded: true
          }
      }
      return result
    }, {})
const thirdRow =
  ['a', 'o', '', 'e', 'u']
    .reduce((result, stenoKey, index) => {
      if (stenoKey) {
        result[stenoKey] =
          { x: index + 3.5
          , y: 3
          , w: 1
          , h: 1
          , rounded: true
          }
      }
      return result
    }, {})
const KEYS =
  [ '#', 's', 't', 'k', 'p', 'w', 'h', 'r'
  , 'a', 'o', '*', '-', 'e', 'u'
  , 'F', 'R', 'P', 'B', 'L', 'G', 'T', 'S', 'D', 'Z'
  ]
const KEY_INFO =
  { '#': { x: 0, y: 0, w: 11, h: 1, rounded: false }
  , s: { x: 0, y: 1, w: 1, h: 2, rounded: true }
  , '*': { x: 4, y: 1, w: 1, h: 2, rounded: true }
  , ...firstRow
  , ...secondRow
  , ...thirdRow
  }
const NUMBER_TO_KEYS =
  new Map(
    [ [ '1', 's' ]
    , [ '2', 't' ]
    , [ '3', 'p' ]
    , [ '4', 'h' ]
    , [ '5', 'a' ]
    , [ '0', 'o' ]
    , [ '6', 'f' ]
    , [ '7', 'p' ]
    , [ '8', 'l' ]
    , [ '9', 't' ]
    ]
  )
const LEFT_SHORTCUTS =
  new Map(
    [ [ 'j', 'skwr' ]
    , [ 'v', 'sr' ]
    , [ 'z', 'stkpw' ]
    , [ 'g', 'tkpw' ]
    , [ 'd', 'tk' ]
    , [ 'n', 'tph' ]
    , [ 'f', 'tp' ]
    , [ 'x', 'kp' ]
    , [ 'c', 'kr' ]
    , [ 'y', 'kwr' ]
    , [ 'q', 'kw' ]
    , [ 'b', 'pw' ]
    , [ 'm', 'ph' ]
    , [ 'l', 'hr' ]
    ]
  )

const MID_SHORTCUTS =
  new Map(
    [ [ 'oo', 'ao' ]
    , [ 'ii', 'aoeu' ]
    , [ 'uu', 'aou' ]
    , [ 'aa', 'aeu' ]
    , [ 'ee', 'aoe' ]
    , [ 'i', 'eu' ]
    ]
  )

const RIGHT_SHORTCUTS =
  new Map(
    [ [ 'ch', 'fp' ]
    , [ 'shn', 'gs' ]
    , [ 'sh', 'rb' ]
    , [ 'j', 'pblg' ]
    , [ 'n', 'pb' ]
    , [ 'x', 'bgs' ]
    , [ 'k', 'bg' ]
    , [ 'm', 'pl' ]
    , [ 'v', '*f' ]
    ]
  )
const NUMBER_PATTERN = /\d/

const SPLIT_PATTERN =
  /(j?v?s?z?g?f?t?x?c?k?d?n?m?b?p?y?q?w?h?r?l?)((?:a?o?e?u?i?\*?-?)+)((?:sh)?(?:ch)?v?f?r?n?m?j?p?k?x?b?l?g?t?s?d?z?)/

class Stroke {
  static replaceShortcuts(replacements, steno) {
    replacements.forEach((longhand, shorthand) => {
      steno = steno.replace(shorthand, longhand)
    })
    return steno
  }

  static normalizeStroke(rawStroke) {
    rawStroke = rawStroke ? rawStroke.trim() : null
    if (!rawStroke) return null
    const numberBar = NUMBER_PATTERN.test(rawStroke) || rawStroke.includes('#')
    if (numberBar) {
      rawStroke = Stroke.replaceShortcuts(NUMBER_TO_KEYS, rawStroke)
    }

    const stenoParts = rawStroke.split(SPLIT_PATTERN)
    if (stenoParts.length !== 5) return false
    let [, leftHand, midHand, rightHand, ] = stenoParts
    leftHand = Stroke.replaceShortcuts(LEFT_SHORTCUTS, leftHand)
    midHand = Stroke.replaceShortcuts(MID_SHORTCUTS, midHand)
    rightHand = Stroke.replaceShortcuts(RIGHT_SHORTCUTS, rightHand)
    return (
      { left: (numberBar ? '#' : '') + leftHand.toUpperCase()
      , mid: midHand.toUpperCase()
      , right: rightHand.toUpperCase()
      }
    )
  }

  constructor(rawSteno) {
    this.isValid = false
    rawSteno = rawSteno.toLowerCase()
    KEYS.reduce((stroke, key) => {
      stroke[key] = false
      return stroke
    }, this)
    const normalized = Stroke.normalizeStroke(rawSteno)
    if (!normalized) return
    normalized.left.split('').forEach(stenoKey => {
      stenoKey = stenoKey.toLowerCase()
      if (KEYS.includes(stenoKey)) {
        this[stenoKey] = true
        this.isValid = true
      }
    })
    normalized.mid.split('').forEach(stenoKey => {
      stenoKey = stenoKey.toLowerCase()
      if (KEYS.includes(stenoKey)) {
        this[stenoKey] = true
        this.isValid = true
      }
    })
    normalized.right.split('').forEach(stenoKey => {
      stenoKey = stenoKey.toUpperCase()
      if (KEYS.includes(stenoKey)) {
        this[stenoKey] = true
        this.isValid = true
      }
    })
    if (['a', 'o', 'e', 'u', '*'].every(key => !this[key])) {
      this['-'] = true
    }
  }

  toString() {
    return KEYS.reduce((normalized, key) => {
      if (this[key]) {
        return normalized + key.toUpperCase()
      }
      return normalized
    }, '')
  }

  get SVG() {
    return (
      <svg height="400" width="450">
        <path d="M 100 350 q 150 -300 300 0" stroke="blue"
  stroke-width="5" fill="red" />
      </svg>
    )
  }
}

export default Stroke
