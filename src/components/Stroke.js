import React from 'react'
import path from 'path-svg/svg-path'

const numberBarHeight = 0.55
const firstRow =
  ['t', 'p', 'h', '', 'F', 'P', 'L', 'T', 'D']
    .reduce((result, stenoKey, index) => {
      if (stenoKey) {
        result[stenoKey] =
          { x: index + 1
          , y: numberBarHeight
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
          , y: 1 + numberBarHeight
          , w: 1
          , h: 1
          , rounded: true
          }
      }
      return result
    }, {})
const thirdRow =
  ['a', 'o', 'e', 'u']
    .reduce((result, stenoKey, index) => {
      if (stenoKey) {
        result[stenoKey] =
          /**
           * With only one asterisk key, the vowel keys need to be separated
           * to avoid having them touch. With this code, I'm shifting them
           * a half unit apart by starting at 2.25 instead of 2.5, and then
           * having the right half (EU) start at 4.75 instead of 4.5.
           **/
          { x: index + 2.25 + (index >= 2 ? 0.5 : 0)
          , y: 2 + numberBarHeight
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
  { '#': { x: 0, y: 0, w: 10, h: numberBarHeight, rounded: false }
  , s: { x: 0, y: numberBarHeight, w: 1, h: 2, rounded: true }
  , '*': { x: 4, y: numberBarHeight, w: 1, h: 2, rounded: true }
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
const NUMBER_PATTERN = /\d|#/

const SPLIT_PATTERN =
  /(#?j?v?s?z?g?f?t?x?c?k?d?n?m?b?p?y?q?w?h?r?l?)((?:a?o?e?u?i?\*?-?)+)((?:sh)?(?:ch)?v?f?r?n?m?j?p?k?x?b?l?g?t?s?d?z?)/

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
    const numberBar = NUMBER_PATTERN.test(rawStroke)
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
      { left: (numberBar ? '#' : '') + leftHand.toUpperCase().replace('#', '')
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

  static Layout({chord, lettering, style}) {
    const unit = 50
    const aspectRatio = 1.2 // How much taller are keys than wide?
    const arcRadius = unit / 2
    const strokeWidth = unit / 25
    const padding = unit / 10

    const boardHeight = KEY_INFO.a.y + 1
    const rows = Math.ceil(KEY_INFO.a.y)
    const boardWidth = KEY_INFO.D.x + 1
    const columns = Math.ceil(KEY_INFO.D.x)
    const svgHeight =
      boardHeight * unit * aspectRatio + (rows + 2) * padding
    const svgWidth =
      boardWidth * unit + (columns + 2) * padding
    return (
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={
          { stroke: 'currentColor'
          , strokeWidth
          , fillOpacity: 0
          , maxWidth: 800
          , width: '100%'
          , maxWidth: 500
          , height: 'auto'
          , margin: '0 auto'
          }
        }
      >
        <style>{`
          .steno-key-active {
            fill: currentColor;
            fill-opacity: 0.3;
          }
        `}</style>
        { KEYS.map(
            currentKey => {
              const keyInfo = KEY_INFO[currentKey]
              if (!keyInfo) return null
              const internalHorizontalPadding = keyInfo.w > 1
                ? parseInt(keyInfo.w - 1) * padding
                : 0

              // We need to break the padding rules for E and U
              const removePadding = ['e', 'u'].includes(currentKey) ? 1 : 0
              const startX = keyInfo.x * unit + padding * (Math.ceil(keyInfo.x + 1) - removePadding)
              const startY = keyInfo.y * unit * aspectRatio + padding * Math.ceil(keyInfo.y + 1)
              const keyPath = path() // Draw the common part of the key (flat or rounded)
                .to(startX, startY)
                .rel() // Operating relatively
                .hline(keyInfo.w * unit + internalHorizontalPadding) // Only define the top of the path
              const internalVerticalPadding = keyInfo.h > 1
                ? parseInt(keyInfo.h - 1) * padding
                : 0
              return (
                <g key={currentKey}>
                  <path
                    className={`steno-key ${chord[currentKey]? 'steno-key-active' : ''}`}
                    d={
                      !keyInfo.rounded ?
                        // Flat key
                        keyPath
                          .vline(keyInfo.h * unit * aspectRatio + internalVerticalPadding)
                          .hline(-keyInfo.w * unit - internalHorizontalPadding)
                          .close()
                          .str() :
                        // Rounded key
                        keyPath
                          .vline(keyInfo.h * unit * aspectRatio - arcRadius + internalVerticalPadding)
                          .arc(arcRadius * keyInfo.w, arcRadius, 0, 0, 1, -keyInfo.w * unit, 0)
                          .close()
                          .str()
                    }
                  >
                  </path>
                  { lettering[currentKey]
                    ? <text
                        style={
                          { strokeWidth: 0
                          , fill: 'currentColor'
                          , fillOpacity: 1
                          , fontSize: 25
                          }
                        }
                        textAnchor='middle'
                        dominantBaseline="central"
                        x={startX + keyInfo.w * unit / 2}
                        y={startY + keyInfo.h * unit * aspectRatio / 2
                            // Raise letters in rounded keys slightly
                            - (keyInfo.rounded && keyInfo.h === 1 ? arcRadius / 7 : 0)}
                      >
                        {currentKey.toUpperCase()}
                      </text>
                    : null
                  }
                </g>
              )
            }
          )
        }
      </svg>
    )
  }
}

export default Stroke
